const router = require('express').Router()
const { newCandidateRegistrationController, candidateLoginController, resetPasswordController } = require('../controller/candidateController')
const tokenVerification = require('./verification/candidateVerification')

// public route(s)
router.post('/candidate-registration', newCandidateRegistrationController)
router.post('/login', candidateLoginController)
router.post('/reset-password', resetPasswordController)

// protected route(s)
router.use(tokenVerification)
router.use('/job', require('./jobPostRoutes'))

module.exports = router