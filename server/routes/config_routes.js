const indexR = require("./index")
const sitesR = require("./sites")
const usersR = require("./users")
const countriesR = require("./countries")


exports.routesInit = (app) => {
    app.use("/", indexR);
    app.use("/sites", sitesR);
    app.use("/users", usersR);
    app.use("/countries", countriesR);
    
}