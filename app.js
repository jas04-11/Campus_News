require("dotenv").config();

const express=require("express");
const path=require("path");
const userRoute=require("./routes/user");
const blogRoute=require("./routes/blog");

const mongoose=require("mongoose");
const cookieParser=require("cookie-parser");
const Blog=require("./models/blog");
const { checkForAuthCookie } = require("./middlewares/authentication");

const app=express();
const PORT= process.env.PORT || 9000;
const mongoUri=process.env.MONGO_URL;
console.log('Mongo URL:', mongoUri);

if (!mongoUri) {
    throw new Error('MONGO_URL is not defined in the environment variables');
  }
  
mongoose.connect(mongoUri,{ useNewUrlParser: true, useUnifiedTopology: true })
.then((e) => console.log("mongodb connected"));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthCookie("token"));
app.use(express.static(path.resolve("./public/images")));

app.get("/",async(req,res)=>{
    const allBlogs=await Blog.find({});
    res.render("home",{
        user : req.user,
        blogs:allBlogs,
    });
});

app.use("/user",userRoute);
app.use("/blog",blogRoute);


app.listen(PORT,()=> console.log(`server started at: ${PORT} `));