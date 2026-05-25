const Job = require('../models/Job');
const dayjs = require('dayjs');
const mongoose = require('mongoose');

exports.getDashboard = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const allStatuses = ['Saved', 'Applied', 'Follow Up', 'Interview', 'Offer', 'Hired', 'Rejected'];

        const [statusCounts, total, upcomingInterview, pendingFollowUps, recentApplication] = await Promise.all([
            Job.aggregate([{ $match: { userId } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
            Job.countDocuments({ userId }),
            Job.findOne({
                userId,
                status: 'Interview',
                interviewDatetime: { $gte: new Date().toISOString() },
            }).sort({ interviewDatetime: 1 }),
            Job.countDocuments({ userId, status: 'Follow Up' }),
            Job.findOne({ userId }).sort({ createdAt: -1 }).select('role company createdAt'),
        ]);
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

// ── getJobs — filters only, no dashboard data ─────────────────────────────
exports.getJobs = async (req, res) => {
    try {
        // eslint-disable-next-line radix
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const skip = (page - 1) * limit;
        const { status, dateFilter } = req.query;

        const query = { userId: req.user.userId };

        if (status) query.status = status;

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

        const [jobs, filteredTotal] = await Promise.all([
            Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Job.countDocuments(query),
        ]);

        res.json({
            jobs,
            page,
            totalPages: Math.ceil(filteredTotal / limit),
            hasNextPage: page < Math.ceil(filteredTotal / limit),
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
        const job = await Job.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });

        if (!job) return res.status(404).json({ error: 'Job not found.' });

        res.json({ success: true });
    } catch (err) {
        console.error('DELETE JOB ERROR:', err);
        res.status(500).json({ error: 'Failed to delete job.' });
    }
};
