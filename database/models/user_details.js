/* storing the user detail */
module.exports = (sequelize, DataTypes) => {
    const user_details = sequelize.define(
        "user_details",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            rejected_reason: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            rejected_reason_note: {
                type: DataTypes.STRING(255),
                allowNull: true,
                defaultValue: null
            },
            rg: {
                type: DataTypes.STRING(150),
                allowNull: true,
                defaultValue: null,
                comment: 'note: for now this functionality is hidden from the add user detail screen'
            },
            terms_condition: {
                type: DataTypes.TINYINT,
                allowNull: true,
                defaultValue: 0,
            },
        },
        { timestamps: true }
    );
    return user_details;
};
