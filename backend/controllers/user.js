const express = require("express");
const jwt = require("jsonwebtoken")
require("dotenv").config();
const bcrypt = require("bcryptjs");

const Admin = require("../models/admin");

// exports.loginStudent = async(req,res) => {
//     try{
//         const {email,password} = req.body;

//         if(!email || !password){
//             return res.status(401).json({
//                 success:false,
//                 message:"enter all the details"
//             })
//         }

//         const existingUser = await Student.findOne({email});

//         if(!existingUser){
//             return res.status(401).json({
//                 success:false,
//                 message:"user does not  exists"
//             })
//         }

//         const isPass = await bcrypt.compare(password,existingUser.password);

//         if(!isPass){
//             return res.status(404).json({
//                 success:false,
//                 message:"password does not matches"
//             })
//         }

//         const payload = {
//             email:existingUser.email,
//             id:existingUser._id,
//             accountType:"Student",
//         }

//         let token = jwt.sign(payload,process.env.JWT_SECRET,{
//             expiresIn:"2h",
//         })

//         const userObj = existingUser.toObject();
//         userObj.token = token;
//         userObj.password = undefined;

//         const options = {
//             expires:new Date(Date.now() + 3*24*60*60*1000),
//             httpOnly:true,
//         }

//         res.cookie("token",token,options).status(200).json({
//             success:true,
//             token,
//             userObj,
//             message:"Logged in successfully"
//         })

//     }catch(error){
//         return res.status(500).json({
//             success:false,
//             message:"Login unsuccesssful"
//         })
//     }
// }

exports.loginAdmin = async(req,res) => {
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(401).json({
                success:false,
                message:"enter all the details"
            })
        }

        const existingUser = await Admin.findOne({email});

        if(!existingUser){
            return res.status(401).json({
                success:false,
                message:"user does not  exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const isPass = await bcrypt.compare(password,hashedPassword);

        if(!isPass){
            return res.status(404).json({
                success:false,
                message:"password does not matches"
            })
        }

        const payload = {
            email:existingUser.email,
            id:existingUser._id,
            accountType:"Admin",
        }

        let token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h",
        })

        const userObj = existingUser.toObject();
        userObj.token = token;
        userObj.password = undefined;

        const options = {
            expires:new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true,
        }

        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            userObj,
            message:"Logged in successfully"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Login unsuccesssful"
        })
    }
}


exports.signupAdmin = async(req,res) => {
    try{
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.status(401).json({
                success:false,
                message:"All fields are required for creating a account"
            })
        }

        const user = await Admin.create({
            name,
            email,
            password
        })

        if(!user){
            return res.status(403).json({
                success:false,
                message:"not able to create user"
            })
        }

        return res.status(200).json({
            success:true,
            userObj:user,
            message:"user created successfully"
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
};

// exports.loginGoogle = async(req,res) => {
//     try{

//         const  {firebaseToken} = req.body;

//         const decoded = await admin.auth().verifyIdToken(firebaseToken);

//         let user = await Student.findOne({email : decoded.email});

//         if(!user){
//             user = await Student.create({
//                 email: decoded.email,
//                 name: decoded.name || "Google User",
//                 phone: NULL,
//                 college: NULL,
//                 year: NULL,
//                 field: NULL, 
//             });
//         }

//         const payload = {
//             email: user.email,
//             id: user._id,
//             accountType:"Student",
//         };

//         let token = jwt.sign(payload, process.env.JWT_SECRET, {
//             expiresIn: "2h",
//         });

//         const userObj = user.toObject();
//         userObj.token = token;
//         userObj.password = undefined;

//         const options = {
//             expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//             httpOnly: true,
//         };

//         res.cookie("token", token, options).status(200).json({
//             success: true,
//             token,
//             userObj,
//             message: "Logged in successfully with Google",
//         });

//     }catch(error){
//         return res.status(500).json({
//             success: false,
//             message: "Google login unsuccessful",
//             error: error.message,
//         });
//     }
// }
