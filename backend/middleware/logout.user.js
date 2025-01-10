import asyncHandler from "../asyncHandler"
import jwt from "jsonwebtoken"
import ApiError from "../modle/ApiError"
import User from "../modle/user.modle"


export const verifyJwt=asyncHandler(async(req,res,next)=>{

try {
       const token= req.cookies.accessToken || Headers("Authraization")?.replace("Bearar ", "") 
    
       if(!token){
        throw new ApiError(403,"token is not found")
       }
       const decodeToken=jwt.verify(token,process.env.accessToken)
    
       const user =await User.findById(decodeToken._id).select('-password -accessToken')
    
       if(!user){
        throw new ApiError(403,"user is not found")
       }
    
       req.user=user
       next()
    
} catch (error) {
    throw new ApiError(403,"user is not found")
}
})

