import express, { Router } from 'express';
import { loginValidator, registerValidator, updatePasswordValidator, updateRoleUserValidator, updateVerifiedUserValidator } from '../validators/auth.validator';
import { createLeaveRequestValidator, updateDescriptionLeaveRequestValidator, updateLeaveRequestValidator } from '../validators/leaveRequest.validator';

const router: Router = express.Router();

router.post('/auth/login', loginValidator());
router.post('/auth/register', registerValidator());
router.post('/auth/update-password', updatePasswordValidator());

// Admin
router.get('/users')
router.post('/users/register', registerValidator())
router.put('/users/:id/role', updateRoleUserValidator())
router.put('/users/:id/update-password', updatePasswordValidator())
router.get('leave-requests')

// Verifikator
router.get('/users')
router.put('/users/:id/verified', updateVerifiedUserValidator())
router.get('leave-requests')
router.put('leave-requests/:id/accept', updateLeaveRequestValidator())

// User
router.post('leave-requests', createLeaveRequestValidator())
router.get('leave-requests')
router.put('leave-requests/:id', updateDescriptionLeaveRequestValidator())
router.put('leave-requests/:id/cancel')
router.delete('leave-requests/:id')

export default router;