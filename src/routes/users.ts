import express from "express";
import { register} from '../controller/register';
import { Login } from '../controller/login';

const router = express.Router();

router.post('/register', register);
router.post('/login', Login);


export default router;

