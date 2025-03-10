/* storing the claim_statuses */
module.exports = (sequelize, DataTypes) => {
    const claimStatues = sequelize.define(
        "claim_statuses",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(64),
                allowNull: false,
                comment: 'Name of the status of the claim'
            },
            is_active: {
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: '1-ACTIVE, 0:INACTIVE'
            }
        },
        { timestamps: true }
    )
    return claimStatues;
}