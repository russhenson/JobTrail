const express = require('express');
const router = express.Router();

const job = require('../controllers/jobController');
const auth = require('../middleware/authMiddleware');

router.get('/dashboard', auth, job.getDashboard);
router.get('/', auth, job.getJobs);
router.post('/', auth, job.createJob);
router.put('/:id', auth, job.updateJob);
router.delete('/:id', auth, job.deleteJob);

module.exports = router;
