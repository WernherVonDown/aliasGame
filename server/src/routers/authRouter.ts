import { Router } from "express";
import authController from "../controllers/authController";
import { check } from 'express-validator';
//@ts-ignore
const router: Router = new Router();

router.post('/registration', [
    check("username", "username is empty").notEmpty(),
    check("password", "password must be longer then 4 and shorter then 10 characters").isLength({min: 4, max: 10}),
] ,authController.registration);
router.post('/login', authController.login);
router.post('/validate', authController.validate);

export default router;