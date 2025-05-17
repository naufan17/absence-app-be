import express, { Router } from 'express';
import { loginValidator, registerValidator, updatePasswordValidator, updateRoleUserValidator, updateVerifiedUserValidator } from '../validators/auth.validator';
import { createLeaveRequestValidator, updateDescriptionLeaveRequestValidator, updateLeaveRequestValidator } from '../validators/leaveRequest.validator';
import { authorizeAdmin, authorizeAll, authorizeUser, authorizeVerifikator } from '../middlewares/authorization.middleware';
import { authController } from '../controllers/auth.controller';
import { accountController } from '../controllers/account.sontroller';

const router: Router = express.Router();

router.post('/auth/login', loginValidator(), authController().login);
router.post('/auth/register', registerValidator(), authController().register);  
router.get('/account/profile', authorizeAll, accountController().profileCurentUser);

// Admin
router.get('/admin/users', authorizeAdmin)
router.post('/admin/users/register', authorizeAdmin, registerValidator())
router.put('/admin/users/:id/role', authorizeAdmin, updateRoleUserValidator())
router.put('/admin/users/:id/update-password', authorizeAdmin, updatePasswordValidator())
router.get('/admin/leave-requests', authorizeAdmin)

// Verifikator
router.get('/verifikator/users', authorizeVerifikator)
router.put('/verifikator/users/:id/verified', authorizeVerifikator, updateVerifiedUserValidator())
router.get('/verifikator/leave-requests', authorizeVerifikator)
router.put('/verifikator/leave-requests/:id/accept', authorizeVerifikator, updateLeaveRequestValidator())

// User
router.post('/user/leave-requests', authorizeUser, createLeaveRequestValidator())
router.get('/user/leave-requests', authorizeUser)
router.put('/user/leave-requests/:id', authorizeUser, updateDescriptionLeaveRequestValidator())
router.put('/user/leave-requests/:id/cancel', authorizeUser)
router.delete('/user/leave-requests/:id', authorizeUser)

export default router;