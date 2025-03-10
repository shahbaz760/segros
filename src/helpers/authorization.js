import { DEFAULT_ENUM, RESPONSE_CODES } from "../../config/constants.js";
import { checkUserAuthorization } from "./commonFunction.js";
import { verifyToken } from "./jwt";
export default class Authorization {
  async init(db) {
    this.Models = db.models;
  }
  async authorize(roles = []) {
    return [
      async (req, res, next) => {
        const CommonMessages = req.CommonMessages.commonMessages
        /* decode jwt token */
        const decoded = await verifyToken(req.headers.authorization);
        req.decoded = decoded;
        if (decoded === "jwt expired" || !req.headers.authorization) {
          return res.json({
            status: 0,
            code: RESPONSE_CODES.UNAUTHORIZED,
            message: CommonMessages.UNAUTHORIZED_USER,
            data: null,
          });
        }
        /* check user authorization */
        if (decoded == "invalid jwt") {
          return res.json({
            status: 0,
            code: RESPONSE_CODES.UNAUTHORIZED,
            message: CommonMessages.UNAUTHORIZED_USER,
            data: null,
          });
        }
        if (decoded != "invalid signature") {
          /* check user exist or not */
          // const user = await this.Models.Users.findOne({
          //   where: { email: decoded.email },
          //   raw: true,
          // });
          // if (!user) {
          //   return res.json({
          //     status: 0,
          //     code: RESPONSE_CODES.UNAUTHORIZED,
          //     message: CommonMessages.UNAUTHORIZED_USER,
          //     data: null,
          //   });
          // }
          /* check user authorization */
          if (roles.includes(decoded.role_id)) {
            /* check user exist or not */
            const user = await this.Models.Users.findOne({
              where: {
                email: decoded.email,
                role_id: decoded.role_id
              },
              include: [
                {
                  model: this.Models.UserDetails,
                  as: "user_detail"
                },
                {
                  model: this.Models.UserAccesses,
                  as: "user_access"
                },
                {
                  model: this.Models.Companies,
                  as: "company",
                  attributes: ["id", "company_name", "company_reg_no", "ruc", "responsible_id",/* "authority_level_id"*/],
                  include: [
                    {
                      model: this.Models.CompanyAddresses,
                      as: "company_address",
                    },
                    {
                      model: this.Models.CompanyBanks,
                      as: "company_bank",
                    },
                    {
                      model: this.Models.CompanySettings,
                      as: "company_setting"
                    },
                  ]
                },
                {
                  model: this.Models.Users,
                  as: "created_by_detail",
                  attributes: ["id", "name", "email","authority_level_id"],
                  include: [
                    {
                      model: this.Models.Companies,
                      as: "company",
                      attributes: ["id", "company_name", "ruc", "responsible_id"/*, "authority_level_id"*/],
                    },
                  ]
                },
              ],
            });
            if (!user) {
              return res.json({
                status: 0,
                code: RESPONSE_CODES.UNAUTHORIZED,
                message: CommonMessages.UNAUTHORIZED_USER,
                data: null,
              });
            };
            /* check user account authorization */
            try {
              checkUserAuthorization(req, user);
            } catch (error) {
              return res.json({ message: error.message, code: RESPONSE_CODES.UNAUTHORIZED, status: DEFAULT_ENUM.FALSE });
            };
            req.user = user;
            /* return user */
            return next();
          } else {
            return res.json({
              status: 0,
              code: RESPONSE_CODES.UNAUTHORIZED,
              message: CommonMessages.UNAUTHORIZED_USER,
              data: null,
            });
          }
        }
      },
    ];
  }
}
