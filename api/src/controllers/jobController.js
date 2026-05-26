const Job = require('../models/Job');
const dayjs = require('dayjs');
const mongoose = require('mongoose');

// Returns stats for the dashboard header: total apps, status breakdown,
// next upcoming interview, pending follow-ups count, and most recent application
exports.getDashboard = async (req, res) => {
    try {
        // aggregate() requires an actual ObjectId, not a plain string
        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const allStatuses = ['Saved', 'Applied', 'Follow Up', 'Interview', 'Offer', 'Hired', 'Rejected'];

        // Run all 5 DB queries at the same time instead of one by one
        const [statusCounts, total, upcomingInterview, pendingFollowUps, recentApplication] = await Promise.all([
            // Groups jobs by status and counts each group
            Job.aggregate([{ $match: { userId } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
            Job.countDocuments({ userId }),
            // Gets the soonest upcoming interview (interview date >= now, sorted ascending)
            Job.findOne({
                userId,
                status: 'Interview',
                interviewDatetime: { $gte: new Date().toISOString() },
            }).sort({ interviewDatetime: 1 }),
            Job.countDocuments({ userId, status: 'Follow Up' }),
            // Gets the most recently created job (only role, company, createdAt — not the whole doc)
            Job.findOne({ userId }).sort({ createdAt: -1 }).select('role company createdAt'),
        ]);

        // Start all statuses at 0 so the frontend always gets every key, even if count is 0
        const statusMap = Object.fromEntries(allStatuses.map(s => [s, 0]));
        statusCounts.forEach(({ _id, count }) => {
            if (_id in statusMap) statusMap[_id] = count;
        });

        res.json({
            total,
            statusCounts: statusMap,
            upcomingInterview: upcomingInterview
                ? {
                      company: upcomingInterview.company,
                      role: upcomingInterview.role,
                      datetime: dayjs(upcomingInterview.interviewDatetime).format('DD MMM YYYY, hh:mm A'),
                  }
                : null,
            pendingFollowUps,
            recentApplication: recentApplication
                ? {
                      jobTitle: recentApplication.role,
                      company: recentApplication.company,
                      daysAgo: dayjs().diff(dayjs(recentApplication.createdAt), 'day'),
                  }
                : null,
        });
    } catch (err) {
        console.error('GET DASHBOARD ERROR:', err);
        res.status(500).json({ error: 'Failed to fetch dashboard.' });
    }
};

// Returns a paginated list of jobs (3 per page), with optional status and date filters
exports.getJobs = async (req, res) => {
    try {
        // eslint-disable-next-line radix
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const skip = (page - 1) * limit; // how many records to skip for this page
        const { status, dateFilter } = req.query;

        // Base query — always scoped to the logged-in user
        const query = { userId: req.user.userId };

        // Add status filter if provided
        if (status) query.status = status;

        // Add date range filter based on the selected option
        if (dateFilter && dateFilter !== 'All') {
            let from;
            const now = dayjs();
            if (dateFilter === 'Last 3 days') from = now.subtract(3, 'day');
            else if (dateFilter === 'This week') from = now.startOf('week');
            else if (dateFilter === 'This month') from = now.startOf('month');

            if (from) {
                query.dateApplied = {
                    $gte: from.toISOString(),
                    $lte: now.toISOString(),
                };
            }
        }

        // Fetch the jobs page and the total count (for pagination) at the same time
        const [jobs, filteredTotal] = await Promise.all([
            Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Job.countDocuments(query),
        ]);

        res.json({
            jobs,
            page,
            totalPages: Math.ceil(filteredTotal / limit),
            hasNextPage: page < Math.ceil(filteredTotal / limit), // used by the frontend to know if there's a next page to load
        });
    } catch (err) {
        console.error('GET JOBS ERROR:', err);
        res.status(500).json({ error: 'Failed to fetch jobs.' });
    }
};

exports.createJob = async (req, res) => {
    try {
        const {
            company,
            role,
            location,
            dateApplied,
            status,
            jobType,
            jobSetup,
            salary,
            applicationLink,
            interviewDatetime,
            interviewLink,
            recruiterName,
            recruiterContact,
            notes,
        } = req.body;

        // Validate required fields
        if (!company || !role || !location || !dateApplied || !status || !jobType || !jobSetup) {
            return res.status(400).json({ error: 'Please fill in all required fields.' });
        }

        const job = await Job.create({
            userId: req.user.userId,
            company,
            role,
            location,
            dateApplied,
            status,
            jobType,
            jobSetup,
            salary: salary || null,
            applicationLink: applicationLink || null,
            interviewDatetime: interviewDatetime || null,
            interviewLink: interviewLink || null,
            recruiterName: recruiterName || null,
            recruiterContact: recruiterContact || null,
            notes: notes || null,
        });

        res.status(201).json(job);
    } catch (err) {
        console.error('CREATE JOB ERROR:', err);
        res.status(500).json({ error: 'Failed to create job.' });
    }
};

exports.updateJob = async (req, res) => {
    try {
        // userId check ensures a user can only update their own jobs
        // returnDocument: 'after' returns the updated version, not the old one
        // runValidators: true makes sure the schema rules still apply on update
        const job = await Job.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, req.body, {
            returnDocument: 'after',
            runValidators: true,
        });

        if (!job) return res.status(404).json({ error: 'Job not found.' });

        res.json(job);
    } catch (err) {
        console.error('UPDATE JOB ERROR:', err);
        res.status(500).json({ error: 'Failed to update job.' });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        // userId check ensures a user can only delete their own jobs
        const job = await Job.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });

        if (!job) return res.status(404).json({ error: 'Job not found.' });

        res.json({ success: true });
    } catch (err) {
        console.error('DELETE JOB ERROR:', err);
        res.status(500).json({ error: 'Failed to delete job.' });
    }
};
