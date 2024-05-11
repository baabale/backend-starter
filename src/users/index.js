export * from "./route";
export * from "./model";
export * from "./controller";

export const injectUserRoute = (app, route = "/api/v1/users") => {
    app.use(route, require("./route"));
}