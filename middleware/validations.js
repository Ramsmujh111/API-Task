const Joi = require("joi");
const Jio = require("joi");

const validationSchema = Jio.object({
  userName: Jio.string().alphanum().min(3).max(40).required(),
  password: Jio.string().pattern(new RegExp("^[a-zA-Z0-9]{4,50}")),
  confirm_password: Jio.ref("password"),
  email: Jio.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "yehoo"] },
  }),
  isAdmin: Jio.boolean().default(false),
  isVerifiead: Joi.boolean().default(false),
  deletedAt: Joi.boolean().default(false),
});
module.exports = {
  validationSchema,
};
