// models/Snippet.js
const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
  filename: String,
  content: String,
  language: String,
});

module.exports = mongoose.model('Snippet', SnippetSchema);
