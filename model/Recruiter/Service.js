const dataBase = require('../index')
const Recruiter = dataBase.recruiter

const checkIsRecruiterExist = async email => {
    let recruiter = Recruiter.findOne({
        where: {
            email
        }
    })

    if (recruiter) return recruiter
    else return false
}

const newRecruiterCreationService = async reqBodyData => {
    return await Recruiter.create(reqBodyData)
}

const updateRecruiterPassword = async reqBodyData => {
    let recruiterData = await Recruiter.findOne({
        where: {
            email: reqBodyData.email
        }
    })
    recruiterData.password = reqBodyData.password
    return recruiterData.save()
}

module.exports = {
    newRecruiterCreationService,
    checkIsRecruiterExist,
    updateRecruiterPassword
}