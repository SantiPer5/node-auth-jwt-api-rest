import { Request, Response } from "express";
import { hashPassword } from "../services/pass.services";
import prisma from "../models/user";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!password) {
      res.status(400).json({ error: "El campo password no puede estar vacio" });
      return;
    }
    if (!email) {
      res.status(400).json({ error: "El campo email no puede estar vacio" });
      return;
    }
    if (!name) {
      res.status(400).json({ error: "El campo nombre no puede estar vacio" });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    res.status(201).json(user);
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ error: "El email ya esta en uso" });
      return;
    }

    console.log(error);
    res.status(500).json({ error: "Hubo en error en el registro" });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Hubo un error en la peticion" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Hubo un error en la peticion" });
  }
};

export const updateUser = async ( req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);
  const { email, password, name } = req.body;

  try {
    let dataToUpdate: any = {...req.body};

    if (password) {
      dataToUpdate.password = await hashPassword(password);
    }

    if (email) {
      dataToUpdate.email = email;
    }

    const user = await prisma.update({
      where: {
        id: userId,
      },
      data: dataToUpdate,
    });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.status(200).json(user);
    
  } catch (error:any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ error: "El email ya esta en uso" });
      return;
    } else if (error?.code === "P2025") {
      res.status(404).json({ error: "El id no es valido" });
      return;
    } else  {
    console.log(error);
    res.status(500).json({ error: "Hubo un error en la peticion" });
    }
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);

  try {
    await prisma.delete({
      where: {
        id: userId,
      },
    });

    res.status(200).json({
      message: "Usuario eliminado",
    }).end();
  } catch (error: any) {
    if (error?.code === "P2025") {
      res.status(404).json({ error: "El id no es valido" });
      return;
    } else {
      console.log(error);
      res.status(500).json({ error: "Hubo un error en la peticion" });
    }
  }
};
