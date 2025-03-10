/* storing the cities */
module.exports = (sequelize, DataTypes) => {
    const Cities = sequelize.define(
        "cities",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(50),
                defaultValue: null,
                allowNull: true,
            },
            state_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                comment: 'primary key from states tables'
            },
            is_active: {
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: '0-Deactive, 1-Active'
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null
            }
        },
        { timestamps: true }
    );
    return Cities;
};
