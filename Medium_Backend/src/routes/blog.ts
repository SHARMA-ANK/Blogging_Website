import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogInput,updateBlogInput } from "ankitsharma67891-medium-common";
 export const blogRouter=new Hono<{
    Bindings:{
      DATABASE_URL:string;
      JWT_SECRET:string;
    },
    Variables:{
        id:string;
        userId:string;
    }
  }
  >();


blogRouter.use('/*',async(c,next)=>{
    const token= c.req.header('Authorization')||'';
    const user=await verify(token,c.env.JWT_SECRET);
    if(user){
        c.set("userId", user.id as string);
        await next();
    }else{
        c.status(401);
        return c.json({message:"Unauthorized"});
    }
})



blogRouter.post('/createBlog',async(c)=>{
    const body=await c.req.json();
    const {success}=createBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({message:"Inputs are INVALID"});
    }
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
        }).$extends(withAccelerate());
    try{
        const blog=await prisma.blog.create({
            data:{
                content:body.content,
                title:body.title,
                authorId:Number(c.get('userId'))
            }
        });
        return c.json({message:"Blog Created",blogId:blog.id});
    }catch(e){
        console.log(e);
        c.status(411);
        return c.json({message:"Bad Request!Error While creating the BLog"});
    }});

blogRouter.put('/updateBlog',async(c)=>{
    const body=await c.req.json();
    const {success}=updateBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({message:"Inputs are INVALID"});
    }
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
        }).$extends(withAccelerate());
    try{
        const blog=await prisma.blog.update({
            where:{
                id:Number(body.id)
            },
            data:{
                content:body.content,
                title:body.title
            }
        });
        return c.json({message:"Blog Updated",blogId:blog.id});
    }catch(e){
        console.log(e);
        c.status(411);
        return c.json({message:"Bad Request!Error While Updating the Blog"});
    }});
    
    blogRouter.get('/bulkBlogs',async(c)=>{
        const prisma=new PrismaClient({
            datasourceUrl:c.env.DATABASE_URL,
            }).$extends(withAccelerate());
        try{
            const blogs=await prisma.blog.findMany();
            return c.json({message:"Blogs Found",blogs});
        }catch(e){
            console.log(e);
            c.status(411);
            return c.json({message:"Bad Request!Error While Finding the Blogs"});
        }});
blogRouter.get('/:id',async(c)=>{
    const id= c.req.param('id');
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
        }).$extends(withAccelerate());
    try{
        const blog=await prisma.blog.findFirst({
            where:{
                id:Number(id)
            }
        });
        return c.json({message:"Blog Found",blog});
    }catch(e){
        console.log(e);
        c.status(411);
        return c.json({message:"Bad Request!Error While Finding the Blog"});
    }}
);

