import { body, param } from "express-validator";
import Post from "../models/Post";

export class PostValidator{
    static addPost(){
        return [
            body('post_content', 'Post Content is required').isString()
        ]
    }

    static getPostById(){
        return [
            param('post_id').custom((id, {req})=> {
                Post.findOne({
                    _id:id
                },{
                    _v:0,
                    user_id:0
                }).populate('comments').then((post) => {
                    if(post){
                        req.post = post;
                        return true
                    } else{
                        throw new Error('Post does not exist!')
                    }
                })
            })
        ]
    }

    static editPost(){
      return [
          body('content', 'Content is Required').isString()
      ]
    }
    static deletePost(){
        return[
            param('id').custom(async (id, {req}) => {
               const post =  await Post.findOne({
                    _id:id
                },{
                    __v:0,
                    user_id:0
                })
                if(post){
                    req.post = post
                    return true
                }else{
                    throw new Error("Post does not exist")
                }
            })
        ]
    }
}