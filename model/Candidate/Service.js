const database = require('../index')
const Candidate = database.candidate

const newCandidateRegistrationService = async reqBodyData => {
    return await Candidate.create(reqBodyData)
}

const checkIfCandidateExist = async email => {
    let candidate = await Candidate.findOne({
        where: {
            email
        }
    })

    if (candidate) return candidate;
    else return false;
}

const passwordUpdationService = async reqBodyData => {
    let candidate = await Candidate.findOne({
        where: {
            email: reqBodyData.email
        }
    })
    candidate.password = reqBodyData.password
    return candidate.save()
}

module.exports = {
    newCandidateRegistrationService,
    checkIfCandidateExist,
    passwordUpdationService
}