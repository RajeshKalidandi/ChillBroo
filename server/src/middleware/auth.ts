import { Request, Response, NextFunction } from 'express';
import { auth } from '../firebaseAdmin';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).json({ error: 'Invalid token' });
  }
};
