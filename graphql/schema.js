const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    gists: [Gist!]!
  }

  type Gist {
    id: ID!
    title: String
    snippets: [Snippet!]!
    tags: [String]
    stars: Int
    forks: [Gist!]
    comments: [Comment!]
    createdAt: String
    updatedAt: String
    author: User!
  }

  type Snippet {
    filename: String!
    content: String!
    language: String
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getGist(id: ID!): Gist
    getGists(limit: Int, sortOrder: String): [Gist!]
    getUserGists(userId: ID!): [Gist!]
    searchGistsByTag(tag: String!): [Gist!]
    me: User
  }

  type Mutation {
    createUser(username: String!, password: String!): AuthPayload
    login(username: String!, password: String!): AuthPayload
    createGist(userId: ID!, title: String, snippets: [SnippetInput!]!, tags: [String]): Gist
    updateGist(id: ID!, title: String, snippets: [SnippetInput!], tags: [String]): Gist
    deleteGist(id: ID!): String
    starGist(id: ID!): Gist
    unstarGist(id: ID!): Gist
    forkGist(id: ID!): Gist
    addComment(gistId: ID!, content: String!): Comment
    deleteComment(gistId: ID!, commentId: ID!): String
  }

  input SnippetInput {
    filename: String!
    content: String!
    language: String
  }
`;

module.exports = typeDefs;