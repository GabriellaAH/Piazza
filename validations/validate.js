const Joi = require('joi');

const loginValidation = (data) => {
    const schema = Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required()
    });
    return schema.validate(data);
};

const updateValidation = (data) => {
    const schema = Joi.object({
        userName: Joi.string().min(3).max(256).required(),
        email: Joi.string().min(6).max(256).email().required(),
        password: Joi.string().min(6).max(1024).required(),
        fullName: Joi.string().min(3).max(256).required()
    });
    return schema.validate(data);
};


module.exports.updateValidation = updateValidation
module.exports.loginValidation = loginValidation