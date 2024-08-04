import BlogPosts from '../models/BlogPosts.js';
import sequelize from '../config/database.js';

const blogPostRepository = {
  getAll: async () => {
    return await BlogPosts.findAll({where: {isRejected: false }});
  },

  getOneByPostId: async (postId) => {
    return await BlogPosts.findByPk(postId);
  },

  getAllByAuthorId: async (authorId) => {
    return await BlogPosts.findAll({ where: { author_id: authorId } });
  },
  
  getByUrl: async (url) => {
    return await BlogPosts.findOne({ where: { url } });
  },

  getEdited: async () => {
    return await BlogPosts.findAll({ where: { isEdited: true } });
  },

  getIsRejected: async () => {
    return await BlogPosts.findAll({ where: { isRejected: true } });
  },

  getEditedByAuthorId: async (authorId) => {
    return await BlogPosts.findAll({ where: { author_id: authorId, isEdited: true } });
  },

  getRejectedByAuthorId: async (authorId) => {
    return await BlogPosts.findAll({ where: { author_id: authorId, isRejected: true } });
  },

  getTranslated: async () => {
    return await BlogPosts.findAll({ where: { isTranslated: true } });
  },

  getNotTranslated: async () => {
    return await BlogPosts.findAll({ where: { isTranslated: false } });
  },

  getTranslatedByTranslatorId: async (translatorId) => {
    return await BlogPosts.findAll({ where: { translatorId: translatorId, isTranslated: true } });
  },

  getNotTranslatedByAuthorId: async (authorId) => {
    return await BlogPosts.findAll({ where: { author_id: authorId, isTranslated: false } });
  },

  delete: async (postId) => {
    const post = await BlogPosts.findByPk(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    await post.destroy();
    return post;
  },

  update: async (postId, newData) => {
    const post = await BlogPosts.findByPk(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    await post.update(newData);
    return post;
  },

  add: async (postData) => {
    return await BlogPosts.create(postData);
  },
  getLastFourPosts: async () => {
    return await BlogPosts.findAll({
      where:{isRejected: false },
      limit: 4,
      order: [['createdAt', 'DESC']]
    });
  },
  addTranslation: async (postId, translatedTitle, translatedShortDescription, translatedContent, translatorId, isTranslated) => {
    const post = await BlogPosts.findByPk(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    await post.update({
      translatedTitle,
      translatedShortDescription,
      translatedContent,
      translatorId,
      isTranslated: isTranslated
    });
    return post;
  },
  getRandomTwoPosts: async () => {
    return await BlogPosts.findAll({
      where:{isRejected: false },
      order: sequelize.random(),
      limit: 2
    });
  },

  getAllNotRejected: async () => {
    return await BlogPosts.findAll({ where: { isRejected: false } });
  },

  updateRejectStatus: async (postId, isRejected, headId) => {
    const post = await BlogPosts.findByPk(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    await post.update({ isRejected, headId });
    return post;
  }
};

export default blogPostRepository;
