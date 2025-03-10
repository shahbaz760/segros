/* storing the Goods */
module.exports = (sequelize, DataTypes) => {
    const ImportExportCalculations = sequelize.define(
        "import_export_calculations",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            coverage_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: 'primary key from the basic coverage table'
            },
            transpotation_type: {
                type: DataTypes.TINYINT,
                defaultValue: null,
                comment: '1- Avión , 2- Buque , 3- Camión'
            },
            insurance_rate_especifica: {
                type: DataTypes.FLOAT(20, 2),
                defaultValue: null,
                comment: "insurance rate for flow 1"
            },
            insurance_rate_anual: {
                type: DataTypes.FLOAT(20, 2),
                defaultValue: null,
                comment: "insurance rate for flow 2"
            },
            type_of_risk: {
                type: DataTypes.STRING(50),
                allowNull: true,
                defaultValue: null
            },
            mindep: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
                //comment: 'primary key from the basic coverage table'
            },
            deductible: {
                type: DataTypes.STRING(255),
                allowNull: true,
                defaultValue: null
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
    return ImportExportCalculations;
};

