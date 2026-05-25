const Job = require('../models/Job');

// paginated
exports.getJobs = async (req, res) => {
    try {
        // eslint-disable-next-line radix
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const skip = (page - 1) * limit;

        const [jobs, total] = await Promise.all([
            Job.find({ userId: req.user.userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Job.countDocuments({ userId: req.user.userId }),
        ]);

        res.json({
            jobs,
            page,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
        });
    } catch (err) {
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
