import { Router } from "express";
import { SuggestionController } from "../controllers/suggestion.controller"
import {isAuthenticate} from "../middlewares/auth.middlewares"
import { ValidationMiddleware } from "../middlewares/validation.middlewares";
import { suggestionValidation } from "../middlewares/validators.middlewares";
import { isAdmin } from "../middlewares/isAdmin.middlewares";

const router = Router()



//GET Listar todas las ofertas localhost:3000/api/offers/?title=react&category=dam
router.get('/', isAuthenticate, isAdmin, SuggestionController.getAll)
//localhost:3000/api/offers/xxxx
router.get('/:id', isAuthenticate, SuggestionController.getById)
//POST añadir una oferta nueva localhost:3000/api/offers/  {body}
router.post('/', isAuthenticate, isAdmin, suggestionValidation, ValidationMiddleware, SuggestionController.create)
//DELETE Borrar una oferta localhost:3000/api/offers/XXXX
router.delete('/:id', isAuthenticate, isAdmin, SuggestionController.delete)
//PUT modificar una oferta localhost:3000/api/offers/XXXX  {body}
router.put('/:id',isAuthenticate, suggestionValidation, ValidationMiddleware, SuggestionController.update)   

// Calificamos una oferta x {body}
// Vemos que calificacion (total) se le ha dado a una oferta

export default router