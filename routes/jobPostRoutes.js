const router = require('express').Router()
const { newJobPostCreationController, fetchRecruiterCreatedJobController, fetchAllJobForCandidateController, candidateApplyForJobController, fetchJobApplicationController } = require('../controller/jobPostController')

// for recruiter
router.post('/create-new-job', newJobPostCreationController)
router.get('/fetch-job', fetchRecruiterCreatedJobController)
router.get('/fetch-job-application', fetchJobApplicationController)

// for candidate
router.get('/fetch-all-job', fetchAllJobForCandidateController)
router.post('/apply-for-job', candidateApplyForJobController)

module.exports = router