import { Router } from "express";
import { TrainController } from "../controllers/train.controller"
import {isAuthenticate} from "../middlewares/auth.middlewares"

const router = Router()


//GET Listar todas las ofertas localhost:3000/api/Train/?title=react&category=dam
router.get('/', isAuthenticate ,TrainController.getAll)
router.get('/:id',isAuthenticate, TrainController.getById)
//POST Añadir una oferta localhost:3000/api/Traints/ {body}
router.post('/', TrainController.save)
//DELETE Borrar una oferta localhost:3000/api/Traints/XXXX
router.delete('/:id', TrainController.delete)
//PUT modificar una oferta localhost:3000/api/Traints/XXXX {body}
router.put('/:id', TrainController.update)

// Calificamos una oferta x {body}
// Vemos que calificacion (total) se le ha dado a una oferta

export default router