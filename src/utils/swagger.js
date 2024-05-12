const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Backend Starter API",
      version: "1.0.0",
      description: "Backend Starter API Documentation",
      contact: {
        name: "P.Eng Abdirahman Baabale",
        url: "https://baabale.com",
        email: "baabale@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/**/route.js", "./src/**/**.js"],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use(
    "/swagger",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
  );
};
