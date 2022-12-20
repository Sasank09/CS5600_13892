import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import "../../Css/DetailStory.css"
import Loader from '../GeneralScreens/Loader';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai'
import { AiFillDislike, AiOutlineDislike } from 'react-icons/ai'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FiEdit } from 'react-icons/fi'
import { FaRegComment } from 'react-icons/fa'
import { BsBookmarkPlus, BsThreeDots, BsBookmarkFill } from 'react-icons/bs'
import CommentSidebar from '../CommentScreens/CommentSidebar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const DetailStory = () => {
  const [likeStatus, setLikeStatus] = useState(false)
  const [dislikeStatus, setdisLikeStatus] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [dislikeCount, setdisLikeCount] = useState(0)
  const [commentCount, setCommentCount] = useState(0)
  const [activeUser, setActiveUser] = useState({})
  const [story, setStory] = useState({})
  const [sidebarShowStatus, setSidebarShowStatus] = useState(false)
  const [loading, setLoading] = useState(true)
  const slug = useParams().slug
  const [storyReadListStatus, setStoryReadListStatus] = useState(false)
  const navigate = useNavigate()

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {

    const getDetailStory = async () => {
      setLoading(true)
      var activeUser = {}
      try {
        const { data } = await axios.get("/auth/private", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        activeUser = data.user

        setActiveUser(activeUser)

      }
      catch (error) {
        setActiveUser({})
      }

      try {
        const { data } = await axios.post(`/story/${slug}`, { activeUser })
        setStory(data.data)
        setLikeStatus(data.likeStatus)
        setLikeCount(data.data.likeCount)
        setdisLikeStatus(data.dislikeStatus)
        setdisLikeCount(data.data.dislikeCount)
        setCommentCount(data.data.commentCount)
        setLoading(false)

        const story_id = data.data._id;

        if (activeUser.readList) {

          if (!activeUser.readList.includes(story_id)) {
            setStoryReadListStatus(false)
          }
          else {
            setStoryReadListStatus(true)

          }

        }

      }
      catch (error) {
        setStory({})
        navigate("/not-found")
      }

    }
    getDetailStory();

  }, [slug, setLoading])



  const handleLike = async () => {

    try {
      const { data } = await axios.post(`/story/${slug}/like`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      setTimeout(() => {
        setdisLikeStatus(data.dislikeStatus)
        setLikeStatus(data.likeStatus)
      }, 500)
      setLikeCount(data.data.likeCount)
      setdisLikeCount(data.data.dislikeCount)
    }
    catch (error) {
      setStory({})
      localStorage.removeItem("authToken")
      navigate("/")
    }

  }

  const handleDisLike = async () => {
    try {
      const { data } = await axios.post(`/story/${slug}/dislike`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      setTimeout(() => {
        setdisLikeStatus(data.dislikeStatus)
        setLikeStatus(data.likeStatus)
      }, 500)

      setdisLikeCount(data.data.dislikeCount)
      setLikeCount(data.data.likeCount)
    }
    catch (error) {
      setStory({})
      localStorage.removeItem("authToken")
      navigate("/")
    }

  }



  const handleStoryDelete = async () => {

    try {
      setLoading(true)
      await axios.delete(`/story/${slug}/delete`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      navigate("/")
      setLoading(true)
    }
    catch (error) {
      console.log(error)
    }
  }


  const createdDate = (createdAt) => {

    const d = new Date(createdAt)
      ;
    var datestring = d.toLocaleString('eng', { month: 'long' }).substring(0, 3) + " " + d.getDate()
    return datestring
  }

  const addStoryToReadList = async () => {

    try {

      const { data } = await axios.post(`/user/${slug}/addStoryToReadList`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      setStoryReadListStatus(data.status)

      document.getElementById("readListLength").textContent = data.user.readListLength
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {
        loading ? <Loader /> :
          <>

            <div className='Inclusive-detailStory-page'>

              <div className="top_detail_wrapper">

                <h5>{story.title}</h5>

                <div className='story-general-info'>

                  <ul>
                    {story.author &&
                      <li className='story-author-info'>
                        <img src={`/userPhotos/${story.author.photo}`} alt={story.author.username} />
                        <span className='story-author-username'>{story.author.username}  </span>
                      </li>
                    }
                    <li className='story-createdAt'>
                      {
                        createdDate(story.createdAt)
                      }
                    </li>
                    <b>-</b>

                    <li className='story-readtime'>
                      {story.readtime} min read

                    </li>

                  </ul>

                  {
                    !activeUser.username &&
                    <div className='comment-info-wrap'>

                      <i onClick={(prev) => {
                        setSidebarShowStatus(!sidebarShowStatus)
                      }}>
                        <FaRegComment />
                      </i>


                      <b className='commentCount'>{commentCount}</b>

                    </div>
                  }

                  {activeUser && story.author &&
                    story.author._id === activeUser._id ?
                    <div className="top_story_transactions">
                      <Link className='editStoryLink' to={`/story/${story.slug}/edit`}>
                        <FiEdit />
                      </Link>

                      <span className='deleteStoryLink' onClick={handleShow}>
                        <RiDeleteBin6Line />
                      </span>
                    </div> : null
                  }
                </div>

              </div>

              <div className="CommentFieldEmp">

                <CommentSidebar slug={slug} sidebarShowStatus={sidebarShowStatus} setSidebarShowStatus={setSidebarShowStatus}
                  activeUser={activeUser}
                />

              </div>

              <div className='story-content' >

                <div className="story-banner-img">
                  <img src={`/storyImages/${story.image}`} alt={story.title} />

                </div>

                <div className='content' dangerouslySetInnerHTML={{ __html: (story.content) }}>
                </div>

              </div>

              {activeUser.username &&
                <div className='fixed-story-options'>

                  <ul>
                    <li>

                      <i onClick={handleLike} >

                        {likeStatus ? <AiFillLike color="#0063a5" /> : <AiOutlineLike />}
                      </i>

                      <b className='likecount'
                        style={likeStatus ? { color: "#0063a5" } : { color: "rgb(99, 99, 99)" }}
                      >  {likeCount}
                      </b>

                    </li>

                    <li>
                      <i onClick={handleDisLike} >
                        {dislikeStatus ? <AiFillDislike color="#0063a5" /> :
                          <AiOutlineDislike />
                        }
                      </i>

                      <b className='likecount'
                        style={dislikeStatus ? { color: "#0063a5" } : { color: "rgb(99, 99, 99)" }}
                      >  {dislikeCount}
                      </b>
                    </li>


                    <li>
                      <i onClick={(prev) => {
                        setSidebarShowStatus(!sidebarShowStatus)
                      }}>
                        <FaRegComment />
                      </i>

                      <b className='commentCount'>{commentCount}</b>

                    </li>

                  </ul>

                  <ul>
                    <li>
                      <i onClick={addStoryToReadList}>

                        {storyReadListStatus ? <BsBookmarkFill color='#0205b1' /> :
                          <BsBookmarkPlus />
                        }
                      </i>
                    </li>


                    {activeUser &&
                      story.author._id === activeUser._id ?
                      <li className='BsThreeDots_opt'>
                        <i  >
                          <BsThreeDots />
                        </i>
                        <div className="delete_or_edit_story  ">
                          <Link className='editStoryLink' to={`/story/${story.slug}/edit`}>
                            <p>Edit Story</p>
                          </Link>
                          <div className='deleteStoryLink' onClick={handleShow}>
                            <p>Delete Story</p>
                          </div>
                        </div> </li> : null
                    }



                  </ul>

                </div>
              }

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this story?</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="danger" onClick={handleStoryDelete}>
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </>
      }
    </>
  )
}

export default DetailStory;
