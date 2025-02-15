import { Router } from "express";
import { getCollege, saveData,getCollegeById } from "../controllers/data.controller";

const router:Router=Router();

router.post('/create',saveData)
router.get('/get',getCollege)
router.get('/get/:id',getCollegeById)

    

export default router

