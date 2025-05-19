import { body } from "express-validator";

export const registerValidator = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 10 })
      .withMessage("Password must be at least 10 characters long"),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirm Password is required")
      .isString()
      .withMessage("Confirm Password must be a string")
      .isLength({ min: 10 })
      .withMessage("Confirm Password must be at least 10 characters long")
      .custom((value, { req }) => {
        if (value !== req.body.password) throw new Error("Passwords do not match");
        return true;
      }),
  ]
}

export const loginValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 10 })
      .withMessage("Password must be at least 10 characters long")
  ]
}

export const updatePasswordValidator = () => {
  return [
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 10 })
      .withMessage("Password must be at least 10 characters long"),
    body('confirmPassword')
      .notEmpty()
      .withMessage('Confirm Password is required')
      .isString()
      .withMessage('Confirm Password must be a string')
      .isLength({ min: 10 })
      .withMessage('Confirm Password must be at least 10 characters long')
      .custom((value, { req }) => {
        if (value !== req.body.password) throw new Error('Passwords do not match');
        return true;
      })
  ]
}

export const updateRoleUserValidator = () => {
  return [
    body('role')
      .notEmpty()
      .withMessage('Role is required')
      .isString()
      .withMessage('Role must be a string')
      .isIn(['verifikator', 'user'])
      .withMessage('Role must be one of the following: verifikator, user')
  ]
}

export const updateVerifiedUserValidator = () => {
  return [
    body('is_verified')
      .notEmpty()
      .withMessage('Is verified is required')
      .isBoolean()
      .withMessage('Is verified must be a boolean')
  ]
}