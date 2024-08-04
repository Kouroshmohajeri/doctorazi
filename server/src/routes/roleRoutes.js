import express from 'express';
import RoleController from '../controllers/roleController.js'; // Adjust the path as necessary

const router = express.Router();

router.post('/roles', RoleController.create);
router.get('/allRoles', RoleController.getAll);
router.get('/roles/:role_id', RoleController.getById);
router.put('/roles/:role_id', RoleController.update);
router.delete('/roles/:role_id', RoleController.delete);

export default router;
