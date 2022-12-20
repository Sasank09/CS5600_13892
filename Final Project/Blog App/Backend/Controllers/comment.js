const asyncErrorWrapper = require("express-async-handler")
const Story = require("../Models/story");
const User = require("../Models/user");
const Comment = require("../Models/comment");

const addNewCommentToStory  =asyncErrorWrapper(async(req,res,next)=> {

    const {slug} = req.params 

    const {star , content } =req.body 

    const story = await Story.findOne({slug :slug })

    const comment = await Comment.create({

        story :story._id ,
        content :content ,
        author : req.user.id ,
        star:star 
    })

    story.comments.push(comment._id)

    story.commentCount = story.comments.length

    await story.save();

    return res.status(200).json({
        success :true  , 
        data : comment 
    })

})


const getAllCommentByStory = asyncErrorWrapper(async(req, res, next) => {

    const { slug } = req.params
    const story = await Story.findOne({slug:slug})

    const commmentList =await Comment.find({
        story : story._id 
    }).populate({
        path :"author",
        select:"username photo"
    }).sort("-createdAt")

    return res.status(200)
        .json({
            success: true,
            count: story.commentCount,
            data: commmentList,
            storyAuthor: story.author
        })

})

const commentLike = asyncErrorWrapper(async(req, res, next) => {

    const { activeUser} =  req.body 
    const { comment_id} =  req.params 


    const comment = await Comment.findById(comment_id)

    if (!comment.likes.includes(activeUser._id)) {
        if (comment.dislikes.includes(activeUser._id)) {
            const index = comment.dislikes.indexOf(activeUser._id)
            comment.dislikes.splice(index, 1)
            comment.dislikeCount = comment.dislikes.length
            await comment.save();
            var dislikeStatus = false
        }
        comment.likes.push(activeUser._id)
        comment.likeCount = comment.likes.length ;
        await comment.save()  ;
        var likeStatus = true
    }
    else {
        const index = comment.likes.indexOf(activeUser._id)
        comment.likes.splice(index, 1)
        comment.likeCount = comment.likes.length
        await comment.save();
        var likeStatus = false
    }

    return res.status(200)
        .json({
            success: true,
            data : comment,
            likeStatus:likeStatus,
            dislikeStatus:dislikeStatus
        })

})

const commentdisLike = asyncErrorWrapper(async(req, res, next) => {

    const { activeUser} =  req.body 
    const { comment_id} =  req.params 
    const comment = await Comment.findById(comment_id)

    if (!comment.dislikes.includes(activeUser._id)) {
        if (comment.likes.includes(activeUser._id)) {
            const index = comment.likes.indexOf(activeUser._id)
            comment.likes.splice(index, 1)
            comment.likeCount = comment.likes.length
            await comment.save();
            var likeStatus = false
        }
        comment.dislikes.push(activeUser._id)
        comment.dislikeCount = comment.dislikes.length ;
        await comment.save()  ;
        var dislikeStatus = true
    }
    else {

        const index = comment.dislikes.indexOf(activeUser._id)
        comment.dislikes.splice(index, 1)
        comment.dislikeCount = comment.dislikes.length
        var dislikeStatus = false
        await comment.save();
    } 
    return res.status(200)
        .json({
            success: true,
            data : comment,
            likeStatus: likeStatus,
            dislikeStatus:dislikeStatus
        })

})


const getCommentLikeStatus = asyncErrorWrapper(async(req, res, next) => {

    const { activeUser} =  req.body 
    const { comment_id} =  req.params 

    const comment = await Comment.findById(comment_id)
    const likeStatus = comment.likes.includes(activeUser._id)
    const dislikeStatus = comment.dislikes.includes(activeUser._id)

    return res.status(200)
    .json({
        success: true,
        likeStatus:likeStatus,
        dislikeStatus:dislikeStatus
    })

})

const deleteComment = asyncErrorWrapper(async(req, res, next) => {
    const { comment_id} =  req.params 
    const storyId = req.query.story_id
    
    const comment = await Comment.findById(comment_id)
    await comment.remove()

    const story = await Story.findById(storyId)
    const index = story.comments.indexOf(comment_id)
    story.comments.splice(index, 1)
    story.commentCount = story.comments.length
    await story.save(); 
 
    return res.status(200).
        json({
            success: true,
            message: "Comment delete succesfully ",
        })

})

const blockUser = asyncErrorWrapper(async(req, res, next) => {

    const { commentUserId} =  req.params 
    const { activeUser} =  req.body 
    const user = await User.findById(activeUser._id)
 
    if (!user.blockedUsers.includes(commentUserId)) {
        user.blockedUsers.push(commentUserId)
        await user.save();
        var blockStatus = 'Unblock'
        return res.status(200).
        json({
            blockStatus: blockStatus,
            message: "User Blocked Succesfully "
        })
    }
    else {
        const index = user.blockedUsers.indexOf(commentUserId)
        user.blockedUsers.splice(index, 1)
        await user.save();
        var blockStatus = 'Block'
        return res.status(200).
        json({
            blockStatus: blockStatus,
            message: "User Unblocked Succesfully "
        })
    }
})

const getUserBlockedToComment = asyncErrorWrapper(async(req, res, next) => {
    const { slug } = req.params
    const { activeUser} =  req.body 
    const story = await Story.findOne({slug :slug })
    const storyAuthorDetails = await User.findById(story.author)
    
    if(storyAuthorDetails.blockedUsers.includes(activeUser._id)) {
        isUserBlocked = true
        return res.status(200).
        json({
            isUserBlocked: isUserBlocked,
        })
    }
    else {
        isUserBlocked = false
        return res.status(200).
        json({
            isUserBlocked: isUserBlocked,
        })
    }

})

module.exports ={
    addNewCommentToStory,
    getAllCommentByStory,
    commentLike,
    commentdisLike,
    getCommentLikeStatus,
    deleteComment,
    blockUser,
    getUserBlockedToComment
}