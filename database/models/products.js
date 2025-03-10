/* storing the products */
module.exports = (sequelize, DataTypes) => {
    const Products = sequelize.define(
        "products",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(20),
                defaultValue: null
            },
            description: {
                type: DataTypes.STRING(255),
                defaultValue: null
            },
            line_of_business_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            insurance_segment_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            branch_code: {
                type: DataTypes.INTEGER,
                defaultValue: null,
                comment: 'codigoRamo'
            },
            product_code: {
                type: DataTypes.INTEGER,
                defaultValue: null,
                comment: 'codigoProduto'
            },
            product_number: {
                type: DataTypes.STRING(50),
                defaultValue: null,
                comment: 'used for generating the proposal_no of the quote'
            },
            ramo: {
                type: DataTypes.INTEGER,
                defaultValue: null,
                comment: 'ramo'
            },
            susep_code: {
                type: DataTypes.STRING(50),
                defaultValue: null,
                comment: 'susep'
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
    return Products;
};

