import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import User from './routes/UserRoutes.js';
import Role from './routes/RoleRoute.js';
import Post from './routes/PostRoute.js';
import Comment from './routes/CommentRoute.js';
import Category from './routes/CategoryRoute.js';
import multer from 'multer';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })

  const upload = multer({storage});

app.post('/api/upload', upload.single('file'), function (req, res) {
    const file = req.file
    res.status(200).json(file.filename)
})

app.use(User)
app.use(Role)
app.use(Post)
app.use(Comment)
app.use(Category)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})