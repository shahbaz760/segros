/* storing the quotes */
module.exports = (sequelize, DataTypes) => {
  const quotes = sequelize.define(
    "quotes",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      duplicate_quote_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      uuid: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'primary key from users table'
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'primary key from companies table'
      },
      insurance_segment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'primary key from insurance_segments table'
      },
      insurance_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'primary key from insurance_types table'
      },
      line_of_business_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'primary key from line_of_businesses table'
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'primary key from products table'
      },
      created_by_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'primary key from user table, id of the user who created the quote'
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 4,
        comment: '1-ACTIVE, 2-INACTIVE, 3-EMITIDO, 4-RASCUNHO, 5-MODERAÇÃO, 6-EM EMISSÃO,7-DECLINADA, 8-CANCELADO, 9-PENDENTE, 10-REVISÃO'
      },
      is_moderate: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '0- NOT MODERATE, 1- MODERATE'
      },
      display_moderation: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '0- quote never got moderated, 1- quote is/was in moderated state'
      },
      moderated_by_sub_admin_limit: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'quote moderation due to sub admin limit, 0- NOT MODERATED, 1- MODERATED'
      },
      quote_pdf: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      same_group_companies: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '0-NOT SELECTED, 1-SELECTED note: for now this functionality is hidden from the add customer detail screen'
      },
      trading_policy: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '0-NOT SELECTED, 1-SELECTED note: for now this functionality is hidden from the add customer detail screen'
      },
      deductible_text: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
        comment: 'text added while selecting the personalized deductible in last screen.'
      },
      deductible_amount: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
        comment: 'amount added while selecting the deductible other than personalized and Isento in last screen.'
      },
      is_calculation_personalized: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '0-STANDARD CALCULATION SELECTED, 1-PERSONALIZED CALCULATION SELECTED'
      },
      premium_calculation_type: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
        comment: '1-AJUSTAVEL, 2-AVERBAVEL'
      },
      minimum_prize: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'value from field "Premio Minimo"'
      },
      of_adjustment: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: true,
        defaultValue: null,
        comment: 'value from field "% de Ajustamento" in moderation popup'
      },
      of_claims: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: true,
        defaultValue: null,
        comment: 'value from field "% de Sinistralidade" in moderation popup'
      },
      status_reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
        comment: "field to store the reason for the status of the quote is changed"
      },
      stipulation_policy_checkbox: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: null,
      },
      change_quote_insured: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: null,
        comment: "flag to check if the quote is duplicated from the company or not"
      },
      activated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        comment: 'date at which quote activated'
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        comment: 'date at which quote deleted'
      },
      review_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      moderation_reasons: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        defaultValue: null
      },
    },
    {
      timestamps: true,
      hooks: {
        beforeBulkUpdate: async (quote) => {
          if (quote && quote.attributes && quote.attributes.email) {
            quote.attributes.email = quote.attributes.email.toLowerCase();
          }
        },
        afterFind: async (quote) => {
          if (quote && quote.moderation_reasons) {
            quote.moderation_reasons = JSON.parse(quote.moderation_reasons);
          }
        },

      }
    }
  );
  return quotes;
};
