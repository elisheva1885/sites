const express = require('express');
const path = require('path');
const cors = require('cors')
const http = require('http');
const {routesInit}= require("./routes/config_routes")
require("./db/mongoConnect")
const app = express();
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname,"public")))
routesInit(app)
const server = http.createServer(app);

let port = process.env.PORT || "8000"
server.listen(port);