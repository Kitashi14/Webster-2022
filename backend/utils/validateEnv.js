/** @format */

const Joi = require("joi");

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(5000),
  DBNAME: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  UI_ROOT_URI: Joi.string().uri().required(),
  SERVER_ROOT_URI: Joi.string().uri().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_AUTH_REDIRECT_URI: Joi.string().required(),
  EMAIL_NODEMAILER: Joi.string().email().required(),
  PASSWORD_NODEMAILER: Joi.string().required(),
  EMAIL_COOKIE_NAME: Joi.string().required(),
  LOGIN_COOKIE_NAME: Joi.string().required(),
  LOG_LEVEL: Joi.string()
    .valid("error", "warn", "info", "debug")
    .default("info"),
}).unknown();

const validateEnv = () => {
  const { error, value } = envSchema.validate(process.env);

  if (error) {
    console.error("❌ Environment validation error:", error.message);
    process.exit(1);
  }

  return value;
};

module.exports = validateEnv;
