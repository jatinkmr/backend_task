const router = require('express').Router()

router.use('/candidate', require('./candidateRoutes'))
router.use('/recruiter', require('./recruiterRoutes'))
// router.use('/job', require('./jobPostRoutes'))

module.exports = router