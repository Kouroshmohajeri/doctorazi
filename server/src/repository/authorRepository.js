import Author from '../models/Author.js';

const AuthorRepository = {
  getAll: async () => {
    return await Author.findAll();
  },

  getOneByUserId: async (userId) => {
    return await Author.findOne({ where: { userId: userId } });
  },

  getOneByAuthorId: async (authorId) => {
    return await Author.findByPk(authorId);
  },

  getBlogListByUserId: async (userId) => {
    return await Author.findOne({ where: { userId: userId } }).then(author => author.blogsList);
  },

  add: async (authorData) => {
    return await Author.create(authorData);
  },

  update: async (authorId, newData) => {
    const author = await Author.findByPk(authorId);
    if (!author) {
      throw new Error('Author not found');
    }
    await author.update(newData);
    return author;
  },

  delete: async (authorId) => {
    const author = await Author.findByPk(authorId);
    if (!author) {
      throw new Error('Author not found');
    }
    await author.destroy();
    return author;
  },
};

export default AuthorRepository;
