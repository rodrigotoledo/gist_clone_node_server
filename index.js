// index.js
require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const SECRET_KEY = process.env.SECRET_KEY;
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;


mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado ao MongoDB');
}).catch(err => {
  console.error('Erro ao conectar ao MongoDB:', err);
});

const getUserFromToken = (token) => {
  try {
    if (token) {
      return jwt.verify(token, SECRET_KEY);
    }
    return null;
  } catch (error) {
    return null;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  debug: true,
  formatError: (err) => {
    console.error(err);
    return {
      message: err.message,
      locations: err.locations,
      path: err.path,
      extensions: err.extensions,
    };
  },
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const user = getUserFromToken(token.replace('Bearer ', ''));
    return { user };
  }
});

server.listen(PORT).then(({ url }) => {
  console.log(`Servidor rodando em ${url}`);
});
