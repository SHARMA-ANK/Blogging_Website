import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import {verify,sign} from 'hono/jwt';
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';

const app = new Hono()
app.route('/api/v1/user',userRouter);
app.route('/api/v1/blog',blogRouter);

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/blog',(c)=>{
  return c.json({message:"Blog Created"})
});

//whenenve there is serveless architecture then it cretae small machines all over the world and it will be very fast and it require connection pool to connect to database

//postgresql://Medium_owner:1Zu7FqoGXRrO@ep-long-poetry-a5g9rb6k.us-east-2.aws.neon.tech/Medium?sslmode=require
//DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiYTczNzJjMWUtMTJlOS00MzgwLWEzMTktOWJkYjY4ZmU5NGYxIiwidGVuYW50X2lkIjoiNjk3YmIxZGEwOTQzMDY2NmQ5N2U3YjNlYjI1MDE1Yzg0MzM1M2Q2NjdkNDdkZDIwMjljN2I2MDhkNDA4NTBjMSIsImludGVybmFsX3NlY3JldCI6IjcxMDM1YzU4LTI0NTEtNDI2ZC1hNjY0LTI5ZGFiODJjNjA5NSJ9.eyE0pZBNkJ0yRCnBioTg8v4Eb20URIRvjcXZ5BfTNeo"


export default app
