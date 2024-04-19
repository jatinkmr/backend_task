const dataBase = require('../index')
const JobPost = dataBase.jobpost

const jobCreationService = async reqBodyData => {
    return await JobPost.create(reqBodyData)
}

const fetchAllJobCreatedBy = async recruiterEmail => {
    return await JobPost.findAll({
        where: {
            createdby: recruiterEmail
        }
    })
}

const fetchAllJobService = async () => {
    return await JobPost.findAll()
}

const checkIfJobExistService = async jobId => {
    return await JobPost.findByPk(jobId)
}

module.exports = {
    jobCreationService,
    fetchAllJobCreatedBy,
    fetchAllJobService,
    checkIfJobExistService
}