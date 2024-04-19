const { newRecruiterCreationService, checkIsRecruiterExist, updateRecruiterPassword } = require('../model/Recruiter/Service')
const Bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const newRecruiterRegistrationController = async (req, res, next) => {
    try {
        const { firstName, lastName, password, confirm_password, email } = req.body
        if (!firstName || !lastName || !password || !confirm_password || !email) {
            return res.status(200).json({
                error: true,
                message: 'All Fields are mandatory!'
            })
        }

        // check if user exist
        let isRecruiterExist = await checkIsRecruiterExist(email)
        if (isRecruiterExist) {
            return res.status(200).json({
                error: true,
                message: 'Recruiter with given mail address already exist! Please check details!'
            })
        }

        if (password !== confirm_password) {
            return res.status(200).json({
                error: true,
                message: 'Password not matched! Please check your Password.'
            })
        }

        const salt = await Bcrypt.genSalt(10)
        let bcryptedPassword = await Bcrypt.hash(password, salt)

        const response = await newRecruiterCreationService({
            firstName,
            lastName,
            email,
            password: bcryptedPassword
        })

        if (response) {
            return res.status(201).json({
                error: false,
                message: 'Recruiter Created Successfully!'
            })
        }
    } catch (error) {
        next(error)
    }
}

const recruiterLoginController = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(200).json({
                error: true,
                message: 'Both email and password fields are mandatory!'
            })
        }

        let isRecruiterExist = await checkIsRecruiterExist(email)
        console.log('isRecruiterExist',isRecruiterExist)
        if (!isRecruiterExist) {
            return res.status(200).json({
                error: true,
                message: 'Recruiter with given mail address already exist! Please check details!'
            })
        }

        const validPass = await Bcrypt.compare(password, isRecruiterExist.password)
        if (!validPass) {
            return res.status(200).json({
                error: true,
                message: 'Invalid Password!'
            })
        }

        const token = jwt.sign({
            email: isRecruiterExist.email
        }, 'RECRUITER_TOKEN_SECRET', {
            expiresIn: '1d'
        })

        if (token) {
            return res.status(200).json({
                error: false,
                message: 'Recruiter LoggedIn',
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
                message: 'All Fields are mandatory!!'
            })
        }

        // check if recruiter exist
        let isRecruiterExist = await checkIsRecruiterExist(email)
        if (!isRecruiterExist) {
            return res.status(200).json({
                error: true,
                message: 'Recruiter with given mail address already exist! Please check details!'
            })
        }

        if (password !== confirm_password) {
            return res.status(200).json({
                error: true,
                message: 'Password not matched! Please check password!!'
            })
        }

        const salt = await Bcrypt.genSalt(10)
        let bcryptedPassword = await Bcrypt.hash(password, salt)

        const response = await updateRecruiterPassword({
            email,
            password: bcryptedPassword
        })

        if (response) {
            return res.status(200).json({
                error: false,
                message: 'Password updated Successfully!!'
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    newRecruiterRegistrationController,
    recruiterLoginController,
    resetPasswordController
}