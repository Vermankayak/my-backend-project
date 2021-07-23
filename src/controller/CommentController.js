import Comment from "../models/Comment"
import Post from "../models/Post"

export class CommentController{
    constructor(){

    }
    static async addComment(req, res, next){
        const comment_content = req.body.comment_content

        const comment = await Comment.create({
            comment_content:comment_content
        }).exec()

        const post = await Post.findByIdAndUpdate(
            req.param.id,
            {
                $push:{comments:comment._id}
            }, {new:true}
        )
        if(post){
            res.send(post)
        }else{
            return next(new Error('Post does not exist'))
        }
    }

    static async editComment(req, res, next){
        const comment_content = req.body.comment_content

        const comment_id = req.param.id

        const comment = await Comment.findOneAndUpdate(
            {_id:id},
            {
                comment_content:comment_content
            }, {new:true}
        )
        if(comment){
            res.send(comment)
        }else{
            return next(new Error('Comment not found!'))
        }
    }

    static async deleteComment(req, res, next) {
        const comment = req.comment
        await comment.remove()
        res.send(comment)
    }
}