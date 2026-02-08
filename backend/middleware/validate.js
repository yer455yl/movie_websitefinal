const Joi = require("joi");

exports.validateRegister = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

exports.validateMovie = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).required(),
    description: Joi.string().allow(""),
    year: Joi.number().integer().min(1888).max(2100),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

exports.validateReview = (req, res, next) => {
  const schema = Joi.object({
    movie: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    title: Joi.string().min(2).max(100).required(),
    text: Joi.string().min(5).max(2000).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};
