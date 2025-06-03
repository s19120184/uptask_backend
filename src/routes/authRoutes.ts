import {Router} from 'express'
import {body, param} from 'express-validator'
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middleware/validaton';
import { authenticate, UserExists, UserLoginExist } from '../middleware/user';

const router = Router();


router.post('/create-account', 
    body('name').notEmpty().withMessage('El nombre no puede ir vacio'),
    body('password').notEmpty().isLength({min:8}).withMessage('El passwoed es muy corto, minimo 8 caracteres'),
    body('password_confirmation').custom((value , {req})=>{
         if(value !== req.body.password){
            throw new Error('Los password no son iguales')
         }   
         return true
    }),
    body('email').isEmail().withMessage('E-mail no valido'),
    UserExists,
    handleInputErrors,
    AuthController.createAccount
    
)

router.post('/confirm-account', 
    body('token').notEmpty().withMessage('El token no puede ir vacio'),
    handleInputErrors,
    AuthController.confirmAccount

)

router.post('/login',
    body('email').isEmail().withMessage('E-mail no valido'),
    body('password').notEmpty().withMessage('El password no puede ir vacio'),
    UserLoginExist,
    handleInputErrors,
    AuthController.login
)

router.post('/request-code',
    body('email').isEmail().withMessage('E-mail no valido'),
    //UserLoginExist,
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email').isEmail().withMessage('E-mail no valido'),
    //UserLoginExist,
    handleInputErrors,
    AuthController.forgotPassword
)
router.post('/validate-token',
    body('token').notEmpty().withMessage('El token no puede ir vacio'),
    handleInputErrors,
    AuthController.validateToken
)
router.post('/update-password/:token',
    param('token').isNumeric().withMessage('Token no valido'),
    body('password').notEmpty().isLength({min:8}).withMessage('El passwoed es muy corto, minimo 8 caracteres'),
    body('password_confirmation').custom((value , {req})=>{
         if(value !== req.body.password){
            throw new Error('Los password no son iguales')
         }   
         return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken

)
router.get('/user',
    authenticate,
    AuthController.user
)


// Profile

router.put('/profile',
    authenticate,
    body('name').notEmpty().withMessage('El nombre no puede ir vacio'),
    body('email').isEmail().withMessage('E-mail no valido'),
    handleInputErrors,
    AuthController.updatedProfile

)

router.post('/update-password',
    authenticate,
    body('current_password').notEmpty().withMessage('El password no puede ir vacio'),
    body('password').notEmpty().isLength({min:8}).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation').custom((value , {req})=>{
         if(value !== req.body.password){
            throw new Error('Los password no son iguales')
         }   
         return true
    }),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)

router.post('/check-password',
    authenticate,
    body('password').notEmpty().withMessage('El password no pude ir vacio'),
    handleInputErrors,
    AuthController.checkPassword
)


export default router