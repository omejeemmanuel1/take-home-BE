import express from "express";
import { deleteAllUsers, register} from '../controller/register';
import { Login } from '../controller/login';

const router = express.Router();

router.post('/register', register);
router.post('/login', Login);
router.delete('/delete', deleteAllUsers);


export default router;

