import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'userSchema'
    },
    post_content:{
        type:String,
        required:true
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'commentSchema'
    }]

}, {timestamps: true})

postSchema.virtual('commentCount').get(function(){
    return this.comments.length
})

const Post = mongoose.model('postSchema',postSchema)
export default Post