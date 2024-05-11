const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
    swaggerDefinition: {
        restapi: '1.0.0',
        info: {
            title: 'Backend Starter API',
            version: '1.0.0',
            description: 'Backend Starter API Documentation',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
    },
    apis: ['**/*.js'],
}

const specs = swaggerJsdoc(options)

module.exports = (app) => {
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs))
}