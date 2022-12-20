import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { AiOutlineLike, AiFillLike, AiOutlineDislike, AiFillDislike, AiTwotoneDelete } from 'react-icons/ai'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

const CommentItem = ({ comment, activeUser, storyAuthor }) => {
    const navigate = useNavigate()
    const [likeCount, setLikeCount] = useState(comment.likeCount)
    const [likeStatus, setLikeStatus] = useState(false)
    const [dislikeCount, setdisLikeCount] = useState(comment.dislikeCount)
    const [dislikeStatus, setdisLikeStatus] = useState(false)
    const [blockMessage, setBlockMessage] = useState(false)
    const [blockStatus, setBlockStatus] = useState(false)
    const [deleteMessage, setDeleteMessage] = useState(false)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {

        const getCommentLikeStatus = async () => {

            const comment_id = comment._id
            try {
                const { data } = await axios.post(`/comment/${comment_id}/getCommentLikeStatus`, { activeUser }, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                })
                setLikeStatus(data.likeStatus)
                setdisLikeStatus(data.dislikeStatus)

            }
            catch (error) {

                localStorage.removeItem("authToken")
                navigate("/")
            }
        }
        const getBlockStatus = async () => {

            const blockBtn = activeUser.blockedUsers.includes(comment.author._id) ? 'Unblock' : 'Block'
            setBlockStatus(blockBtn)

        }

        getCommentLikeStatus()
        getBlockStatus()

    }, [])
    const editDate = (createdAt) => {
        const d = new Date(createdAt);
        var datestring = d.toLocaleString('eng', { month: 'long' }).substring(0, 3) + " " + d.getDate()
        return datestring
    }


    const handleCommentLike = async () => {
        const comment_id = comment._id
        try {
            const { data } = await axios.post(`/comment/${comment_id}/like`, { activeUser }, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            })

            setLikeCount(data.data.likeCount)
            setLikeStatus(data.likeStatus)
            setdisLikeCount(data.data.dislikeCount)
            setdisLikeStatus(data.dislikeStatus)

        }
        catch (error) {
            localStorage.removeItem("authToken")
            navigate("/")
        }
    }

    const handleCommentdisLike = async () => {
        const comment_id = comment._id

        try {
            const { data } = await axios.post(`/comment/${comment_id}/dislike`, { activeUser }, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            })

            setLikeCount(data.data.likeCount)
            setLikeStatus(data.likeStatus)
            setdisLikeCount(data.data.dislikeCount)
            setdisLikeStatus(data.dislikeStatus)

        }
        catch (error) {
            localStorage.removeItem("authToken")
            navigate("/")
        }
    }
    const handleDelete = async () => {
        const comment_id = comment._id
        try {
            const { data } = await axios.post(`/comment/${comment_id}/deleteComment?story_id=${comment.story}`, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            })
            setDeleteMessage(data.message)
            setTimeout(() => {
                document.querySelector(".commentCount").textContent = document.querySelector(".commentCount").textContent - 1
            }, 650);
            setShow(false)
            setTimeout(() => {
                setDeleteMessage('')
            }, 2500)

        }
        catch (error) {
            localStorage.removeItem("authToken")
            navigate("/")
        }
    }

    const handleBlockUser = async () => {
        const commentUserId = comment.author._id ? comment.author._id : undefined
        try {
            const { data } = await axios.post(`/comment/${commentUserId}/block`, { activeUser }, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            })
            setBlockMessage(data.message)
            setTimeout(() => {
                setBlockMessage('')
            }, 2500)

            setBlockStatus(data.blockStatus)
        }
        catch (error) {
            localStorage.removeItem("authToken")
            navigate("/")
        }
    }

    return (
        <>
            <div>
                {blockMessage && <Alert key={'success'} variant={'success'}>{blockMessage}</Alert>}
            </div>
            <div className='comment-item'>
                <div className="comment-top-block">
                    {deleteMessage && <div className="alert-success-message mt-3">{deleteMessage}</div>}
                    <section>
                        <img src={`/userPhotos/${comment.author.photo}`} alt={comment.author.username} width="35" />

                        <div>
                            <span className='comment-author-username' >{comment.author.username}</span>
                            <span className='comment-createdAt'>{editDate(comment.createdAt)}</span>
                        </div>
                    </section>
                    <section>
                        {activeUser && comment.author._id && storyAuthor !== comment.author._id && storyAuthor === activeUser._id ?
                            <div className='btn text-danger fw-bold fs-6' onClick={handleBlockUser}>
                                <Button variant="outline-danger" size="sm">{blockStatus}</Button>{' '}
                            </div>
                            : null
                        }
                        {activeUser && comment.author._id === activeUser._id ?
                            <div className="top_story_transactions">
                                <span className='deleteStoryLink' onClick={handleShow}>
                                    <AiTwotoneDelete style={{ color: "red", }} />
                                </span>
                            </div> : null
                        }

                    </section>
                </div>


                <div className="comment-content">

                    <span dangerouslySetInnerHTML={{ __html: comment.content }}></span>

                </div>


                <div className="comment-bottom-block">
                    <div className="commentLike-wrapper">


                        <i className='biLike' onClick={() => handleCommentLike()}>
                            {
                                likeStatus ? <AiFillLike color="#0063a5" /> : <AiOutlineLike />

                            }
                        </i>
                        <span className='commentlikeCount'>
                            {likeCount}

                        </span>
                        &nbsp;
                        <i className='biLike' onClick={() => handleCommentdisLike()}>
                            {
                                dislikeStatus ? <AiFillDislike color="#0063a5" /> : <AiOutlineDislike />

                            }
                        </i>
                        <span className='commentlikeCount'>
                            {dislikeCount}

                        </span>
                    </div>

                    <div className="comment-star">
                        {
                            [...Array(5)].map((_, index) => {
                                return (
                                    <FaStar
                                        key={index}
                                        className="star"
                                        size={15}
                                        color={comment.star > index ? "#0205b1" : "grey"}
                                    />
                                )
                            })
                        }

                    </div>

                </div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

export default CommentItem;
