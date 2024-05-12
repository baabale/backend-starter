module.exports = (app, route = "/api/v1/users") => {
    app.use(route, require("./route"));
}