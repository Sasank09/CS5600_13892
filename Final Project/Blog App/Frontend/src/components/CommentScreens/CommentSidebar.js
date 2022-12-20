import React, { useState, useEffect, useRef } from 'react';
import StoryComments from './StoryComments';
import axios from 'axios';
import AddComment from './AddComment';

const CommentSidebar = ({ slug, sidebarShowStatus, setSidebarShowStatus, activeUser }) => {

  const [count, setCount] = useState(0)
  const [commentlist, setCommentList] = useState([])
  const [storyAuthor, setStoryAuthor] = useState([])
  const [isUserBlockedInComment, setUserBlockStatusOnComments] = useState(false)

  const sidebarRef = useRef(null);

  useEffect(() => {
    getStoryComments()
  }, [setCommentList])


  const getStoryComments = async () => {
    try {
      const { data } = await axios.get(`/comment/${slug}/getAllComment`)
      setCommentList(data.data)
      setCount(data.count)
      setStoryAuthor(data.storyAuthor)
    }
    catch (error) {
      console.log(error.response.data.error);
    }
  }

  useEffect(() => {
    const checkIfClickedOutside = e => {
      getStoryComments()
      if (sidebarShowStatus && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarShowStatus(false)
      }
    }
    document.addEventListener("mousedown", checkIfClickedOutside)
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [sidebarShowStatus])


  const isUserBlocked = async() => {
    const { data } = await axios.post(`/comment/${slug}/isUserBlockedToComment`,{activeUser})
    setUserBlockStatusOnComments(data.isUserBlocked)
  }
  isUserBlocked()


  return (

    <div ref={sidebarRef} className={sidebarShowStatus ? "Inclusive-comment-sidebar visible" : "Inclusive-comment-sidebar hidden "}  >

      <div className='sidebar-wrapper'>

        { !isUserBlockedInComment ? <AddComment setSidebarShowStatus={setSidebarShowStatus} slug={slug} getStoryComments={getStoryComments} activeUser={activeUser} count={count}/> : <div className="alert-error-message fs-6">You are blocked by story owner to add comments</div> }

        <StoryComments commentlist={commentlist} activeUser={activeUser} count={count} storyAuthor={storyAuthor}  />
      </div>

    </div>

  )
}

export default CommentSidebar;
