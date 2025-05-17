import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import config from '../config/config';
import { AccessToken } from '../types/token';

export const generateJWTAccess = (payload: JwtPayload): AccessToken => {
  const secretToken: string = config.JWTSecretKey ;
  const expiredToken: number = Number(config.JWTExpiresIn);
  const options: SignOptions = { 
    expiresIn: expiredToken, 
    algorithm: 'HS256' 
  };
  const token: string = jwt.sign(payload, secretToken, options);

  return {
    access_token: token,
    expires_in: Date.now() + expiredToken,
    token_type: 'Bearer'
  };
};