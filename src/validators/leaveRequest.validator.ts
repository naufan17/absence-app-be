import { body } from "express-validator";

export const createLeaveRequestValidator = () => {
  return [
    body('user_id')
      .notEmpty()
      .withMessage('User ID is required')
      .isString()
      .withMessage('User ID must be a string')
      .isUUID()
      .withMessage('User ID must be a valid UUID'),
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isString()
      .withMessage('Title must be a string'),
    body('description')
      .notEmpty()
      .withMessage('Description is required')
      .isString()
      .withMessage('Description must be a string'),
    body('start_date')
      .notEmpty()
      .withMessage('Start date is required')
      .isDate()
      .withMessage('Start date must be a date'),
    body('end_date')
      .notEmpty()
      .withMessage('End date is required')
      .isDate()
      .withMessage('End date must be a date'),
    body('leave_type_id')
      .notEmpty()
      .withMessage('Leave type ID is required')
      .isString()
      .withMessage('Leave type ID must be a string')
      .isUUID()
      .withMessage('Leave type ID must be a valid UUID'),
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isString()
      .withMessage('Status must be a string')
      .isIn(['pending', 'canceled', 'revoked', 'approved', 'rejected'])
      .withMessage('Status must be one of the following: pending, cancel, revoked, approved, rejected'),
  ]
}

export const updateLeaveRequestValidator = () => {
  return [
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isString()
      .withMessage('Status must be a string')
      .isIn(['pending', 'canceled', 'revoked', 'approved', 'rejected'])
      .withMessage('Status must be one of the following: pending, cancel, revoked, approved, rejected'),
    body('comment')
      .notEmpty()
      .withMessage('Comment is required')
      .isString()
      .withMessage('Comment must be a string'),
  ]
}

export const updateDescriptionLeaveRequestValidator = () => {
  return [
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isString()
      .withMessage('Title must be a string'),
    body('description')
      .notEmpty()
      .withMessage('Description is required')
      .isString()
      .withMessage('Description must be a string'),
  ]
}