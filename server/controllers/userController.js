import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

// Sign up new user
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({
                success: false,
                message: 'Missing Deatails'
            })
        }

        const user = await userModel.findOne({ email })
        if (user) {
            return res.json({
                success: false,
                message: 'User already have'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await userModel.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        })

        const token = generateToken(newUser._id)

        res.json({
            success: true,
            user: newUser,
            token,
            message: 'successfully!'
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Login user
export const login = async (req, res) => {
    
    try {
        const { email, password } = req.body
        const userData = await userModel.findOne({ email })

        const isPasswordCorrect = await bcrypt.compare(password, userData.password)
        if (!isPasswordCorrect) {
            return res.json({
                success: false,
                message: 'Invalid Credentials'
            })
        }

        const token = generateToken(userData._id)
        res.json({
            success: true,
            token,
            message: 'Login Successful!'
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
        
    }
}

export const checkAuth = (req, res) => {
    res.json({
        success: true,
        user: req.user
    })
}

export const updateProfile = async (req, res) => {

    try {
        const { profilePic, bio, fullName } = req.body

        const userId = req.user._id
        let updatedUser

        if (!profilePic) {
            updatedUser = await userModel.findByIdAndUpdate(userId, {bio, fullName}, {new: true})
        } else {
            const upload = await cloudinary.uploader.upload(profilePic)

            updatedUser = await userModel.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new: true})
        }
        

        res.json({
            success: true,
            user: updatedUser
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}