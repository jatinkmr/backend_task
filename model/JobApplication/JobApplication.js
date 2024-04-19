module.exports = (sequelize, DataTypes) => {
    const JobApplication = sequelize.define("jobapplication", {
        jobid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        candidateid: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true
    })

    // Define associations
    JobApplication.associate = models => {
        JobApplication.belongsTo(models.jobpost, {
            foreignKey: 'jobid'
        });
        JobApplication.belongsTo(models.candidate, {
            foreignKey: 'candidateid'
        });
    };

    return JobApplication
}
