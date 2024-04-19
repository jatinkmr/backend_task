const { jobCreationService, fetchAllJobCreatedBy, fetchAllJobService, checkIfJobExistService } = require('../model/JobPost/Service')
const { checkIfCandidateExist } = require('../model/Candidate/Service')
const { jobApplicationService, checkIfCandidateAlreadyApplied } = require('../model/JobApplication/Service')
const { sequelize, jobapplication } = require('../model')

const newJobPostCreationController = async (req, res, next) => {
    try {
        const { title, description } = req.body
        if (!title || !description) {
            return res.status(200).json({
                error: true,
                message: 'Job Title and Description both are mandatory!'
            })
        }

        const response = await jobCreationService({
            title,
            description,
            createdby: req.recruiter.email
        })

        if (response) {
            return res.status(201).json({
                error: false,
                message: 'Job Post Created Successfully!'
            })
        }
    } catch (error) {
        next(error)
    }
}

const fetchRecruiterCreatedJobController = async (req, res, next) => {
    try {
        const recruiterEmail = req.recruiter.email

        const response = await fetchAllJobCreatedBy(recruiterEmail)

        if (response && response.length) {
            return res.status(200).json({
                error: false,
                message: 'Job Fetched!!',
                data: response
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'No Job Posted Yet!',
                data: []
            })
        }
    } catch (error) {
        next(error)
    }
}

const fetchAllJobForCandidateController = async (req, res, next) => {
    try {
        const response = await fetchAllJobService()

        if (response && response.length) {
            return res.status(200).json({
                error: false,
                message: 'Job Fetched!!',
                data: response
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'No Job Available!',
                data: []
            })
        }
    } catch (error) {
        next(error)
    }
}

const candidateApplyForJobController = async (req, res, next) => {
    try {
        const { jobId } = req.body
        const isJobExist = await checkIfJobExistService(jobId)
        if (!isJobExist) {
            return res.status(200).json({
                error: true,
                message: 'No job exist with this given job-id!'
            })
        }

        const candidate = await checkIfCandidateExist(req.candidate.email)
        if (!candidate) {
            return res.status(404).json({
                error: true,
                message: 'Unable to find the candidate'
            })
        }

        // check whether candidate already applied for that given job or not
        const isAlreadyApplied = await checkIfCandidateAlreadyApplied({
            jobid: jobId,
            candidateid: candidate.id
        })
        if (isAlreadyApplied) {
            return res.status(200).json({
                error: true,
                message: 'Candidate already applied for that given job'
            })
        }

        const response = await jobApplicationService({
            jobid: jobId,
            candidateid: candidate.id
        })

        if (response) {
            return res.status(200).json({
                error: false,
                message: 'Candidate applied for job successfully!!'
            })
        }
    } catch (error) {
        next(error)
    }
}

const fetchJobApplicationController = async (req, res, next) => {
    try {
        let recruiterEmail = req.recruiter.email

        let sqlQuery = `select c.firstName, c.lastName, c.email, jp.title as jobtitle, jp.description as jobdescription from candidates c JOIN jobapplications ja ON c.id=ja.candidateid JOIN jobposts jp ON ja.jobid=jp.id JOIN recruiters r ON jp.createdby = r.email WHERE r.email = :recruiterEmail`

        const applicants = await sequelize.query(sqlQuery, {
            replacements: { recruiterEmail },
            type: sequelize.QueryTypes.SELECT
        })

        if (applicants) {
            return res.status(200).json({
                applicants
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    newJobPostCreationController,
    fetchRecruiterCreatedJobController,
    fetchAllJobForCandidateController,
    candidateApplyForJobController,
    fetchJobApplicationController
}