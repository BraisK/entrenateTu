import { Router } from "express";
import { UserController } from "../controllers/user.controller"
import {isAuthenticate} from "../middlewares/auth.middlewares"
import {isAdmin} from "../middlewares/isAdmin.middlewares"

const router = Router()

router.get('/profile', isAuthenticate ,UserController.profile)
//router.get('/', isAuthenticate ,UserController.profile)
// localhost:3000/api/users/
router.get('/', isAuthenticate, isAdmin ,UserController.getAll)

// Crea el endpoint que liste todos los usuarios de la web
// A este endpoint solo puede acceder el usuario role:admin
// Crea routes, services, middleware

export default router