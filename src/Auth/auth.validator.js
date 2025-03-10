import Joi from 'joi';

module.exports = {
    userSignupValidator: Joi.object().keys({
        name: Joi.string().required().error(() => new Error('NAME_IS_REQUIRED')),
        email: Joi.string().trim().max(50).email({ tlds: { allow: false } }).required().error(() => new Error('EMAIL_IS_REQUIRED')),
        password: Joi.string().required().error(() => new Error('PASSWORD_IS_REQUIRED')),
        phone_number: Joi.string().required().error(() => new Error('PHONENUMBER_IS_REQUIRED')),
        role_id: Joi.number().required().error(() => new Error('ROLEID_IS_REQUIRED')),
    }),
    loginValidator: Joi.object().keys({
        email: Joi.string().trim().max(50).email({ tlds: { allow: false } }).required().error(() => new Error('EMAIL_IS_REQUIRED')),
        password: Joi.string().required().error(() => new Error('PASSWORD_IS_REQUIRED')),
    }),
};
