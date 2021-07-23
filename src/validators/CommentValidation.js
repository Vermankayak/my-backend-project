import { param } from "express-validator";
import Comment from "../models/Comment";

export class CommentValidator{
    constructor(){

    }
    static addComment(){
        return [
            body('comment_content', 'Comment content is required.').isString(),
        ]
    }

    static editComment(){
        return [
            body('comment_content', 'Comment content is required.').isString()
        ]
    }

    static deleteComment(){
        return [
            param('id').custom(async (id, {req}) => {
                const comment = await Comment.findOne(
                    {_id:id}
                )  
                if (comment){
                    req.comment = comment
                    return true
                }else{
                    throw new Error('Comment not found.')
                }
            })
        ]
    }
    
}