import express, { Response, Request } from 'express';
import { createProduct, fetchAllProducts } from '../controller/product';
import {auth} from '../middleware/firebaseAuth'; 

const router = express.Router();

router.post('/create-product', auth, createProduct); 
router.get('/all', auth, fetchAllProducts);

export default router;
