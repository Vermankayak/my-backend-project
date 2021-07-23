import Post from "../models/Post";

export class PostController{
    static async addPost(req, res, next){
        const user_id = req.user._id
        const post_content = req.body.post_content
        const post = await Post.create({
            user_id:user_id,
            post_content:post_content
        })
        res.send(post)
    }

    static getPostById(req, res, next){
        res.json({
            post:req.post,
            commentCount: req.post.commentCount
        })
    }

    static async getAllPosts(){
        const page = parseInt(req.query.page)
        const postsPerPage = 2
        let currentPage = page
        let prevPage = page === 1? null: page - 1
        let nextPage = page + 1
        let totalPages;

        const totalPostCounts = await Post.countDocuments({})
        totalPages = Math.ceil(totalPostCounts / postsPerPage)
        if(totalPages === currentPage || totalPages === 0) {
            nextPage = null
        }
        if(page > totalPages) {
            return next(new Error("No more posts to show"))
        }
        const posts = await Post.find({}, {__v:0, user_id:0}).populate('comments').skip(postsPerPage * page).limit(postsPerPage)

        res.json({
            posts: posts,
            nextPage:nextPage,
            totalPages: totalPages,
            currentPage:currentPage,
            prevPage:prevPage
        })
    }

    static async getPostByUser(){
       const user_id = req.user._id
       const page = parseInt(req.query.page)
       const postsPerPage = 2
       let currentPage = page
       let prevPage = page === 1? null: page - 1
       let nextPage = page + 1
       let totalPages;

       const postCount = await Post.countDocuments({
           user_id = user_id
       })
       totalPages = Math.ceil(postCount / postsPerPage)
       if(totalPages === page || totalPages === 0) {
            nextPage = null
       }
       if(page > totalPages){
            return next(new Error("No more Post to show."))
       }
       const posts = await Post.find({
           user_id:user_id
       },{
           __v:0,
           user_id:0
       }).populate('comments').skip(postsPerPage * page).limit(postsPerPage)

       res.json({
           posts: posts,
           nextPage:nextPage,
           totalPages: totalPages,
           currentPage:currentPage,
           prevPage:prevPage
       })
    }

    static async editPost(req, res, next){
        const post = await Post.findOneAndUpdate(
            {
                _id:req.params.id
            },
            {
                post_content:req.body.content
            },{new:true}
        ).populate('comments')

        res.json({
            message:'successfully updated the post.',
            post:post            
        })
    }

    static async deletePost(req, res, next) {
        const post = req.post
        await post.remove()
        req.send(post)
    }
}