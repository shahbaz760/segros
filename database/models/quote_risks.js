/* storing the detail of the risks management selected for the quote */
module.exports = (sequelize, DataTypes) => {
  const quote_risks = sequelize.define(
    "quote_risks",
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
      have_manager: {
        type: DataTypes.STRING(250),
        allowNull: true,
        defaultValue: null,
        comment: 'value from "possui gerenciadora?"" from tab "gerenciamento de risco"'
      },
      company_name: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'selected company names from tab "gerenciamento de risco"'
      },
      technology_tracker: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'value from "rastreador" from tab "tecnologias utilizadas" 0: not selected, 1: selected'
      },
      technology_tracker_risk: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'selected tracker risk in "rastreador" from tab "tecnologias utilizadas"'
      },
      technology_tracker_text: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'added text in "rastreador" where text is to be added from tab "tecnologias utilizadas"'
      },
      technology_tracker_secondary: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'value from "rastreador secundario?"" from tab "gerenciamento de risco" 0: not selected, 1: selected'
      },
      technology_tracker_secondary_risk: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'selected tracker secondary risk in "rastreador secundario" from tab "tecnologias utilizadas"'
      },
      technology_tracker_secondary_text: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'added text in "tracker secondary risk" where text is to be added from tab "tecnologias utilizadas"'
      },
      technology_bait: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'value from "isca" from tab "tecnologias utilizadas" 0: not selected, 1: selected'
      },
      technology_bait_risk: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'selected bait risk in "isca" from tab "tecnologias utilizadas"'
      },
      technology_bait_text: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'added text in "isca" where text is to be added from tab "tecnologias utilizadas"'
      },
      technology_intelligent_immobilizer: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'value from "imobilizador inteligente" from tab "tecnologias utilizadas" 0: not selected, 1: selected'
      },
      technology_intelligent_immobilizer_risk: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'selected technology intelligent immobilizer in "imobilizador inteligente" from tab "tecnologias utilizadas"'
      },
      technology_intelligent_immobilizer_text: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'added text in "imobilizador inteligente" where text is to be added from tab "tecnologias utilizadas"'
      },
      technology_other: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'value from "outros" from tab "tecnologias utilizadas" 0: not selected, 1: selected'
      },
      technology_other_text: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'value from "outros" from tab "tecnologias utilizadas"'
      },
    },
    {
      timestamps: true,
    }
  );
  return quote_risks;
};
