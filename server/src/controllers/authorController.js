import authorRepository from "../repository/authorRepository.js";

const AuthorController = {
  getAll: async (req, res) => {
    try {
      const authors = await authorRepository.getAll();
      res.json(authors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getOneByUserId: async (req, res) => {
    const userId = req.params.userId;
    try {
      const author = await authorRepository.getOneByUserId(userId);
      res.json(author);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getOneByAuthorId: async (req, res) => {
    const authorId = req.params.authorId;
    try {
      const author = await authorRepository.getOneByAuthorId(authorId);
      res.json(author);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getBlogListByUserId: async (req, res) => {
    const userId = req.params.userId;
    try {
      const blogsList = await authorRepository.getBlogListByUserId(userId);
      res.json(blogsList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  add: async (req, res) => {
    const authorData = req.body;
    console.log("Auhtor data:", authorData);
    try {
      const newAuthor = await authorRepository.add(authorData);
      res.json(newAuthor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    const authorId = req.params.authorId;
    const newData = req.body;
    try {
      const updatedAuthor = await authorRepository.update(authorId, newData);
      res.json(updatedAuthor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    const authorId = req.params.authorId;
    try {
      const deletedAuthor = await authorRepository.delete(authorId);
      res.json(deletedAuthor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default AuthorController;
