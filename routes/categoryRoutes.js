import express from "express";
import { isAdmin, requireSignIn } from '../middlewares/authmiddleware.js'
import { categoryControlller, createCategoryController, deleteCategoryCOntroller, singleCategoryController, updateCategoryController } from "../controllers/CategoryController.js";


const router=express.Router()


//routes
//Create category
router.post('/create-category',requireSignIn,isAdmin,createCategoryController);

//updatecategory
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController)

//get all category
router.get("/get-category",categoryControlller)

//get single category
router.get("/single-category/:slug",singleCategoryController)

//delete category
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryCOntroller)

export default router;