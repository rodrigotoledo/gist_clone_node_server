// models/Gist.js
const mongoose = require('mongoose');
const SnippetSchema = require('./Snippet').schema;

const GistSchema = new mongoose.Schema({
  title: String,
  snippets: [SnippetSchema],
  tags: [String],
  stars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Lista de IDs dos usuários que deram "like"
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Lista de IDs dos comentários
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gist', GistSchema);
