const BlogPost = require('../models/BlogPost')

exports.getPosts = async (req, res) => {
    try {
        console.log('request came')
        let posts = []
        if (req.query.startDate) {
            console.log('with start date', req.query.startDate)
            posts = await BlogPost.find({ postedDate: { $lt: req.query.startDate } }).sort({ postedDate: -1 }).limit(5)
        } else {
            console.log('without start date')
            post = await BlogPost.find().sort({ postedDate: -1 }).limit(5)
        }
        res
            .status(200)
            .json({
                success: true,
                posts
            })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: error.message
            })
    }
}

exports.getPostsById = async (req, res) => {
    try {
        const { id } = req.params
        const post = await BlogPost.findOne({ id })

        res.json({
            success:true,
            post
        })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: error.message
            })
    }
}

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.body
        await BlogPost.findOneAndDelete({ id })

        res.json({
            success: true,
            message: 'Successfully deleted'
        })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: error.message
            })
    }
}

exports.makePost = async (req, res) => {
    try {
        const { post, editMode } = req.body
        if (editMode) {
            await BlogPost.findOneAndUpdate({ id: post.id }, post)
            res.json({
                success: true,
                message: 'Editted post successfully'
            })
        } else {
            const newPost = new BlogPost(post)
            await newPost.save()
            res.json({
                success: true,
                message: 'Made new post successfully'
            })
        }
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}