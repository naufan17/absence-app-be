import { body } from "express-validator";

export const createLeaveRequestValidator = () => {
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
    body('startDate')
      .notEmpty()
      .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be in ISO 8601 format (e.g. 2025-05-22T00:00:00.000Z)'),
    body('endDate')
      .notEmpty()
      .withMessage('End date is required')
      .isISO8601()
      .withMessage('End date must be in ISO 8601 format (e.g. 2025-05-22T00:00:00.000Z)'),
    body('leaveTypeId')
      .notEmpty()
      .withMessage('Leave type ID is required')
      .isString()
      .withMessage('Leave type ID must be a string')
      .isUUID()
      .withMessage('Leave type ID must be a valid UUID'),
  ]
}

export const updateLeaveRequestValidator = () => {
  return [
    body('comment')
      .notEmpty()
      .withMessage('Comment is required')
      .isString()
      .withMessage('Comment must be a string'),
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isString()
      .withMessage('Status must be a string')
      .isIn(['revoked', 'approved', 'rejected'])
      .withMessage('Status must be one of the following: revoked, approved, rejected'),
  ]
}