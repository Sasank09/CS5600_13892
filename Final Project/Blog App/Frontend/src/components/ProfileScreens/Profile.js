import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import "../../Css/Profile.css"
import { Link, useNavigate } from 'react-router-dom';
import Loader from "../GeneralScreens/Loader";
import { AuthContext } from '../../Context/AuthContext';
import CardStory from "../StoryScreens/CardStory";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const Profile = () => {
    const { config, activeUser } = useContext(AuthContext)
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false)
    const [stories, setStories] = useState([])
    const [blockedUsers, setBlockedUsers] = useState([])

    const createdDate = (createdAt) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const d = new Date(createdAt);
        var datestring = d.getDate() + " " + monthNames[d.getMonth()] + " , " + d.getFullYear()
        return datestring
    }

    const navigate = useNavigate()

    useEffect(() => {

        const getUserProfile = async () => {

            setLoading(true)

            try {
                const { data } = await axios.get("/user/profile", config)

                setUser(data.data)

                setLoading(false)
            }
            catch (error) {
                navigate('/')
            }
        }
        getUserProfile()
    }, [setLoading])

    useEffect(() => {
        const getStories = async () => {
            try {
                setLoading(true)
                const { data } = await axios.get(`/story/getMyStories?author=${activeUser._id}`)
                setLoading(false)
                setStories(data.data)
            }
            catch (error) {

            }
        }

        const getBlockedUsers = async () => {
            setLoading(true)
            const { data } = await axios.get(`/user/getBlockedUsers?user_id=${activeUser._id}`, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("authToken")}`,
                }
            })
            setBlockedUsers(data.data)
            setLoading(false)
        }
        getStories()
        getBlockedUsers()
    }, [setLoading])

    const handleUnblock = async (id) => {
        document.getElementById(id).textContent = "";
        setLoading(true)
        const { data } = axios.post(`/user/unblockUser?curr_userId=${activeUser._id}&blocked_userId=${id}`, {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
        })
        setLoading(false)
        setBlockedUsers(data.blockedUsersList)
       

    } 

    return (
        <>
            {
                loading ? <Loader /> :
                    <div className="Inclusive_profile_page">
                        <ul>

                            <li>
                                <span>
                                    Username
                                </span>
                                <div>
                                    {user.username}
                                </div>
                            </li>
                            <li>
                                <span>E-Mail</span>
                                <div>
                                    {user.email}
                                </div>

                            </li>
                            <li>

                                <span> Account Created Date </span>
                                <div>
                                    {createdDate(user.createdAt)}
                                </div>
                            </li>
                        </ul>
                        <div className='btns_wrap'>
                            <button className='profileEditBtn'>
                                <Link to="/edit_profile">
                                    Edit Profile
                                </Link>
                            </button>
                            <button className='changePassBtn'>
                                <Link to="/change_password">
                                    Change Password
                                </Link>
                            </button>
                        </div>

                        <div>
                            <ul>
                            <p>Blocked Users</p>
                                {blockedUsers.map((user, idx) => (
                                    <li key={idx} className="p-2 m-1" id={user._id}>{user.username} {' '}
                                        <Button variant="outline-danger" size="sm" onClick={() => handleUnblock(user._id)}>Unblock</Button>
                                    </li>
                                )) }
                            </ul>
                        </div>
                    </div>

            }

            <h3 className='text-center'>My Blogs</h3>
            <div className="story-card-wrapper">
                {stories.length !== 0 ?
                    stories.map((story) => {
                        return (
                            <CardStory key={uuidv4()} story={story} />
                        )
                    }) : "No Blogs Found"
                }
                <img className="bg-planet-svg" src="planet.svg" alt="planet" />
                <img className="bg-planet2-svg" src="planet2.svg" alt="planet" />
                <img className="bg-planet3-svg" src="planet3.svg" alt="planet" />

            </div>

        </>

    )
}

export default Profile;
