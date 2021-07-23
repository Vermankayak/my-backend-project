import express from "express";
import {PostController} from "../controller/PostController.js";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware.js";
import { Utils } from "../utils/Utils.js";
import { PostValidator } from "../validators/PostValidation.js";


class PostRouter{
    constructor(){
    this.router = express.Router();
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes()
    }
    getRoutes(){
        this.router.get('/me', GlobalMiddleware.authenticate, PostController.getPostByUser)
        this.router.get('/all', GlobalMiddleware.authenticate, PostController.getAllPosts)
        this.router.get(':post_id', GlobalMiddleware.authenticate, PostValidator.getPostById(), GlobalMiddleware.checkError, PostController.getPostById)
    }
    postRoutes(){
        this.router.post('/add', GlobalMiddleware.authenticate, PostValidator.addPost(), GlobalMiddleware.checkError, PostController.addPost)
    }
    patchRoutes(){
        this.router.patch('/edit/:id', GlobalMiddleware.authenticate, PostValidator.editPost(), GlobalMiddleware.checkError, PostController.editPost)
    }
    deleteRoutes(){
        this.router.delete('/delete/:id', GlobalMiddleware.authenticate, PostValidator.deletePost(), GlobalMiddleware.checkError, PostController.deletePost)
    }
  
}
const newPostRouter = new PostRouter();

export default newPostRouter.router;