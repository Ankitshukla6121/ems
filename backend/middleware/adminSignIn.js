import jwt from 'jsonwebtoken';

export const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
