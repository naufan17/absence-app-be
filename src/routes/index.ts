import express, { Router } from 'express';
import { loginValidator, registerValidator, updateRoleUserValidator, updateVerifiedUserValidator } from '../validators/auth.validator';
import { createLeaveRequestValidator, updateDescriptionLeaveRequestValidator, updateLeaveRequestValidator } from '../validators/leaveRequest.validator';
import { authorizeAdmin, authorizeAll, authorizeUser, authorizeVerifikator } from '../middlewares/authorization.middleware';
import { authController } from '../controllers/auth.controller';
import { accountController } from '../controllers/account.controller';
import { userAdminController } from '../controllers/admins/user.admin.controller';
import { leaveRequestAdminController } from '../controllers/admins/leaveRequest.admin.controller';
import { userVerifikatorController } from '../controllers/verifikators/user.verifikator.controller';
import { leaveRequestVerifikatorController } from '../controllers/verifikators/leaveRequest.verifikator.controller';
import { leaveTypeController } from '../controllers/leaveType.controller';
import { leaveRequestUserController } from '../controllers/users/leaveRequest.user.controller';

const router: Router = express.Router();

// Auth
router.post('/auth/login', loginValidator(), authController().login);
router.post('/auth/register', registerValidator(), authController().register);  

// Account
router.get('/account/profile', authorizeAll, accountController().profileCurentUser);

// Leave Type
router.get('/leave-types', leaveTypeController().allLeaveTypes);

// Admin
router.get('/admin/users', authorizeAdmin, userAdminController().allUsers)
router.put('/admin/users/:id/role', authorizeAdmin, updateRoleUserValidator(), userAdminController().updateUserRole)
router.get('/admin/leave-requests', authorizeAdmin, leaveRequestAdminController().allLeaveRequests)

// Verifikator
router.get('/verifikator/users', authorizeVerifikator, userVerifikatorController().allUsers)
router.put('/verifikator/users/:id/verified', authorizeVerifikator, updateVerifiedUserValidator(), userVerifikatorController().updateUserVerified)
router.get('/verifikator/leave-requests', authorizeVerifikator, leaveRequestVerifikatorController().allLeaveRequests)
router.put('/verifikator/leave-requests/:id/accept', authorizeVerifikator, updateLeaveRequestValidator(), leaveRequestVerifikatorController().updateStatus)

// User
router.post('/user/leave-requests', authorizeUser, createLeaveRequestValidator(), leaveRequestUserController().createLeaveRequest)
router.get('/user/leave-requests', authorizeUser, leaveRequestUserController().allLeaveRequests)
router.put('/user/leave-requests/:id', authorizeUser, updateDescriptionLeaveRequestValidator(), leaveRequestUserController().updateLeaveRequest)
router.put('/user/leave-requests/:id/cancel', authorizeUser, leaveRequestUserController().cancelLeaveRequest)
router.delete('/user/leave-requests/:id', authorizeUser, leaveRequestUserController().deleteLeaveRequest)

export default router;