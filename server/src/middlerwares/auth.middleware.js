import jsonwebtoken from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async(req , res ,next) => {
    try{
        const token = req.cookies.jwt

        if (!token){
            return res.status(400).json({message : "Unauthorized - No token provided"})
        }

        const decoded = jsonwebtoken.verify(token , process.env.JWT_SECRET)

        if (!decoded){
            return res.status(400).json({message : "Unauthorized - Invalid token"})
        }

        const user = await User.findById(decoded.userId).select("-password")

        if (!user){
            return res.status(404).json({message : "User Not found"})
        }

        req.user = user;
        next()
    }
    catch(error){
        console.log("error in protected route" , error.message)
        res.status(400).json({message : "Internal server error"})
    }
}