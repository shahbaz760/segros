/* storing the proposals */
module.exports = (sequelize, DataTypes) => {
    const income_ranges = sequelize.define(
        "income_range",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            astr_id: {
                type: DataTypes.STRING(20),
                allowNull: true,
                defaultValue: null
            },
            astr_description: {
                type: DataTypes.STRING(250),
                allowNull: true,
                defaultValue: null
            },
            is_active: {
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: '0-Deactive, 1-Active'
            },
        },
        { timestamps: true }
    )
    return income_ranges;
}