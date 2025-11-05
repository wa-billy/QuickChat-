import userModel from "../models/userModel.js"
import jwt from 'jsonwebtoken'


// Protect Route
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token
        const decoded = jwt.verify(token, process.env.SECRET)

        const user = await userModel.findById(decoded.userId).select("-password")

        if (!user) {
            return res.json({
                success: false,
                message: 'User Not Found'
            })
        }

        req.user = user

        next()
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}