const Job = require("../models/Job");

exports.getJobs = async (req, res) => {
  const jobs = await Job.find({ userId: req.user.id });
  res.json(jobs);
};

exports.createJob = async (req, res) => {
  const job = await Job.create({
    ...req.body,
    userId: req.user.id
  });
  res.json(job);
};

exports.updateJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(job);
};

exports.deleteJob = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};