/* storing the Countries */
module.exports = (sequelize, DataTypes) => {
    const Countries = sequelize.define(
        "countries",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            astr_id: {
                type: DataTypes.STRING(255),
                defaultValue: null,
                allowNull: true,
            },
            name: {
                type: DataTypes.STRING(255),
                defaultValue: null,
                allowNull: true,
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
    return Countries;
};

