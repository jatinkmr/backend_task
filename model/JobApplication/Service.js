const dataBase = require('../index')
const JobApplication = dataBase.jobapplication

const jobApplicationService = async reqBodyData => {
    return await JobApplication.create(reqBodyData)
}

const checkIfCandidateAlreadyApplied = async reqBodyData => {
    let isAlreadyApplied = await JobApplication.findOne({
        where: {
            jobid: reqBodyData.jobid,
            candidateid: reqBodyData.candidateid
        }
    })

    if (isAlreadyApplied) return true
    else return false
}

module.exports = {
    jobApplicationService,
    checkIfCandidateAlreadyApplied
}