module.exports = (sequelize, DataTypes) => {
    const transactions = sequelize.define(
        "transactions",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                comment: "primary key from users table"
            },
            quote_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                comment: "primary key from quotes table"
            },
            proposal_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                comment: "primary key from proposals table"
            },
            astr_poliza: {
                type: DataTypes.STRING(50),
                allowNull: true,
                defaultValue: null,
                comment: "policy_no recieved from the insurance company from the proposal webhook"
            },
            company_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                comment: " primary key from companies table"
            },
            premium_calculation_type: {
                type: DataTypes.TINYINT,
                allowNull: true,
                defaultValue: 1,
                comment: "1- ajustavel, 2- averbavel for flow 2 only"
            },
            currency: {
                type: DataTypes.TINYINT,
                allowNull: true,
                defaultValue: 1,
                comment: " 1:R$-Real,2: Dólar Americano (US$)"
            },
            created_by_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "for the sub admin dashboard"
            },
            created_on: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null,
                comment: 'date at which the proposal is created'
            },
            doc_type: {
                type: DataTypes.TINYINT,
                allowNull: true,
                defaultValue: null,
                comment: '1 - POLICY, 2 - FACTURA'
            },
            payment_type: {
                type: DataTypes.TINYINT,
                allowNull: true,
                defaultValue: null,
                comment: '1 - CHARGE'
            },
            total_gross_written_premium: {
                type: DataTypes.DOUBLE(20, 4),
                allowNull: true,
                defaultValue: null,
                comment: 'total gwp of the quote'
            },
            broker_commission: {
                type: DataTypes.FLOAT(10, 4),
                allowNull: true,
                defaultValue: null,
                comment: 'commission from the quote table >> broker commission for the quote'
            },
            estimated_shipment: {
                type: DataTypes.DOUBLE(20, 4),
                allowNull: true,
                defaultValue: null,
                comment: 'estimated_for_next_12_months from transport_good table'
            },
            limit: {
                type: DataTypes.DOUBLE(20, 4),
                allowNull: true,
                defaultValue: null,
                comment: 'total_limit from transport good table '
            }
        },
        {
            timestamps: true,
        }
    )
    return transactions;
}