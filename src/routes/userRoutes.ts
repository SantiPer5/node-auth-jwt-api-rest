import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/usersConstroller';


const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret'; //Secret key para JWT

//MidelWare de JWT para ver si estamos autenticados

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  //Verificar el token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if(err) {
      console.error('Error en la autenticacion del token', err);
      return res.status(403).json({ error: 'No tienes accesos a este recurso' });
    }

    next();

  });
};

router.post('/', authenticateToken, createUser ); //
router.get('/', authenticateToken,  getAllUsers ); //GETALL
router.get('/:id', authenticateToken,  getUserById ); //GET ID
router.put('/:id', authenticateToken,  updateUser );
router.delete('/:id', authenticateToken,  deleteUser );



export default router;