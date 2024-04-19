const router = require('express').Router()
const { newRecruiterRegistrationController, recruiterLoginController, resetPasswordController } = require('../controller/recruiterController')
const tokenVerification = require('./verification/recruiterVerification')

// public route(s)
router.post('/recruiter-registration', newRecruiterRegistrationController)
router.post('/login', recruiterLoginController)
router.post('/reset-password', resetPasswordController)

// protected route(s)
router.use(tokenVerification)
router.use('/job', require('./jobPostRoutes'))

module.exports = router