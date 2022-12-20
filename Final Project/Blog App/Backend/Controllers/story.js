const asyncErrorWrapper = require("express-async-handler")
const Story = require("../Models/story");
const deleteImageFile = require("../Helpers/Libraries/deleteImageFile");
const { searchHelper, paginateHelper } = require("../Helpers/query/queryHelpers")

const addStory = asyncErrorWrapper(async (req, res, next) => {

    const { title, content } = req.body

    var wordCount = content.trim().split(/\s+/).length;

    let readtime = Math.round(wordCount / 200);


    try {
        const newStory = await Story.create({
            title,
            content,
            author: req.user._id,
            image: req.savedStoryImage,
            readtime
        })

        return res.status(200).json({
            success: true,
            message: "created blog successfully ",
            data: newStory
        })
    }

    catch (error) {

        deleteImageFile(req)

        return next(error)

    }

})

const getAllStories = asyncErrorWrapper(async (req, res, next) => {

    let query = Story.find();

    query = searchHelper("title", query, req)

    const paginationResult = await paginateHelper(Story, query, req)

    query = paginationResult.query;

    query = query.sort("-likeCount -commentCount -createdAt")

    const stories = await query

    return res.status(200).json(
        {
            success: true,
            count: stories.length,
            data: stories,
            page: paginationResult.page,
            pages: paginationResult.pages
        })

})

const getMyStories = asyncErrorWrapper(async (req, res, next) => {

    let query = Story.find({author: req.query.author});

    query = query.sort("-likeCount -commentCount -createdAt")

    const stories = await query

    return res.status(200).json(
        {
            success: true,
            count: stories.length,
            data: stories
        })

})



const detailStory = asyncErrorWrapper(async (req, res, next) => {

    const { slug } = req.params;
    const { activeUser } = req.body

    const story = await Story.findOne({
        slug: slug
    }).populate("author likes dislikes")

    const storyLikeUserIds = story.likes.map(json => json.id)
    const storydisLikeUserIds = story.dislikes.map(json => json.id)
    var likeStatus = false
    var dislikeStatus = false
    if(storyLikeUserIds.includes(activeUser._id)) {
        likeStatus = storyLikeUserIds.includes(activeUser._id)
    }else if(storydisLikeUserIds.includes(activeUser._id)) {
        dislikeStatus = storydisLikeUserIds.includes(activeUser._id)
    } 

    return res.status(200).
        json({
            success: true,
            data: story,
            likeStatus: likeStatus,
            dislikeStatus: dislikeStatus,
            storyLikeUserIds: storyLikeUserIds,
            storydisLikeUserIds : storydisLikeUserIds
        })

})

const likeStory = asyncErrorWrapper(async (req, res, next) => {

    const { activeUser } = req.body
    const { slug } = req.params;

    const story = await Story.findOne({
        slug: slug
    }).populate("author likes dislikes")

    const storyLikeUserIds = story.likes.map(json => json._id.toString())
    const storydisLikeUserIds = story.dislikes.map(json => json._id.toString())
    if (!storyLikeUserIds.includes(activeUser._id)) {
        if (storydisLikeUserIds.includes(activeUser._id)) {
            const index = storydisLikeUserIds.indexOf(activeUser._id)
            story.dislikes.splice(index, 1)
            story.dislikeCount = story.dislikes.length
            await story.save();
            var dislikeStatus = false
        }
        story.likes.push(activeUser)
        story.likeCount = story.likes.length
        await story.save();
        var likeStatus = true
    }
    else {

        const index = storyLikeUserIds.indexOf(activeUser._id)
        story.likes.splice(index, 1)
        story.likeCount = story.likes.length
        var likeStatus = false
        await story.save();
    }

    return res.status(200).
        json({
            success: true,
            data: story,
            likeStatus: likeStatus,
            dislikeStatus: dislikeStatus
        })

})

const dislikeStory = asyncErrorWrapper(async (req, res, next) => {

    const { activeUser } = req.body
    const { slug } = req.params;

    const story = await Story.findOne({
        slug: slug
    }).populate("author likes dislikes")

    const storydisLikeUserIds = story.dislikes.map(json => json._id.toString())

    const storyLikeUserIds = story.likes.map(json => json._id.toString())

    if (!storydisLikeUserIds.includes(activeUser._id)) {
        if (storyLikeUserIds.includes(activeUser._id)) {
            const index = storyLikeUserIds.indexOf(activeUser._id)
            story.likes.splice(index, 1)
            story.likeCount = story.likes.length
            var likeStatus = false
            await story.save();
        }
        story.dislikes.push(activeUser)
        story.dislikeCount = story.dislikes.length
        var dislikeStatus = true
        await story.save();
    }
    else {
        const index = storydisLikeUserIds.indexOf(activeUser._id)
        story.dislikes.splice(index, 1)
        story.dislikeCount = story.dislikes.length
        var dislikeStatus = false
        await story.save();
    }
    return res.status(200).
        json({
            success: true,
            data: story,
            likeStatus: likeStatus,
            dislikeStatus: dislikeStatus
        })

})



const editStoryPage = asyncErrorWrapper(async (req, res, next) => {
    const { slug } = req.params;

    const story = await Story.findOne({
        slug: slug
    }).populate("author likes dislikes")

    return res.status(200).
        json({
            success: true,
            data: story
        })

})


const editStory = asyncErrorWrapper(async (req, res, next) => {
    const { slug } = req.params;
    const { title, content, image, previousImage } = req.body;

    const story = await Story.findOne({ slug: slug })

    story.title = title;
    story.content = content;
    story.image = req.savedStoryImage;

    if (!req.savedStoryImage) {
        // if the image is not sent
        story.image = image
    }
    else {
        // if the image sent
        // old image locatıon delete
        deleteImageFile(req, previousImage)

    }

    await story.save();

    return res.status(200).
        json({
            success: true,
            data: story
        })

})

const deleteStory = asyncErrorWrapper(async (req, res, next) => {

    const { slug } = req.params;

    const story = await Story.findOne({ slug: slug })

    deleteImageFile(req, story.image);

    await story.remove()

    return res.status(200).
        json({
            success: true,
            message: "Story delete succesfully "
        })

})


module.exports = {
    addStory,
    getAllStories,
    getMyStories,
    detailStory,
    likeStory,
    dislikeStory,
    editStoryPage,
    editStory,
    deleteStory
}