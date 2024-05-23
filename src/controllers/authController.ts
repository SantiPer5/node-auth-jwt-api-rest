import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../services/pass.services";
import  prisma  from "../models/user";
import { generateToken } from "../services/auth.services";


export const register = async (req: Request, res: Response): Promise<void> => {

  const { email, password, name} = req.body;

  try{

    if(!password) {
      res.status(400).json({ error: 'El campo password no puede estar vacio' });
        return;
    };
    if(!email) {
      res.status(400).json({ error: 'El campo email no puede estar vacio' });
        return;
    };
    if(!name) {
      res.status(400).json({ error: 'El campo nombre no puede estar vacio' });
        return;
    };


    const hashedPassword = await hashPassword(password);
    console.log(hashedPassword);

    const user = await prisma.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    })

    const token = generateToken(user);
    res.status(201).json({ token });


    } catch (error: any) {


      //Error registro duplicado
      if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
        res.status(400).json({ error: 'El email ya esta en uso' });
        return;
      }

      console.log(error);
      res.status(500).json({ error: 'Hubo en error en el registro' });
      
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {

  const { email, password } = req.body;

  try {

    const user = await prisma.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Ususario y contrasenia no coinciden' });
      return;
    }

    const token = generateToken(user);
    res.status(200).json({ token });


  }catch (error: any) {
    console.log('Error: ', error);
  }

}

