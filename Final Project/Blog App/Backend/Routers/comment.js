const express = require("express")

const { getAccessToRoute } = require("../Middlewares/Authorization/auth");

const { addNewCommentToStory ,getAllCommentByStory,commentLike, commentdisLike,getCommentLikeStatus, deleteComment,blockUser, getUserBlockedToComment} = require("../Controllers/comment")

const { checkStoryExist } = require("../Middlewares/database/databaseErrorhandler");

const router = express.Router() ;


router.post("/:slug/addComment",[getAccessToRoute,checkStoryExist] ,addNewCommentToStory)

router.get("/:slug/getAllComment",getAllCommentByStory)

router.post("/:slug/isUserBlockedToComment", getUserBlockedToComment)

router.post("/:comment_id/like",commentLike)

router.post("/:comment_id/dislike",commentdisLike)

router.post("/:comment_id/getCommentLikeStatus",getCommentLikeStatus)

router.post("/:comment_id/deleteComment",deleteComment)

router.post("/:commentUserId/block",blockUser)
module.exports = router