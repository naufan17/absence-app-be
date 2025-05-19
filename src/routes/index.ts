import express, { Router } from 'express';
import { loginValidator, registerValidator, updateRoleUserValidator, updateVerifiedUserValidator } from '../validators/auth.validator';
import { createLeaveRequestValidator, updateDescriptionLeaveRequestValidator } from '../validators/leaveRequest.validator';
import { authorizeAdmin, authorizeAll, authorizeUser, authorizeVerifikator } from '../middlewares/authorization.middleware';
import { authController } from '../controllers/auth.controller';
import { accountController } from '../controllers/account.controller';
import { userAdminController } from '../controllers/admins/user.admin.controller';
import { leaveRequestAdminController } from '../controllers/admins/leaveRequest.admin.controller';
import { userVerifikatorController } from '../controllers/verifikators/user.verifikator.controller';
import { leaveRequestVerifikatorController } from '../controllers/verifikators/leaveRequest.verifikator.controller';

const router: Router = express.Router();

router.post('/auth/login', loginValidator(), authController().login);
router.post('/auth/register', registerValidator(), authController().register);  
router.get('/account/profile', authorizeAll, accountController().profileCurentUser);

// Admin
router.get('/admin/users', authorizeAdmin, userAdminController().allUsers)
router.put('/admin/users/:id/role', authorizeAdmin, updateRoleUserValidator(), userAdminController().updateUserRole)
router.get('/admin/leave-requests', authorizeAdmin, leaveRequestAdminController().allLeaveRequests)

// Verifikator
router.get('/verifikator/users', authorizeVerifikator, userVerifikatorController().allUsers)
router.put('/verifikator/users/:id/verified', authorizeVerifikator, updateVerifiedUserValidator(), userVerifikatorController().updateUserVerified)
router.get('/verifikator/leave-requests', authorizeVerifikator, leaveRequestVerifikatorController().allLeaveRequests)
// router.put('/verifikator/leave-requests/:id/accept', authorizeVerifikator, updateLeaveRequestValidator())

// User
router.post('/user/leave-requests', authorizeUser, createLeaveRequestValidator())
router.get('/user/leave-requests', authorizeUser)
router.put('/user/leave-requests/:id', authorizeUser, updateDescriptionLeaveRequestValidator())
router.put('/user/leave-requests/:id/cancel', authorizeUser)
router.delete('/user/leave-requests/:id', authorizeUser)

export default router;