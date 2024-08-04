import express from 'express';
import blogPostController from '../controllers/blogPostController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/saveImage', upload.single('image'), blogPostController.uploadImage);
router.post('/addBlog', blogPostController.createBlogPost);
router.post('/checkDuplicate', blogPostController.checkUrlExists);
router.get('/getAll', blogPostController.getAll);
router.get('/getByPostId/:postId', blogPostController.getOneByPostId);
router.get('/author/:authorId', blogPostController.getOneByAuthorId);
router.get('/edited', blogPostController.getEdited);
router.get('/isRejected', blogPostController.getIsRejected);
router.get('/editedByAuthor/:authorId', blogPostController.getEditedByAuthorId);
router.get('/rejectedByAuthor/:authorId', blogPostController.getRejectedByAuthorId);
router.get('/translated', blogPostController.getTranslated);
router.get('/notTranslated', blogPostController.getNotTranslated);
router.get('/translatedByTranslatorId/:translatorId', blogPostController.getTranslatedByTranslatorId);
router.get('/notTranslatedByAuthor/:authorId', blogPostController.getNotTranslatedByAuthorId);
router.delete('/:postId', blogPostController.delete);
router.put('/:postId', blogPostController.update);
router.post('/deleteImage', blogPostController.deleteImage);
router.post('/deleteFolder', blogPostController.deleteFolder);
router.get('/lastFourPosts', blogPostController.getLastFourPosts);
router.get('/randomTwoPosts', blogPostController.getRandomTwoPosts);
router.get('/notRejected', blogPostController.getAllNotRejected);
router.put('/updateRejectStatus/:postId', blogPostController.updateRejectStatus);
router.put('/addTranslation/:postId', blogPostController.addTranslation);
// router.post('/', blogPostController.add);


export default router;
