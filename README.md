# Gist Control Project

## Description

The **Gist Control** project is a Node.js API for managing operations similar to GitHub Gists. This application provides authentication, account creation, and features for managing Gists, such as creating, editing, deleting, and listing a user’s Gists.

This project uses GraphQL with Apollo Server and MongoDB, providing a powerful and flexible API for CRUD (Create, Read, Update, Delete) operations on Gists.

## Project Setup

To install the dependencies and set up the project, follow these steps:

1. Clone the repository.
2. Run the following command to install dependencies:

```bash
npm install
```

3. Duplicate the file `.env.example` to `.env` in the project root with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/gistControl
JWT_SECRET=your_jwt_secret
PORT=4000
```

4. Start the server in development mode with nodemon:

```bash
npm run dev
```

Or start the server in production mode:

```bash
npm start
```

## Available Scripts

- npm start: Runs the server using Node.js.
- npm run dev: Starts the server in development mode using nodemon.
- npm test: Placeholder for tests.

## Dependencies

The following dependencies are used in this project:

- apollo-server: Provides GraphQL server capabilities.
- bcryptjs: Hashes passwords for secure storage.
- dotenv: Loads environment variables from a .env file.
- graphql: Core GraphQL library used by Apollo Server.
- jsonwebtoken: Manages JWT-based authentication.
- mongoose: Connects and manages MongoDB models.

## Development Dependencies

- nodemon: Restarts the server automatically on code changes in development.

## Project Purpose

The purpose of this project is to manage user accounts and Gist-like operations. Main features include:

- User Authentication: Register and login with hashed password protection.
- JWT Authorization: Secures routes with JSON Web Token authentication.
- Gist Operations: Create, update, delete, and list Gists
- Fork, Like and Comment Gists: Operations involving gists

## Author

- **Rodrigo Toledo**
  - [GitHub](https://github.com.br/rodrigotoledo)
  - [YouTube - Devin Lounge](https://www.youtube.com/@devinlounge)
  - Email: [rodrigo@rtoledo.inf.br](mailto:rodrigo@rtoledo.inf.br)