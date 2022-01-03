import { Router } from "express";
import wordsController from "../controllers/wordsController";
import { check } from 'express-validator';
import authMiddleware from '../middlewares/authMiddleware' 

//@ts-ignore
const router: Router = new Router();


router.post('/add', authMiddleware, wordsController.add);
router.post('/get', authMiddleware, wordsController.get);

export default router;