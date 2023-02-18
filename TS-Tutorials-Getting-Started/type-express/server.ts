
import express from 'express'
import router from './Router/router'
import appLogger from './middlewares/appLogger'

const app:express.Application = express();
const port = 9000
app.use(appLogger)
app.use('/',router)

app.listen(port,()=>{console.log(`Running at localhost:${port}`)})