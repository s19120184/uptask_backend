import type { Request, Response } from "express";
import User from "../models/User";

import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";

import { genrateJWT } from "../utils/jwt";
import { AuthEmailGoogle } from "../utils/email/authEmail";
import { EmailService } from "../utils/email/emailService";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      //create user
      const user = new User(req.body);

      //hash password
      user.password = await hashPassword(password);

      //generar el token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      const emailService = new EmailService();

      emailService.sendEmailWithToken(user.email, user.name, token.token);

      await Promise.allSettled([user.save(), token.save()]);

      res.json("Cuenta  creada , revisa tu email para confirmarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      console.log(token);
      const tokenExixt = await Token.findOne({ token });

      if (!tokenExixt) {
        const error = new Error("Token no valido");
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExixt.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExixt.deleteOne()]);
      res.json("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      //revisar el password
      const isPasswordCorrect = await checkPassword(
        password,
        req.user.password
      );

      if (!isPasswordCorrect) {
        const error = new Error("Password incorrecto");
        return res.status(404).json({ error: error.message });
      }

      const token = genrateJWT({ id: req.user.id });
      res.json(token);
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      //create user
      const user = await User.findOne({ email: email });
      if (!user) {
        const error = new Error(`Este correo no esta registrado: ${email}`);
        return res.status(404).json({ error: error.message });
      }

      if (user.confirmed) {
        const error = new Error(`El Usuario ya esta confirmado`);
        return res.status(403).json({ error: error.message });
      }

      //generar el token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      const emailService = new EmailService();

      emailService.sendEmailWithToken(user.email, user.name, token.token);

      await Promise.allSettled([user.save(), token.save()]);

      res.json("Se envio un nuevo token a tu correo");
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      //create user
      const user = await User.findOne({ email: email });
      if (!user) {
        const error = new Error(`Este correo no esta registrado: ${email}`);
        return res.status(404).json({ error: error.message });
      }

      //generar el token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      console.log(token.token)
      await token.save();

      const emailService = new EmailService();

      emailService.sendPasswordResetToken(user.email, user.name, token.token);

      res.json("Revisa tu email para instrucciones");
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      console.log(token);
      const tokenExixt = await Token.findOne({ token });

      if (!tokenExixt) {
        const error = new Error("Token no valido");
        return res.status(404).json({ error: error.message });
      }

      res.json("Token válido , Define tu nuevo password");
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };
  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      console.log(token);
      const tokenExixt = await Token.findOne({ token });

      if (!tokenExixt) {
        const error = new Error("Token no valido");
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findOne(tokenExixt.user);
      user.password = await hashPassword(req.body.password);

      await Promise.allSettled([user.save(), tokenExixt.deleteOne()]);

      res.json("El password se modifico correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };
  static user = async (req: Request, res: Response) => {
    return res.json(req.user);
  };

  static updatedProfile = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    req.user.name = name;
    req.user.email = email;

    const userExist = await User.findOne({ email });
    if (userExist && userExist.id.toString() !== req.user.id.toString()) {
      const error = new Error("Este email ya esta registrado");
      return res.status(409).json({ error: error.message });
    }

    try {
      await req.user.save();
      res.json("Perfil actualizado Correctamente");
    } catch (error) {
      res.status(500).send("Hubo un error");
    }
  };

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body;
    const user = await User.findById(req.user.id);
    const isPasswordCorrect = await checkPassword(
      current_password,
      user.password
    );

    if (!isPasswordCorrect) {
      const error = new Error("El password actual es incorrecto");
      return res.status(401).json({ error: error.message });
    }

    try {
      user.password = await hashPassword(password);
      await user.save();
      res.json("El password se modifico correctamente");
    } catch (error) {
      res.status(500).send("Hubo un error");
    }
  };

  static checkPassword = async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      const user = await User.findById(req.user.id);
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("El password es incorrecto");
        return res.status(401).json({ error: error.message });
      }
    } catch (error) {
      res.status(500).send("Hubo un error");
    }

    res.json("Password Correcto");
  };
}
