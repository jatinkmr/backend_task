const Bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { newCandidateRegistrationService, checkIfCandidateExist, passwordUpdationService } = require('../model/Candidate/Service')

const newCandidateRegistrationController = async (req, res, next) => {
    try {
        const { firstName, lastName, password, confirm_password, email } = req.body
        if (!firstName || !lastName ||!password || !confirm_password  || !email ) {
            return res.status(200).json({
                error: true,
                message: 'Check body data some fields are missing'
            })
        }

        // check if user exist
        const isCandidateExist = await checkIfCandidateExist(email)
        if (isCandidateExist) {
            return res.status(200).json({
                error: true,
                message: 'Candidate with given mail already exist!'
            })
        }

        // check passwords match
        if (password !== confirm_password) {
            return res.status(200).json({
                error: true,
                message: 'Password not matched! Please check again!'
            })
        }

        const salt = await Bcrypt.genSalt(10)
        let bcryptedPassword = await Bcrypt.hash(password, salt)

        const response = await newCandidateRegistrationService({
            firstName,
            lastName,
            email,
            password: bcryptedPassword
        })

        if (response) {
            res.status(201).json({
                error: false,
                message: 'Candidate registered Successfully!'
            })
        }
    } catch (error) {
        next(error)
    }
}

const candidateLoginController = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(200).json({
                error: true,
                message: 'Both email and password fields are mandatory!'
            })
        }

        // check if user exist
        const isCandidateExist = await checkIfCandidateExist(email)
        if (!isCandidateExist) {
            return res.status(200).json({
                error: true,
                message: 'Candidate not registered! Please register first then try login!'
            })
        }

        const validPass = await Bcrypt.compare(password, isCandidateExist.password);
        if (!validPass) {
            return res.status(200).json({
                error: true,
                message: 'Invalid Password!'
            });
        }

        const token = jwt.sign({
            email: isCandidateExist.email
        }, 'CANDIDATE_TOKEN_SECRET', {
            expiresIn: '1d'
        })

        if (token) {
            return res.status(200).json({
                error: false,
                message: 'Candidate LoggedIn',
                token
            })
        }
    } catch (error) {
        next(error)
    }
}

const resetPasswordController = async (req, res, next) => {
    try {
        const { email, password, confirm_password } = req.body
        if (!email || !password || !confirm_password) {
            return res.status(200).json({
                error: true,
                message: 'email, password and confirm_password fields are mandatory!'
            })
        }

        // check if the password matched or not
        if (password !== confirm_password) {
            return res.status(200).json({
                error: true,
                message: 'Please check password. Password not matched!!'
            })
        }

        // check if user exist
        const isCandidateExist = await checkIfCandidateExist(email)
        if (!isCandidateExist) {
            return res.status(200).json({
                error: true,
                message: 'Candidate not registered!'
            })
        }

        const salt = await Bcrypt.genSalt(10)
        let bcryptedPassword = await Bcrypt.hash(password, salt)

        const response = await passwordUpdationService({
            email,
            password: bcryptedPassword
        })

        if (response) {
            return res.status(200).json({
                error: false,
                message: 'Password updated successfully!!'
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    newCandidateRegistrationController,
    candidateLoginController,
    resetPasswordController
}