import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
export interface AuthRequest extends Request { userId?: string }
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if(!auth) {
    res.status(401).json({message:'No auth'});
    return;
  }
  const parts = auth.split(' ');
  if(parts.length!==2) {
    res.status(401).json({message:'Invalid auth'});
    return;
  }
  const token = parts[1];
  try{
    const payload:any = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  }catch(e){
    res.status(401).json({message:'Invalid token'});
    return;
  }
}
