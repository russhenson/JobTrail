const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

        // Required
        company: { type: String, required: true },
        role: { type: String, required: true },
        location: { type: String, required: true },
        dateApplied: { type: String, required: true },
        status: {
            type: String,
            enum: ['Saved', 'Applied', 'Follow Up', 'Interview', 'Offer', 'Hired', 'Rejected'],
            required: true,
        },
        jobType: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Contractual'],
            required: true,
        },
        jobSetup: {
            type: String,
            enum: ['Hybrid', 'Remote', 'On-site'],
            required: true,
        },

        // Optional
        salary: { type: String, default: null },
        applicationLink: { type: String, default: null },
        interviewDatetime: { type: String, default: null },
        interviewLink: { type: String, default: null },
        recruiterName: { type: String, default: null },
        recruiterContact: { type: String, default: null },
        notes: { type: String, default: null },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Job', jobSchema);
