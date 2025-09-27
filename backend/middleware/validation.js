/** @format */

const Joi = require("joi");

// User validation schema
const userValidation = {
  register: Joi.object({
    firstName: Joi.string().min(1).max(50).trim().required(),
    lastName: Joi.string().max(50).trim().allow(""),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    phonenum: Joi.number().integer().min(1000000000).max(9999999999).required(),
    address: Joi.string().min(1).max(500).trim().required(),
    age: Joi.number().integer().min(13).max(120).required(),
    locationX: Joi.number().required(),
    locationY: Joi.number().required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().min(1).max(50).trim(),
    lastName: Joi.string().max(50).trim().allow(""),
    address: Joi.string().min(1).max(500).trim(),
    age: Joi.number().integer().min(13).max(120),
    phonenum: Joi.number().integer().min(1000000000).max(9999999999),
  }),
};

// Complain validation schema
const complainValidation = {
  create: Joi.object({
    title: Joi.string().min(1).max(100).trim().required(),
    description: Joi.string().max(1000).trim().allow(""),
    profession: Joi.string().min(1).max(25).trim().required(),
    address: Joi.string().min(1).max(500).trim().required(),
    phonenum: Joi.number().integer().min(1000000000).max(9999999999).required(),
    locationX: Joi.number().required(),
    locationY: Joi.number().required(),
  }),

  update: Joi.object({
    title: Joi.string().min(1).max(100).trim(),
    description: Joi.string().max(1000).trim().allow(""),
    profession: Joi.string().min(1).max(25).trim(),
    address: Joi.string().min(1).max(500).trim(),
    phonenum: Joi.number().integer().min(1000000000).max(9999999999),
  }),
};

// Worker validation schema
const workerValidation = {
  create: Joi.object({
    profession: Joi.string().min(1).max(25).trim().required(),
    workerAddress: Joi.string().min(1).max(500).trim().required(),
    locationX: Joi.number().required(),
    locationY: Joi.number().required(),
  }),
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: errors,
      });
    }

    next();
  };
};

module.exports = {
  validate,
  userValidation,
  complainValidation,
  workerValidation,
};
