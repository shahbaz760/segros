import config from "config";
import { DataTypes, Sequelize } from "sequelize";
export default class DB {
  constructor() {
    this.seqClient = null;
    this.dbConfig = config.db;
    this.mysqlConfigClient = this.dbConfig.mysql.client;
    this.db = {};
    this.isDbRunning = true;
  }

  async connectMySQLClient() {
    try {
      this.seqClient = new Sequelize(
        this.mysqlConfigClient.database,
        this.mysqlConfigClient.username,
        this.mysqlConfigClient.password,
        {
          host: this.mysqlConfigClient.host,
          port: this.mysqlConfigClient.port,
          dialect: this.mysqlConfigClient.dialect,
          operatorsAliases: 0,
          logging: true,
          pool: {
            min: this.mysqlConfigClient.pool.min,
            max: this.mysqlConfigClient.pool.max,
            idle: this.mysqlConfigClient.pool.idle,
          },
          define: {
            underscored: false,
          },
          logging: false,
        }
      );
      await this.seqClient
        .authenticate()
        .then(() => {
          console.log(
            "Connection to Client DB has been established successfully."
          );
        })
        .catch((err) => {
          console.error("Unable to connect to the Client database:", err);
        });
    } catch (err) {
      throw err;
    }
  }
  async init() {
    await this.connectMySQLClient();
    await this.setupModels();
  }

  async checkConnection() {
    try {
      return this.isDbRunning;
    } catch (error) {
      return !this.isDbRunning;
    }
  }

