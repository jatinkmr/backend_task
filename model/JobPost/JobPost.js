module.exports = (sequelize, DataTypes) => {
    const JobPost = sequelize.define("jobpost", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdby: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    })

    // Define associations
    JobPost.associate = models => {
        JobPost.associate = models => {
            JobPost.belongsTo(models.recruiter, {
                foreignKey: 'createdby',
                targetKey: 'email'
            });
            JobPost.hasMany(models.jobapplication, {
                foreignKey: 'jobid'
            });
        };
    };

    return JobPost
}
