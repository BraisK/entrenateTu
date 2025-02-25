import { Router } from "express";
import { UserController } from "../controllers/user.controller"
import {isAuthenticate} from "../middlewares/auth.middlewares"
import {isAdmin} from "../middlewares/isAdmin.middlewares"

const router = Router()

    
router.get('/profile', isAuthenticate , UserController.profile)
//router.get('/', isAuthenticate , UserController.profile)
//GET localhot:3000/api/users/
router.get('/' , UserController.getAll)

export default router