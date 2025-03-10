/* storing the proposals */
module.exports = (sequelize, DataTypes) => {
    const Proposals = sequelize.define(
        "proposals",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            uuid: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                comment: 'primary key from users tables'
            },
            quote_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                comment: 'primary key from quotes table'
            },
            proposal_no: {
                type: DataTypes.STRING(255),
                allowNull: true,
                defaultValue: null,
                comment: 'proposal no from the quote'
            },
            policy_id: {
                type: DataTypes.STRING(128),
                allowNull: true,
                defaultValue: null
            },
            // due_date: {
            //     type: DataTypes.DATE,
            //     allowNull: true,
            //     defaultValue: null
            // },
            payment_type: {
                type: DataTypes.STRING(128),
                allowNull: true,
                defaultValue: null,
                comment: " 1- credit card, 2 - banking slip"
            },
            policy_start_date: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: 'date at which policy start'
            },
            policy_end_date: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: 'date at which policy end'
            },
            status: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 1,
                comment: '1-EMITIDO, 2-INACTIVE, 3-EM EMISSÃO, 4-CANCELADO'
            },
            deleted_at: {
                type: DataTypes.DATE,
                defaultValue: null,
                comment: 'date at which proposal delete'
            },
            created_on: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null,
                comment: 'date at which proposal created'
            },
            is_renewed: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 0,
            },
            is_reviewed: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 0,
            },
            proposal_payment_status: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 5
            },
            policy_pdf: {
                type: DataTypes.TEXT,
                allowNull: true,
                defaultValue: null,
                comment: 'policy pdf'
            },
            company_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                comment: 'company id of the quote'
            },
            created_by_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: 'primary key from users table represents which user created the quote'
            },
            heritage_rank_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: 'astr id from heritage ranges'
            },
            economic_activity_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: 'astr id from economic activities'
            },
            occupation_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: 'astr id from occupations'
            },
            income_range_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: 'astr id from income ranges'
            },
            average_income_value: {
                type: DataTypes.STRING(150),
                allowNull: true,
                defaultValue: null
            },
            average_equity_value: {
                type: DataTypes.STRING(150),
                allowNull: true,
                defaultValue: null
            },
            agency_id: {
                type: DataTypes.STRING(50),
                allowNull: true,
                defaultValue: null
            }
        },
        { timestamps: true }
    )
    return Proposals;
}