/* storing the claim_causes */
module.exports = (sequelize, DataTypes) => {
    const claimCauses = sequelize.define(
        "claim_causes",
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
                comment: 'Name of the reason of the claim'
            },
            is_active: {
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: '1-ACTIVE, 0:INACTIVE'
            }
        },
        { timestamps: true }
    )
    return claimCauses;
}