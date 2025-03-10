/* storing the detail of the specific coverages selected while adding the quote */
module.exports = (sequelize, DataTypes) => {
  const quote_calculations = sequelize.define(
    "quote_calculations",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      quote_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'primary key from quotes table'
      },
      standard_net_written_premium: {
        type: DataTypes.DOUBLE(20, 6),
        allowNull: true,
        defaultValue: null,
        comment: 'standard net gross premium / net insurance cost of the quote'
      },
      standard_gross_written_premium: {
        type: DataTypes.DOUBLE(20, 6),
        allowNull: true,
        defaultValue: null,
        comment: 'standard gross written premium / nic with commission of the quote'
      },
      standard_total_premium: {
        type: DataTypes.DOUBLE(20, 6),
        allowNull: true,
        defaultValue: null,
        comment: 'standard total gross written premium/nic with commission of the quote'
      },
      standard_commission_percentage: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: true,
        defaultValue: null,
        comment: 'standard commission percentage of quote'
      },
      standard_commission_value: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: true,
        defaultValue: null,
        comment: 'standard commission value of quote'
      },
      standard_deductible_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'standard deductible id of quote'
      },
      standard_is_discount_load: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
        comment: 'standard value from tab "agravar desconto" 1: aggravate, 2: discount'
      },
      standard_discount_aggravate_percentage: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: true,
        defaultValue: null,
        comment: 'standard discount_aggravate_percentage of quote'
      },
      standard_tax_value: {
        type: DataTypes.FLOAT(20, 6),
        allowNull: true,
        defaultValue: null,
        comment: 'standard tax value / iof of quote(7.38%)'
      },
      standard_total_insurance_cost: {
        type: DataTypes.DOUBLE(20, 6),
        allowNull: true,
        defaultValue: null,
        comment: 'standard total_insurance_cost of the quote'
      },
      standard_discount_aggravate_amount: {
        type: DataTypes.DOUBLE(20, 6),
        allowNull: true,
        defaultValue: null,
        comment: 'standard aggravate amount of the quote'
      },
      standard_insurance_rate: {
        type: DataTypes.DOUBLE(20, 6),
        allowNull: true,
        defaultValue: null,
        comment: 'standard insurance_rate of the quote'
      },
      standard_tax_scvs: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: null,
        comment: 'tax_scvs only for flow 1'
      },
      standard_tax_ssc: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: null,
        comment: 'tax_ssc only for flow 1'
      },
      standard_tax_emission: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: null,
        comment: 'tax_emission only for flow 1'
      },
      standard_tax_iva: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: null,
        comment: 'tax_iva only for flow 1'
      },
      standard_sub_total: {
        type: DataTypes.DOUBLE(20, 6),
        allowNull: true,
        defaultValue: null
      },
      personalized_net_written_premium: {
        type: DataTypes.DOUBLE(20, 6),
        allowNull: true,
        defaultValue: null,
        comment: 'personalized net gross premium / net insurance cost of the quote'
      },
      personalized_gross_written_premium: {
        type: DataTypes.DOUBLE(20, 6),
        allowNull: true,
        defaultValue: null,
        comment: 'personalized gross written premium / nic with commission of the quote'
      },
      personalized_total_premium: {
        type: DataTypes.DOUBLE(20, 6),
        allowNull: true,
        defaultValue: null,
        comment: 'personalized total gross written premium / nic with commission of the quote'
      },
      personalized_commission_percentage: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: true,
        defaultValue: null,
        comment: 'personalized commission percentage of quote'
      },
      personalized_commission_value: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: true,
        defaultValue: null,
        comment: 'personalized commission value of quote'
      },
      personalized_deductible_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'personalized deductible id of quote'
      },
      personalized_is_discount_load: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
        comment: 'personalized value from tab "agravar desconto" 1: aggravate, 2: discount'
      },
      personalized_discount_aggravate_percentage: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: true,
        defaultValue: null,
        comment: 'personalized discount aggravate percentage of quote'
      },
      personalized_tax_value: {
        type: DataTypes.FLOAT(20, 6),
        allowNull: true,
        defaultValue: null,
        comment: 'personalized iof of quote'
      },
      personalized_total_insurance_cost: {
        type: DataTypes.DOUBLE(20, 6),
        allowNull: true,
        defaultValue: null,
        comment: 'personalized total_insurance_cost of the quote'
      },
      personalized_discount_aggravate_amount: {
        type: DataTypes.DOUBLE(20, 6),
        allowNull: true,
        defaultValue: null,
        comment: 'personalized aggravate amount of the quote'
      },
      personalized_insurance_rate: {
        type: DataTypes.DOUBLE(20, 6),
        allowNull: true,
        defaultValue: null,
        comment: 'personalized insurance_rate of the quote'
      },
      personalized_tax_scvs: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: null,
        comment: 'tax_scvs only for flow 1'
      },
      personalized_tax_ssc: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: null,
        comment: 'tax_ssc only for flow 1'
      },
      personalized_tax_emission: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: null,
        comment: 'tax_emission only for flow 1'
      },
      personalized_tax_iva: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: null,
        comment: 'tax_iva only for flow 1'
      },
      personalized_sub_total: {
        type: DataTypes.DOUBLE(20, 6),
        allowNull: true,
        defaultValue: null
      }
    },
    {
      timestamps: true,
    }
  );
  return quote_calculations;
};