  async setupModels() {
    this.db.sqlClient = this.seqClient;
    this.db.sequelize = this.seqClient;
    this.db.models = {};
    this.db.models.Roles = require("../../database/models/roles.js")(this.seqClient, DataTypes);
    this.db.models.Users = require("../../database/models/users.js")(this.seqClient, DataTypes);
    this.db.models.UserDetails = require("../../database/models/user_details.js")(this.seqClient, DataTypes);
    this.db.models.Companies = require("../../database/models/companies.js")(this.seqClient, DataTypes);
    this.db.models.CompanyAddresses = require("../../database/models/company_addresses.js")(this.seqClient, DataTypes);
    this.db.models.CompanyBanks = require("../../database/models/company_banks.js")(this.seqClient, DataTypes);
    this.db.models.CompanySettings = require("../../database/models/company_settings.js")(this.seqClient, DataTypes);
    this.db.models.Products = require("../../database/models/products.js")(this.seqClient, DataTypes);
    this.db.models.AdditionalCoverages = require("../../database/models/additional_coverages.js")(this.seqClient, DataTypes);
    this.db.models.Banks = require("../../database/models/banks.js")(this.seqClient, DataTypes);
    this.db.models.BasicCoverages = require("../../database/models/basic_coverages.js")(this.seqClient, DataTypes);
    this.db.models.AuthorityLevels = require("../../database/models/authority_levels.js")(this.seqClient, DataTypes);
    this.db.models.Cities = require("../../database/models/cities.js")(this.seqClient, DataTypes);
    this.db.models.ClaimCausaCodes = require("../../database/models/claim_causa_codes.js")(this.seqClient, DataTypes);
    this.db.models.Countries = require("../../database/models/countries.js")(this.seqClient, DataTypes);
    this.db.models.Goods = require("../../database/models/goods.js")(this.seqClient, DataTypes);
    this.db.models.ImportExportCalculations = require("../../database/models/import_export_calculations.js")(this.seqClient, DataTypes);
    this.db.models.LinesOfBusinesses = require("../../database/models/lines_of_businesses.js")(this.seqClient, DataTypes);
    this.db.models.InsuranceSegments = require("../../database/models/insurance_segments.js")(this.seqClient, DataTypes);
    this.db.models.InsuranceTypes = require("../../database/models/insurance_types.js")(this.seqClient, DataTypes);
    this.db.models.UserAccesses = require("../../database/models/user_accesses.js")(this.seqClient, DataTypes);
    this.db.models.Quotes = require("../../database/models/quotes.js")(this.seqClient, DataTypes);
    this.db.models.QuoteShipments = require("../../database/models/quote_shipments.js")(this.seqClient, DataTypes);
    this.db.models.QuoteAdditionalCustomers = require("../../database/models/quote_additional_customers.js")(this.seqClient, DataTypes);
    this.db.models.SingleShipmentDetails = require("../../database/models/single_shipment_details.js")(this.seqClient, DataTypes);
    this.db.models.ShipmentRouteDetails = require("../../database/models/shipment_route_details.js")(this.seqClient, DataTypes);
    this.db.models.TransportGoods = require("../../database/models/transport_goods.js")(this.seqClient, DataTypes);
    this.db.models.TransportGoodsDetails = require("../../database/models/transport_good_details.js")(this.seqClient, DataTypes);
    this.db.models.QuoteRisks = require("../../database/models/quote_risks.js")(this.seqClient, DataTypes);
    this.db.models.ClaimCauses = require("../../database/models/claim_causes.js")(this.seqClient, DataTypes);
    this.db.models.ClaimStatues = require("../../database/models/claim_statuses.js")(this.seqClient, DataTypes);
    this.db.models.QuoteClaims = require("../../database/models/quote_claims.js")(this.seqClient, DataTypes);
    this.db.models.QuoteClaimDetails = require("../../database/models/quote_claim_details.js")(this.seqClient, DataTypes);
    this.db.models.QuoteCalculations = require("../../database/models/quote_calculations.js")(this.seqClient, DataTypes);
    this.db.models.QuoteBasicCoverages = require("../../database/models/quote_basic_coverages.js")(this.seqClient, DataTypes);
    this.db.models.QuoteAdditionalCoverages = require("../../database/models/quote_additional_coverages.js")(this.seqClient, DataTypes);
    this.db.models.CurrencyExchangeRates = require("../../database/models/currency_exchange_rates.js")(this.seqClient, DataTypes);
    this.db.models.ClaimCurrencies = require("../../database/models/claim_currencies.js")(this.seqClient, DataTypes)
    this.db.models.Proposals = require("../../database/models/proposals.js")(this.seqClient, DataTypes);
    this.db.models.ClaimPartners = require("../../database/models/claim_partners.js")(this.seqClient, DataTypes);
    this.db.models.Claims = require("../../database/models/claims.js")(this.seqClient, DataTypes);
    this.db.models.QuoteDocuments = require("../../database/models/quote_documents.js")(this.seqClient, DataTypes);
    this.db.models.ShipmentDocuments = require("../../database/models/shipment_documents.js")(this.seqClient, DataTypes);
    this.db.models.QuoteRiskDocuments = require("../../database/models/quote_risk_documents.js")(this.seqClient, DataTypes);
    this.db.models.QuoteRiskDocuments = require("../../database/models/quote_risk_documents.js")(this.seqClient, DataTypes);
    this.db.models.QuoteClaimDocuments = require("../../database/models/quote_claim_documents.js")(this.seqClient, DataTypes);
    this.db.models.Messages = require("../../database/models/messages.js")(this.seqClient, DataTypes);
    this.db.models.ApiLogs = require("../../database/models/api_logs.js")(this.seqClient, DataTypes);
    this.db.models.RenewProposals = require("../../database/models/renew_proposals.js")(this.seqClient, DataTypes);
    this.db.models.Transactions = require("../../database/models/transactions.js")(this.seqClient, DataTypes);
    this.db.models.CompanyRoles = require("../../database/models/company_roles.js")(this.seqClient, DataTypes);
    this.db.models.Settings = require("../../database/models/settings.js")(this.seqClient, DataTypes);
    this.db.models.Applications = require("../../database/models/applications.js")(this.seqClient, DataTypes);
    this.db.models.ApplicationDocuments = require("../../database/models/application_documents.js")(this.seqClient, DataTypes);
    this.db.models.Occupations = require("../../database/models/occupations.js")(this.seqClient, DataTypes);
    this.db.models.HeritageRanks = require("../../database/models/heritage_ranks.js")(this.seqClient, DataTypes);
    this.db.models.IncomeRanges = require("../../database/models/income_ranges.js")(this.seqClient, DataTypes);
    this.db.models.EconomicActivities = require("../../database/models/economic_activities.js")(this.seqClient, DataTypes);
    this.db.models.Agencies = require("../../database/models/agency.js")(this.seqClient, DataTypes);
    this.db.models.States = require("../../database/models/states.js")(this.seqClient, DataTypes);
    /* associations */
    this.db.models.Users.hasOne(this.db.models.UserDetails, { foreignKey: 'user_id', as: 'user_detail' });
    this.db.models.Users.hasOne(this.db.models.UserAccesses, { foreignKey: 'user_id', as: 'user_access' });
    this.db.models.Users.hasOne(this.db.models.Users, { foreignKey: 'created_by_id', as: 'creator' });
    this.db.models.Users.belongsTo(this.db.models.Users, { foreignKey: 'created_by_id', as: 'created_by_detail' });
    this.db.models.Claims.belongsTo(this.db.models.Proposals, { foreignKey: 'proposal_id', as: 'proposal_details' });
    this.db.models.Claims.belongsTo(this.db.models.Quotes, { foreignKey: 'quote_id', as: 'quotes_details' });
    this.db.models.Proposals.belongsTo(this.db.models.Quotes, { foreignKey: 'quote_id', as: 'proposals_quotes_details' });
    this.db.models.Quotes.belongsTo(this.db.models.Products, { foreignKey: 'product_id', as: 'product_details' });
    this.db.models.Proposals.belongsTo(this.db.models.Users, { foreignKey: 'user_id', as: 'user_details' });
    this.db.models.Quotes.belongsTo(this.db.models.Products, { foreignKey: 'product_id', as: 'product' });
    this.db.models.Products.belongsTo(this.db.models.LinesOfBusinesses, { foreignKey: 'line_of_business_id', as: 'line_of_business' });
    this.db.models.Products.belongsTo(this.db.models.InsuranceSegments, { foreignKey: 'insurance_segment_id', as: 'insurance_segment' });
    this.db.models.Quotes.belongsTo(this.db.models.Users, { foreignKey: 'user_id', as: 'user' });
    this.db.models.Quotes.belongsTo(this.db.models.InsuranceTypes, { foreignKey: 'insurance_type_id', as: 'insurance_type' });
    this.db.models.Companies.belongsTo(this.db.models.Users, { foreignKey: 'responsible_id', as: 'responsible_detail' });
    this.db.models.Users.belongsTo(this.db.models.Users, { foreignKey: 'responsible_id', as: 'responsible' });
    this.db.models.Quotes.hasMany(this.db.models.QuoteDocuments, { foreignKey: 'quote_id', as: 'quote_documents' });
    this.db.models.QuoteShipments.hasMany(this.db.models.ShipmentDocuments, { foreignKey: 'quote_shipment_id', as: 'shipment_documents' });
    this.db.models.Quotes.hasOne(this.db.models.TransportGoods, { foreignKey: 'quote_id', as: 'transport_good' });
    this.db.models.Quotes.hasOne(this.db.models.QuoteCalculations, { foreignKey: 'quote_id', as: 'quote_calculation' });
    this.db.models.Quotes.hasMany(this.db.models.QuoteBasicCoverages, { foreignKey: 'quote_id', as: 'quote_basic_coverages' });
    this.db.models.Quotes.hasMany(this.db.models.QuoteAdditionalCoverages, { foreignKey: 'quote_id', as: 'quote_additional_coverages' });
    this.db.models.Quotes.hasMany(this.db.models.QuoteAdditionalCustomers, { foreignKey: 'quote_id', as: 'quote_additional_customers' });
    this.db.models.QuoteBasicCoverages.belongsTo(this.db.models.BasicCoverages, { foreignKey: 'coverage_id', as: 'basic_coverage' });
    this.db.models.QuoteAdditionalCoverages.belongsTo(this.db.models.AdditionalCoverages, { foreignKey: 'coverage_id', as: 'additional_coverage' });
    this.db.models.Quotes.hasOne(this.db.models.QuoteShipments, { foreignKey: 'quote_id', as: 'quote_shipment' });
    this.db.models.TransportGoods.hasMany(this.db.models.TransportGoodsDetails, { foreignKey: 'transport_good_id', as: 'transport_good_details' });
    this.db.models.QuoteShipments.hasOne(this.db.models.SingleShipmentDetails, { foreignKey: 'quote_shipment_id', as: 'single_shipment_detail' });
    this.db.models.QuoteShipments.hasMany(this.db.models.ShipmentRouteDetails, { foreignKey: 'quote_shipment_id', as: 'shipment_route_details' });
    this.db.models.ShipmentRouteDetails.belongsTo(this.db.models.Countries, { foreignKey: 'source', as: 'source_detail' });
    this.db.models.ShipmentRouteDetails.belongsTo(this.db.models.Countries, { foreignKey: 'destiny', as: 'destiny_detail' });
    // this.db.models.QuoteCalculations.belongsTo(this.db.models.Deductibles, { foreignKey: 'standard_deductible_id', as: 'standard_deductible' });
    // this.db.models.QuoteCalculations.belongsTo(this.db.models.Deductibles, { foreignKey: 'personalized_deductible_id', as: 'personalized_deductible' });
    this.db.models.Users.belongsTo(this.db.models.Companies, { foreignKey: 'company_id', as: 'company' });
    this.db.models.Quotes.belongsTo(this.db.models.Companies, { foreignKey: 'company_id', as: 'quote_company' });
    this.db.models.Companies.hasOne(this.db.models.CompanyAddresses, { foreignKey: 'company_id', as: 'company_address' });
    this.db.models.Companies.hasOne(this.db.models.CompanyBanks, { foreignKey: 'company_id', as: 'company_bank' });
    this.db.models.Quotes.hasOne(this.db.models.QuoteClaims, { foreignKey: 'quote_id', as: 'quote_claim' });
    //this.db.models.UserDetails.belongsTo(this.db.models.AuthorityLevels, { foreignKey: 'authority_level_id', as: 'authority_level' });
    this.db.models.Users.belongsTo(this.db.models.AuthorityLevels, { foreignKey: 'authority_level_id', as: 'authority_level' });

    this.db.models.Quotes.hasOne(this.db.models.QuoteRisks, { foreignKey: 'quote_id', as: 'quote_risk' });
    this.db.models.QuoteRisks.hasMany(this.db.models.QuoteRiskDocuments, { foreignKey: 'quote_risk_id', as: 'quote_risk_documents' });
    this.db.models.QuoteClaims.hasMany(this.db.models.QuoteClaimDocuments, { foreignKey: 'quote_claim_id', as: 'quote_claim_documents' });
    this.db.models.QuoteClaims.hasMany(this.db.models.QuoteClaimDetails, { foreignKey: 'quote_claim_id', as: 'quote_claim_details' });
    this.db.models.Messages.belongsTo(this.db.models.Users, { foreignKey: 'sender_id', as: 'sender' });
    this.db.models.Quotes.hasOne(this.db.models.Proposals, { foreignKey: 'quote_id', as: 'proposal_detail' })
    this.db.models.Proposals.hasOne(this.db.models.TransportGoods, { foreignKey: 'quote_id', as: 'proposal_transport_good' });
    this.db.models.Proposals.hasOne(this.db.models.QuoteCalculations, { foreignKey: 'quote_id', as: 'proposal_quote' })
    this.db.models.Proposals.belongsTo(this.db.models.Quotes, { foreignKey: 'quote_id', as: 'quote' });
    this.db.models.Quotes.belongsTo(this.db.models.Users, { foreignKey: 'customer_id', as: 'customer' });
    this.db.models.Proposals.hasMany(this.db.models.Claims, { foreignKey: 'proposal_id', as: 'proposal_claims' });
    this.db.models.Companies.hasMany(this.db.models.CompanyRoles, { foreignKey: 'company_id', as: 'company_roles' });
    this.db.models.Companies.hasOne(this.db.models.CompanySettings, { foreignKey: 'company_id', as: 'company_setting' });
    this.db.models.Quotes.hasMany(this.db.models.Claims, { foreignKey: 'quote_id', as: 'claims' });
    this.db.models.Companies.belongsTo(this.db.models.AuthorityLevels, { foreignKey: 'authority_level_id', as: 'authority_levels' });
    this.db.models.Companies.hasMany(this.db.models.Users, { foreignKey: 'company_id', as: 'company_detail' });
    this.db.models.Applications.belongsTo(this.db.models.Proposals, { foreignKey: 'proposal_id', as: 'proposal' });
    this.db.models.Applications.belongsTo(this.db.models.Cities, { foreignKey: 'source', as: 'source_detail' });
    this.db.models.Applications.belongsTo(this.db.models.Cities, { foreignKey: 'destiny', as: 'destiny_detail' });
    this.db.models.Transactions.belongsTo(this.db.models.Quotes, { foreignKey: 'quote_id', as: 'quote_report' });
    this.db.models.Quotes.hasOne(this.db.models.QuoteBasicCoverages, { foreignKey: 'quote_id', as: 'basic_coverages' });

    this.db.models.CompanyAddresses.belongsTo(this.db.models.States, { foreignKey: 'state', as: 'ecuador_state' });
    this.db.models.CompanyAddresses.belongsTo(this.db.models.Cities, { foreignKey: 'city', as: 'ecuador_city' });
    /* end */
    this.db.sqlClient.sync({ alter: true });
  }

  async getDB() {
    return this.db;
  }
}
