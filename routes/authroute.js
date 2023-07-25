import express from 'express'
import {forgotPasswordController, getAllOrdersController, getOrdersController, loginController, orderStatusController, registercontroller, testcontroller, updateProfileController, } from '../controllers/authcontroller.js'
import { isAdmin, requireSignIn } from '../middlewares/authmiddleware.js'
//router object
const router =express.Router()

//routing
//register ||METHOD Post
router.post('/register',registercontroller)

//LOGIN || POST
router.post('/login',loginController)

//Forgot Password || POST
router.post('/forgot-password',forgotPasswordController)

//test routes
router.get("/test",requireSignIn,isAdmin , testcontroller)

//protected user route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
  });

//protected admin route auth
router.get("/admin-auth", requireSignIn,isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
  });
  
//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);



export default router