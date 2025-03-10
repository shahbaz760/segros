/* storing the transport_goods of the quote */
module.exports = (sequelize, DataTypes) => {
  const transport_goods = sequelize.define(
    "transport_goods",
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
      total_limit: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: 0.0,
        comment: 'for flow 1 Valor total of each goods in step 3 and for flow 2 value from "limite de apólice desejado" field from step 3',
      },
      type_of_good_new: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
        comment: 'for flow 2 only >> 0: no, 1: yes'
      },
      type_of_good_used: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'for flow 2 only >> 0: no, 1: yes'
      },
      in_bulk: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'for flow 2 only (a granel) in step 3 >> 0: not applicable, 1: applicable'
      },
      chilled: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'for flow 2 only (refrigerada) in step 3 >> 0: not applicable, 1: applicable'
      },
      frozen: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'for flow 2 only (congelada) in step 3 >> 0: not applicable, 1: applicable'
      },
      currency: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
        comment: ' 1: real (r$), 2: dólar americano (us$)'
      },
      estimated_for_next_12_months: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: null,
        comment: 'only for flow 2 and value from "estimativa de is para os próximos 12 meses" from step 3'
      },
      goods_rate: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: null,
        comment: 'only for flow 2 >> used for calculate the nic.'
      },
      // land_route_limit: {
      //   type: DataTypes.DOUBLE(20, 4),
      //   allowNull: true,
      //   defaultValue: null,
      //   comment: 'only for flow 2 and value from "percurso terrestre" from step 3 >> 0: not selected, 1: selected'
      // },
    },
    {
      timestamps: true,
    }
  );
  return transport_goods;
};
