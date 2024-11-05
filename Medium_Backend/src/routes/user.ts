import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { signinInput ,signupInput} from "ankitsharma67891-medium-common";
export const userRouter=new Hono<{
    Bindings:{
      DATABASE_URL:string;
        JWT_SECRET:string;
    }
  }
  >();
userRouter.post('/signIn',async(c)=>{
    const body=await c.req.json();
    const {success}=signinInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({message:"Inputs are INVALID"});
    }
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
        }).$extends(withAccelerate());
   try{ const user=await prisma.user.findFirst({
        where:{
            email:body.email,
            password:body.password
        }});
    if(!user){
        c.status(401);
        return c.json({message:"Invalid Credentials"});
    }
    const jwt=await sign({id:user.id},c.env.JWT_SECRET);
    return c.json({message:"User Signed In",token:jwt});
}
    catch(e){
        console.log(e);
        c.status(411);
        return c.json({message:"Bad Request"});
    }
  });
userRouter.post('/signUp',async(c)=>{
    const body=await c.req.json();
    const {success}=signupInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({message:"Inputs are INVALID"});
    }
    console.log(c.env.DATABASE_URL);
    const prisma = new PrismaClient({
      datasourceUrl:c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  
    try{
      const user=await prisma.user.create({
      data:{
        email:body.email,
        password:body.password,
        firstName:body.firstName,
        lastName:body.lastName,
      }
      
    })
    const jwt=await sign({id:user.id},"Ankit123");
    return c.json({message:"User Signed Up",token:jwt});}
    catch(e){
      console.log(e);
      c.status(411);
      return c.json({message:"Bad Request"});
    }
  });