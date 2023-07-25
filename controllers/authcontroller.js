import { compare } from "bcrypt";
import { comparePassword, hashPassword } from "../helpers/authhepler.js";
import usermodel from "../models/usermodel.js";
import orderModel from "../models/orderModel.js";
import JWT from 'jsonwebtoken';


export const registercontroller=async(req,res)=>{
    try{
        const {name,email,password,phone,address,answer}=req.body
        //vaildation
        if(!name){
            return res.send({message:'Name is Requried'})
        }
        if(!email){
            return res.send({message:'email is Requried'})
        }
        if(!password){
            return res.send({message:'password is Requried'})
        }
        if(!phone){
            return res.send({message:'Phone Number is Requried'})
        }
        if(!address){
            return res.send({message:'Address is Requried'})
        }
        if(!answer){
            return res.send({message:'Answer is Requried'})
        }

        //Check user
        const existinguser=await usermodel.findOne({email})
        //Existing user
        if(existinguser){
            return res.status(200).send({
                success:false,
                message:'Already Register please login',
            })
        }        
        //register user
        const hashedPassword=await hashPassword(password)
        //save
        const user = await new usermodel({name,email,phone,address,password:hashedPassword,answer}).save()
        res.status(201).send({
            success:true,
            message:"User Register Successfully",
            user,
        })



    } 
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Registeration',
            error,
        });
    }   
};



//POST Login
export const loginController=async(req,res)=>{
    try{
        const {email,password}=req.body
        //vaildation  
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'Invalid email or password'
            });
        }
        //check user
        const user =await usermodel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email is not registerd',
            });
        }
        const match=await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:'invalid password or email',
            });
        }
        
        //token
        const token= await JWT.sign({_id:user._id},process.env.JWT_SECERT,{expiresIn:"7d",});
        res.status(200).send({
            success:true,
            message:'login successfully',
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
            },
            token,
        });
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error In Login',
            error
        });
    }
};

//forgotpasswordController
export const forgotPasswordController= async (req,res)=>{
    try{
        const {email,answer,newpassword}=req.body
        if(!email){
            res.status(400).send({message:'Email is required'})
        }
        if(!answer){
            res.status(400).send({message:'answer is required'})
        }
        if(!newpassword){
            res.status(400).send({message:'Newpassword is required'})
        }
        //check
        const user=await usermodel.findOne({email,answer});
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Wrong Email or Answer",
            });
        }
        const hashed=await hashPassword(newpassword);
        await usermodel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success:true,
            message:"Password Reset Successfully",
        });
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Something went wrong',
            error
        })
    }
}



//test controller
export const  testcontroller=(req,res)=>{
    try{
        res.send("protected Route");
    }
    catch(error){
        console.log(error);
        res.send({error});
    }
}

//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await usermodel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await usermodel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Geting Orders",
      error,
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};












