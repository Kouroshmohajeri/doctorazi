import Comment from '../models/Comment.js';

class CommentRepository {
  async create(commentData) {
    try {
      return await Comment.create(commentData);
    } catch (error) {
      console.error(error);
      throw new Error('Error creating comment');
    }
  }

  async update(commentId, commentData) {
    try {
      const comment = await Comment.findByPk(commentId);
      if (!comment) {
        throw new Error('Comment not found');
      }
      return await comment.update(commentData);
    } catch (error) {
      console.error(error);
      throw new Error('Error updating comment');
    }
  }

  async delete(commentId) {
    try {
      const comment = await Comment.findByPk(commentId);
      if (!comment) {
        throw new Error('Comment not found');
      }
      await comment.destroy();
    } catch (error) {
      console.error(error);
      throw new Error('Error deleting comment');
    }
  }

  async findAll() {
    try {
      return await Comment.findAll();
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching all comments');
    }
  }

  async findById(commentId) {
    try {
      return await Comment.findByPk(commentId);
    } catch (error) {
      console.error(error);
      throw new Error('Error finding comment');
    }
  }

  async findByPostAndExpression(postId, expressionId) {
    
    try {
      return await Comment.findAll({
        where: {
          post_id: postId,
          expressionId: expressionId
        }
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching comments by post and expression');
    }
  }
}

export default new CommentRepository();