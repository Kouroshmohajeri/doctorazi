import User from '../models/User.js'; 
import commentRepository from '../repository/commentRepository.js'; 

class CommentController {
    async createComment(req, res) {
        try {
            const { post_id, user_id, expressionId, comment_text } = req.body;
            
            // You can fetch user details using user_id from User model
            const user = await User.findByPk(user_id);

            // Check if user exists
            if (!user) {
            return res.status(404).json({ error: 'User not found' });
            }

            // Create comment
            const comment = await commentRepository.create({ post_id, user_id, expressionId, comment_text });
            
            // Return response
            res.status(201).json(comment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

  async updateComment(req, res) {
    try {
      const { id } = req.params;
      const commentData = req.body;
      const comment = await commentRepository.update(id, commentData);
      res.json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      await commentRepository.delete(id);
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  async getAllComments(req, res) {
    try {
      const comments = await commentRepository.findAll();
      res.json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  async getComment(req, res) {
    try {
      const { id } = req.params;
      const comment = await commentRepository.findById(id);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      res.json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  async getCommentsByPostAndExpression(req, res) {
    try {
      const { post_id, expressionId } = req.query;
      const comments = await commentRepository.findByPostAndExpression(post_id, expressionId);
      res.json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default CommentController;
