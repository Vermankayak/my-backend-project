import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    comment_content:{
        type:String,
        required:true
    },
    
})

const Comment = mongoose.model('commentSchema',commentSchema)
export default Comment