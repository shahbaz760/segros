/* storing the insurance_types */
module.exports = (sequelize, DataTypes) => {
    const  InsurancTypes = sequelize.define(
        "insurance_types",
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
            description: {
                type: DataTypes.STRING(255),
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
    return InsurancTypes;
};

