import jwt from "jsonwebtoken";

export const isAuthenticated = (req,res,next) => {
    let decoded;
    try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        if(!token) {
            return res.status(401).json({
                message:"user not authenticaed",
                success:false,
            })
        }
        decoded = jwt.verify(token,process.env.SECRET_KEY);
        if(!decoded) {
            return res.status(401).json({
                message:"invalid token",
                success:false,
            })
        }
        req.user=decoded
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
      message:"Authentication failed",
      success:false
   })
    }
}