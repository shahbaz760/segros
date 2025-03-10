/* storing the renew policy data */
module.exports = (sequelize, DataTypes) => {
    const renew_proposals = sequelize.define(
        "renew_proposals",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            proposal_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                Comment:'id from the proposal table'
            },
            new_proposal_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
            },
        },
        {
            timestamps: true,
        }
    )
    return renew_proposals;
}