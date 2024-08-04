import express from 'express';
import authorController from '../controllers/authorController.js';

const router = express.Router();

router.get('/getAll', authorController.getAll);
router.get('/getByUserId/:userId', authorController.getOneByUserId);
router.get('/getByAuthorId/:authorId', authorController.getOneByAuthorId);
router.get('/getBlogListByUserId/:userId', authorController.getBlogListByUserId);
router.post('/', authorController.add);
router.put('/:authorId', authorController.update);
router.delete('/:authorId', authorController.delete);

export default router;
