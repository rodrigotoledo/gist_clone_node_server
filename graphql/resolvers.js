// graphql/resolvers.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Gist = require('../models/Gist');

const SECRET_KEY = process.env.SECRET_KEY;

const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
};

const resolvers = {
  Query: {
    getGist: async (_, { id }) => await Gist.findById(id).populate('author'),
    getUserGists: async (_, { userId, limit = 10, sortOrder = 'desc' }) => {
      const finalLimit = Math.min(limit, 10);
      const sortOption = sortOrder === 'asc' ? 1 : -1;

      return await Gist.find({ author: userId })
        .limit(finalLimit)
        .sort({ createdAt: sortOption })
        .populate('author');
    },
    getGists: async (_, { limit = 10, sortOrder = 'desc' }) => {
      const finalLimit = Math.min(limit, 10);
      const sortOption = sortOrder === 'asc' ? 1 : -1;

      return await Gist.find()
        .limit(finalLimit)
        .sort({ createdAt: sortOption })
        .populate('author');
    },

    searchGistsByTag: async (_, { tag, limit = 10, sortOrder = 'desc' }) => {
      const finalLimit = Math.min(limit, 10);
      const sortOption = sortOrder === 'asc' ? 1 : -1;

      return await Gist.find({ tags: tag })
        .limit(finalLimit)
        .sort({ createdAt: sortOption })
        .populate('author');
    },
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await User.findById(user.id);
    }
  },
  
  Mutation: {
    starGist: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const gist = await Gist.findById(id);
      if (!gist) throw new Error("Gist not found");

      // Verifica se o usuário já deu "like"
      if (!gist.stars.includes(user.id)) {
        gist.stars.push(user.id);
        await gist.save();
      }
      return gist;
    },

    unstarGist: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const gist = await Gist.findById(id);
      if (!gist) throw new Error("Gist not found");

      // Remove o "like" do usuário, se existir
      gist.stars = gist.stars.filter((userId) => userId.toString() !== user.id.toString());
      await gist.save();

      return gist;
    },

    addComment: async (_, { gistId, content }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const gist = await Gist.findById(gistId);
      if (!gist) throw new Error("Gist not found");

      // Cria um novo comentário e salva
      const comment = new Comment({
        content,
        author: user.id,
        createdAt: new Date(),
      });
      await comment.save();

      // Adiciona o ID do comentário ao array de comments do Gist
      gist.comments.push(comment._id);
      await gist.save();

      return comment.populate('author');
    },

    deleteComment: async (_, { gistId, commentId }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const gist = await Gist.findById(gistId);
      if (!gist) throw new Error("Gist not found");

      const comment = await Comment.findById(commentId);
      if (!comment) throw new Error("Comment not found");

      // Verifica se o usuário é o autor do comentário ou do Gist
      if (comment.author.toString() !== user.id && gist.author.toString() !== user.id) {
        throw new Error("Not authorized to delete this comment");
      }

      // Remove o comentário do Gist e do banco de dados
      gist.comments = gist.comments.filter((id) => id.toString() !== commentId);
      await gist.save();
      await comment.remove();

      return "Comment deleted successfully";
    },
    forkGist: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const originalGist = await Gist.findById(id).populate('author');
      if (!originalGist) throw new Error("Gist not found");

      // Usuários não podem fazer fork dos próprios Gists
      if (originalGist.author.id === user.id) {
        throw new Error("Cannot fork your own Gist");
      }

      const forkedGist = new Gist({
        title: originalGist.title,
        snippets: originalGist.snippets,
        tags: originalGist.tags,
        author: user.id,
        forks: [], // Novo fork começa sem forks
      });

      await forkedGist.save();
      return forkedGist.populate('author');
    },
    createUser: async (_, { username, password }) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) throw new Error("Username is already taken");

      const user = new User({ username, password });
      await user.save();
      
      const token = generateToken(user);
      return { token, user };
    },
    
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user || !(await user.isValidPassword(password))) {
        throw new Error("Invalid username or password");
      }

      const token = generateToken(user);
      return { token, user };
    },

    createGist: async (_, { userId, title, snippets, tags }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const gist = new Gist({ title, snippets, tags, author: user.id });
      await gist.save();
      return gist.populate('author');
    },
    
    updateGist: async (_, { id, title, snippets, tags }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const gist = await Gist.findById(id);
      if (!gist) throw new Error("Gist not found");

      if (title) gist.title = title;
      if (snippets) gist.snippets = snippets;
      if (tags) gist.tags = tags;
      gist.updatedAt = Date.now();
      
      await gist.save();
      return gist.populate('author');
    },

    deleteGist: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const gist = await Gist.findById(id);
      if (!gist) throw new Error("Gist not found");

      await gist.remove();
      return `Gist with id ${id} deleted successfully`;
    }
  },

  User: {
    gists: async (user) => await Gist.find({ author: user.id })
  },

  Gist: {
    author: async (gist) => await User.findById(gist.author),
    stars: async (gist) => {
      return gist.stars.length;
    },

    comments: async (gist) => {
      return await Comment.find({ _id: { $in: gist.comments } }).populate('author');
    },
  }
};

module.exports = resolvers;
