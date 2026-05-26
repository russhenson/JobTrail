const express = require('express');
const router = express.Router();

const job = require('../controllers/jobController');
const auth = require('../middleware/authMiddleware');

// All routes here require a valid token (auth middleware runs first)
router.get('/dashboard', auth, job.getDashboard); // GET  /jobs/dashboard
router.get('/', auth, job.getJobs);               // GET  /jobs
router.post('/', auth, job.createJob);            // POST /jobs
router.put('/:id', auth, job.updateJob);          // PUT  /jobs/:id
router.delete('/:id', auth, job.deleteJob);       // DELETE /jobs/:id

module.exports = router;
