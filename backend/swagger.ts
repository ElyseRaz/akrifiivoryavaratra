const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentation de l’API Express",
    },
    servers: [
      {
        url: "http://localhost:5000",
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
    tags: [
      {
        name: "Membres",
        description: "Opérations liées aux membres"
      },
      {
        name: "Activités",
        description: "Opérations liées aux activités"
      },
      {
        name: "Dépenses",
        description: "Opérations liées aux dépenses"
      },
      {
        name: "Quêtes",
        description: "Opérations liées aux quêtes"
      },
      {
        name: "Lot de Billets",
        description: "Opérations liées aux lots de billets"
      },
      {
        name: "Billets",
        description: "Opérations liées aux billets"
      },
      {
        name: "Sans Billets",
        description: "Opérations liées aux dons sans billets"
      },
      {
        name: "Utilisateurs",
        description: "Opérations liées aux utilisateurs"
      }
    ]
  },
  apis: ["./routes/*.ts"], 
};

module.exports = swaggerJsdoc(options);
