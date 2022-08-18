const Joi = require('joi');

const validationSchema = Joi.object({
  userName: Joi.string().min(3).max(40).required(),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{4,50}/),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "yahoo"] },
  }),
  isAdmin: Joi.boolean().default(false),
  isVerifiead: Joi.boolean().default(false),
  deletedAt: Joi.boolean().default(false),
});
module.exports = {
  validationSchema,
};
