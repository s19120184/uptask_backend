"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.UserLoginExist = exports.UserExists = void 0;
const User_1 = __importDefault(require("../models/User"));
const token_1 = require("../utils/token");
const Token_1 = __importDefault(require("../models/Token"));
const AuthEmail_1 = require("../emails/AuthEmail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function UserExists(req, res, next) {
    try {
        const { email } = req.body;
        const task = await User_1.default.findOne({ email: email });
        if (task) {
            const error = new Error(`Este correo ya esta registrado: ${email}`);
            return res.status(409).json({ error: error.message });
        }
        // req.user = task//ahora podemos asignar los datos del task para utilizar esos datos en el request
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Hubo un error" });
    }
}
exports.UserExists = UserExists;
async function UserLoginExist(req, res, next) {
    try {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email: email });
        if (!user) {
            const error = new Error(`Este correo no esta registrado: ${email}`);
            return res.status(404).json({ error: error.message });
        }
        if (!user.confirmed) {
            const token = new Token_1.default();
            token.user = user.id;
            token.token = (0, token_1.generateToken)();
            //enviamos un nuvo token al usuario
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });
            const error = new Error(`Aun no has confirmado tu cuenta , hemos enviado un e-mail de confirmacion`);
            return res.status(401).json({ error: error.message });
        }
        req.user = user; //ahora podemos asignar los datos del task para utilizar esos datos en el request
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Hubo un error" });
    }
}
exports.UserLoginExist = UserLoginExist;
const authenticate = async (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        const error = new Error("No autorizado");
        return res.status(401).json({ error: error.message });
    }
    const [, token] = bearer.split(' ');
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'object' && decoded.id) {
            const user = await User_1.default.findById(decoded.id).select('_id name email');
            if (user) {
                req.user = user;
                next();
            }
            else {
                res.status(500).json({ error: "Token no valido" });
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: "Token no valido" });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=user.js.map