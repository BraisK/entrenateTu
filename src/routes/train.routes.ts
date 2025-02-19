import { Router } from "express";
import { TrainController } from "../controllers/train.controller"
import {isAuthenticate} from "../middlewares/auth.middlewares"
import { isAdmin } from "../middlewares/isAdmin.middlewares";
import { ValidationMiddleware } from "../middlewares/validation.middlewares";
import { trainValidation } from "../middlewares/validators.middlewares";

const router = Router()



//GET Listar todas las ofertas localhost:3000/api/offers/?title=react&category=dam
router.get('/', isAuthenticate, TrainController.getAll)
//localhost:3000/api/offers/xxxx
router.get('/:id', isAuthenticate, TrainController.getById)
//POST añadir una oferta nueva localhost:3000/api/offers/  {body}
router.post('/', isAuthenticate, isAdmin, trainValidation, ValidationMiddleware, TrainController.create)
//DELETE Borrar una oferta localhost:3000/api/offers/XXXX  
router.delete('/:id',isAuthenticate,isAdmin, TrainController.delete)
//PUT modificar una oferta localhost:3000/api/offers/XXXX  {body}
router.put('/:id',isAuthenticate,isAdmin, trainValidation, ValidationMiddleware, TrainController.update)   

// Calificamos una oferta x {body}
// Vemos que calificacion (total) se le ha dado a una oferta

export default router