import app from './app'
import {ErrorMiddleware} from "../src/middlewares/error.middlewares"

const PORT = process.env.PORT || 3000
app.use(ErrorMiddleware)
app.listen(PORT, ()=>{
    console.log('Servidor encendido en el puerto '+PORT)
})