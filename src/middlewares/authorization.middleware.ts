import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { responseForbidden, responseUnauthorized } from '../helpers/reponse.helper';

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: { sub: string, role: 'admin' | 'verifikator' | 'user' }, info?: { message: string }) => {
    if (err || !user) return responseUnauthorized(res, info?.message || 'Access token is invalid');

    if (user.role !== 'admin') return responseForbidden(res, 'You are not authorized to access this resource');
    
    req.user = user;
    next();
  })(req, res, next);
};

export const authorizeVerifikator = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: { sub: string, role: 'admin' | 'verifikator' | 'user' }, info?: { message: string }) => {
    if (err || !user) return responseUnauthorized(res, info?.message || 'Access token is invalid');

    if (user.role !== 'verifikator') return responseForbidden(res, 'You are not authorized to access this resource');
    
    req.user = user;
    next();
  })(req, res, next);
};

export const authorizeUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: { sub: string, role: 'admin' | 'verifikator' | 'user' }, info?: { message: string }) => {
    if (err || !user) return responseUnauthorized(res, info?.message || 'Access token is invalid');

    if (user.role !== 'user') return responseForbidden(res, 'You are not authorized to access this resource');
    
    req.user = user;
    next();
  })(req, res, next);
};

export const authorizeAll = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: { sub: string, role: 'admin' | 'verifikator' | 'user' }, info?: { message: string }) => {
    if (err || !user) return responseUnauthorized(res, info?.message || 'Access token is invalid');
    
    req.user = user;
    next();
  })(req, res, next);
};