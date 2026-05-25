const Job = require('../models/Job');
const dayjs = require('dayjs');

// paginated
exports.getJobs = async (req, res) => {
    try {
        // eslint-disable-next-line radix
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const skip = (page - 1) * limit;

        const { status, dateFilter } = req.query;

        // ── Build query ──────────────────────────────────────────
        const query = { userId: req.user.userId };

        // Status filter
        if (status) query.status = status;

        // Date filter
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

        // ── Status counts (always based on user's full data, ignoring filters) ──
        const allStatuses = ['Saved', 'Applied', 'Follow Up', 'Interview', 'Offer', 'Hired', 'Rejected'];

        const statusCounts = await Job.aggregate([
            { $match: { userId: req.user.userId } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        const statusMap = Object.fromEntries(allStatuses.map(s => [s, 0]));
        statusCounts.forEach(({ _id, count }) => {
            if (_id in statusMap) statusMap[_id] = count;
        });

        // ── Upcoming interview ───────────────────────────────────
        const upcomingInterview = await Job.findOne({
            userId: req.user.userId,
            status: 'Interview',
            interviewDatetime: { $gte: new Date().toISOString() },
        }).sort({ interviewDatetime: 1 });

        // ── Pending follow-ups ───────────────────────────────────
        const pendingFollowUps = await Job.countDocuments({
            userId: req.user.userId,
            status: 'Follow Up',
        });

        // ── Most recent application ──────────────────────────────
        const recentApplication = await Job.findOne({ userId: req.user.userId })
            .sort({ createdAt: -1 })
            .select('role company createdAt');

        // ── Paginated jobs ───────────────────────────────────────
        const [jobs, filteredTotal, total] = await Promise.all([
            Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Job.countDocuments(query),
            Job.countDocuments({ userId: req.user.userId }),
        ]);

        res.json({
            jobs,
            page,
            totalPages: Math.ceil(filteredTotal / limit),
            hasNextPage: page < Math.ceil(filteredTotal / limit),
            // dashboard data
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
