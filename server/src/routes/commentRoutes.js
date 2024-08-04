import express from 'express';
import CommentController from '../controllers/commentController.js';

const router = express.Router();
const commentController = new CommentController();

// Endpoint to create a new comment
router.post('/new', commentController.createComment);

// Endpoint to update an existing comment
router.put('/updateComment/:id', commentController.updateComment);

// Endpoint to delete an existing comment
router.delete('/deleteComment/:id', commentController.deleteComment);

// Endpoint to get a single comment by ID
router.get('/getComment/:id', commentController.getComment);

// Endpoint to get all comments
router.get('/getAllComments', commentController.getAllComments);

// Endpoint to get comments by post_id and expressionId
router.get('/getCommentsByPostAndExpression', commentController.getCommentsByPostAndExpression);

export default router;
