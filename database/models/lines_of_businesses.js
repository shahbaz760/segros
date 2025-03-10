/* storing the lines_of_business */
module.exports = (sequelize, DataTypes) => {
    const  LinesOfBusiness = sequelize.define(
        "lines_of_businesses",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(64),
                allowNull: false
            },
            is_active: {
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: '0-Deactive, 1-Active'
            },
            is_display: {
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: '0-hidden, 1-display'
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null
            }
        },
        { timestamps: true }
    );
    return LinesOfBusiness;
};

