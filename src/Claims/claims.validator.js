import Joi from 'joi';

module.exports = {
    claimPartnerValidator: Joi.object().keys({
        name: Joi.string().optional().allow('', null),
        email: Joi.string().trim().max(50).email({ tlds: { allow: false } }).required().error(() => new Error('EMAIL_IS_REQUIRED')),
        password: Joi.string().required().error(() => new Error('PASSWORD_IS_REQUIRED')),
    }),
};
