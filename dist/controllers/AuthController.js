"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../utils/auth");
const Token_1 = __importDefault(require("../models/Token"));
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../emails/AuthEmail");
const jwt_1 = require("../utils/jwt");
class AuthController {
    static createAccount = async (req, res) => {
        try {
            const { password } = req.body;
            //create user
            const user = new User_1.default(req.body);
            //hash password
            user.password = await (0, auth_1.hashPassword)(password);
            //generar el token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });
            await Promise.allSettled([user.save(), token.save()]);
            res.json('Cuenta  creada , revisa tu email para confirmarla');
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un Error" });
        }
    };
    static confirmAccount = async (req, res) => {
        try {
            const { token } = req.body;
            console.log(token);
            const tokenExixt = await Token_1.default.findOne({ token });
            if (!tokenExixt) {
                const error = new Error("Token no valido");
                return res.status(404).json({ error: error.message });
            }
            const user = await User_1.default.findById(tokenExixt.user);
            user.confirmed = true;
            await Promise.allSettled([user.save(), tokenExixt.deleteOne()]);
            res.json("Cuenta confirmada correctamente");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un Error" });
        }
    };
    static login = async (req, res) => {
        try {
            const { password } = req.body;
            //revisar el password 
            const isPasswordCorrect = await (0, auth_1.checkPassword)(password, req.user.password);
            if (!isPasswordCorrect) {
                const error = new Error("Password incorrecto");
                return res.status(404).json({ error: error.message });
            }
            const token = (0, jwt_1.genrateJWT)({ id: req.user.id });
            res.json(token);
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un Error" });
        }
    };
    static requestConfirmationCode = async (req, res) => {
        try {
            const { email } = req.body;
            //create user
            const user = await User_1.default.findOne({ email: email });
            if (!user) {
                const error = new Error(`Este correo no esta registrado: ${email}`);
                return res.status(404).json({ error: error.message });
            }
            if (user.confirmed) {
                const error = new Error(`El Usuario ya esta confirmado`);
                return res.status(403).json({ error: error.message });
            }
            //generar el token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });
            await Promise.allSettled([user.save(), token.save()]);
            res.json('Se envio un nuevo token a tu correo');
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un Error" });
        }
    };
    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            //create user
            const user = await User_1.default.findOne({ email: email });
            if (!user) {
                const error = new Error(`Este correo no esta registrado: ${email}`);
                return res.status(404).json({ error: error.message });
            }
            //generar el token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            await token.save();
            AuthEmail_1.AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            });
            res.json('Revisa tu email para instrucciones');
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un Error" });
        }
    };
    static validateToken = async (req, res) => {
        try {
            const { token } = req.body;
            console.log(token);
            const tokenExixt = await Token_1.default.findOne({ token });
            if (!tokenExixt) {
                const error = new Error("Token no valido");
                return res.status(404).json({ error: error.message });
            }
            res.json("Token válido , Define tu nuevo password");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un Error" });
        }
    };
    static updatePasswordWithToken = async (req, res) => {
        try {
            const { token } = req.params;
            console.log(token);
            const tokenExixt = await Token_1.default.findOne({ token });
            if (!tokenExixt) {
                const error = new Error("Token no valido");
                return res.status(404).json({ error: error.message });
            }
            const user = await User_1.default.findOne(tokenExixt.user);
            user.password = await (0, auth_1.hashPassword)(req.body.password);
            await Promise.allSettled([user.save(), tokenExixt.deleteOne()]);
            res.json("El password se modifico correctamente");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un Error" });
        }
    };
    static user = async (req, res) => {
        return res.json(req.user);
    };
    static updatedProfile = async (req, res) => {
        const { name, email } = req.body;
        req.user.name = name;
        req.user.email = email;
        const userExist = await User_1.default.findOne({ email });
        if (userExist && userExist.id.toString() !== req.user.id.toString()) {
            const error = new Error('Este email ya esta registrado');
            return res.status(409).json({ error: error.message });
        }
        try {
            await req.user.save();
            res.json('Perfil actualizado Correctamente');
        }
        catch (error) {
            res.status(500).send("Hubo un error");
        }
    };
    static updateCurrentUserPassword = async (req, res) => {
        const { current_password, password } = req.body;
        const user = await User_1.default.findById(req.user.id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(current_password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('El password actual es incorrecto');
            return res.status(401).json({ error: error.message });
        }
        try {
            user.password = await (0, auth_1.hashPassword)(password);
            await user.save();
            res.json('El password se modifico correctamente');
        }
        catch (error) {
            res.status(500).send('Hubo un error');
        }
    };
    static checkPassword = async (req, res) => {
        try {
            const { password } = req.body;
            const user = await User_1.default.findById(req.user.id);
            const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
            if (!isPasswordCorrect) {
                const error = new Error('El password es incorrecto');
                return res.status(401).json({ error: error.message });
            }
        }
        catch (error) {
            res.status(500).send('Hubo un error');
        }
        res.json('Password Correcto');
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map