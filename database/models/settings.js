module.exports = (sequelize, DataTypes) => {
    const settings = sequelize.define(
        "settings",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: true,
                defaultValue: null,
                comment: "name of the field"
            },
            is_active: {
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: '0-Deactive, 1-Active'
            },
        },
        { timestamps: true }
    );
    return settings;
}