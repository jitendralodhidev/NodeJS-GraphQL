// Importing Express module and other packages
const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());

// Importing data files
const { USERS } = require("./user");
const { TODOS } = require("./todo");

async function startServer() {

  const server = new ApolloServer({ // Creating an ApolloServer instance with type definitions and resolvers
    typeDefs: `
        type User {
            id: ID!
            name: String!
            username: String!
            email: String!
            phone: String!
            website: String!
        }

        type Todo {
            id: ID!
            title: String!
            completed: Boolean
            user: User
        }

        type Query {
            getTodos: [Todo]
            getAllUsers: [User]
            getUser(id: ID!): User
        }
    `,
    resolvers: {
      Todo: {
        // Resolver to get user for a todo item
        user: (todo) => USERS.find((e) => e.id === todo.id),
      },
      Query: {
        // Resolvers for query operations
        getTodos: () => TODOS,
        getAllUsers: () => USERS,
        getUser: async (parent, { id }) => USERS.find((e) => e.id === id),
      },
    },
  });

  await server.start(); // Starting Apollo Server
  app.use("/graphql", expressMiddleware(server)); // Using Apollo Server middleware for handling GraphQL requests

  app.listen(8000, () => console.log("Server Started at PORT 8000"));
}

startServer(); // Initiating the server start process