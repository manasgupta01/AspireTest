const swaggerJSDoc = require('swagger-jsdoc');

// Swagger configuration options
const options = {
  // Swagger definition
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'aspire',
      version: '1.0.0',
      description: 'API documentation for your project',
    },
  },
  // Paths to API docs
  apis: ['/server.js'], // Update the path to match your API routes
};

// Initialize Swagger JSDoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
