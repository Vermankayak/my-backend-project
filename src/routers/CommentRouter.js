import express from "express";
import { CommentController } from "../controller/CommentController";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { CommentValidator } from "../validators/CommentValidation";

class CommentRouter{
    constructor(){
        this.router = express.Router()
        this.postRoutes()
        this.patchRoutes()
        this.deleteRoutes()
    }
   
    postRoutes(){
        this.router.post('/add/:id', GlobalMiddleware.authenticate, CommentValidator.addComment(), GlobalMiddleware.checkError, CommentController.addComment)
    }
    patchRoutes(){
        this.router.patch('/edit/:id', GlobalMiddleware.authenticate, CommentValidator.editComment(), GlobalMiddleware.checkError, CommentController.editComment)
    }
    deleteRoutes(){
        this.router.delete('/delete/:id', GlobalMiddleware.authenticate, CommentValidator.deleteComment(), GlobalMiddleware.checkError, CommentController.deleteComment)
    }
}

const newCommentRouter = new CommentRouter();

export default newCommentRouter.router