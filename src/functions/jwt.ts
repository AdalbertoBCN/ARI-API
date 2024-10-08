import jwt from 'jsonwebtoken';
import { env } from '../env';

export const generateToken = (id:number) => {
return jwt.sign({ id }, env.JWT_SECRET, { expiresIn: '1h' });
}

export const verifyToken = (token:string) => {
    return jwt.verify(token, env.JWT_SECRET);
}