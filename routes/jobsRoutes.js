const express = require('express');
const router = express.Router();
const Job = require('../models/jobModel');
const ErrorResponse = require('../utils/errorResponse');
const { createJob, singleJob, updateJob, showJobs, } = require('../controllers/jobsController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');


//jobs routes

// /api/job/create
router.post('/job/create', isAuthenticated, isAdmin, createJob);
// /api/job/id
router.get('/job/:id', singleJob);
// /api/job/update/job_id
router.put('/job/update/:job_id', isAuthenticated, isAdmin, updateJob);
// /api/jobs/show
router.get('/jobs/show', showJobs);

//add new route for deleting jobs
router.delete('/jobs/:id', isAuthenticated, isAdmin, async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        error: {
          message: 'Job not found'
        }
      });
    }

    await job.remove();

    res.status(200).json({
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      error: err
    });
  }
});


module.exports = router;
