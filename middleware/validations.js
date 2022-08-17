const Joi = require('joi');

const validationSchema = Joi.object({
  userName: Joi.string().alphanum().min(3).max(40).required(),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{4,50}/),
  confirm_password: Joi.ref("password"),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "yehoo"] },
  }),
  isAdmin: Joi.boolean().default(false),
  isVerifiead: Joi.boolean().default(false),
  deletedAt: Joi.boolean().default(false),
});
module.exports = {
  validationSchema,
};
