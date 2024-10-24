const { validateToken } = require("../sevices/authentication");

function checkForAuthCookie(cookieName){
    return(req,res,next)=>{
        const tokenCookieValue=req.cookies[cookieName]
        if(!tokenCookieValue){
        return next();
        }
        try {
            const userPayload=validateToken(tokenCookieValue);
            req.user=userPayload;
        } catch (error) {
           return next();
        }
        next();
    };
} 
module.exports={
    checkForAuthCookie,
};