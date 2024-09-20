import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import { AuthContext } from "../context/AuthProvider";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function Home() {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [myPost, setMyPost] = useState({});
  const [comment, setComment] = useState("");
  const [viewMyPost, setViewMyPost] = useState(false);
  const [newCommentAdd, setNewCommentAdd] = useState(false);
  const [delComment, setDelComment] = useState(false);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  const [filteredPosts, setFilteredPosts] = useState([]); // Filtered events
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("");

  const [searchActive, setSearchActive] = useState(false);

  const { isLoggedIn, myPostId, setMyPostId } = useContext(AuthContext);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  //Clear filter
  const clearFilters = () => {
    setLocationFilter("");
    setDateFilter(""); // Assuming dateFilter is initially null
    setEventTypeFilter("");
    setSearchActive(false);
    setFilteredPosts(posts); // Reset to show all posts
  };

  // Filter posts based on the criteria
  const filterPosts = () => {
    let newFilteredPosts = [...posts];

    // Apply filters only if any filter is active
    if (locationFilter || dateFilter || eventTypeFilter) {
      newFilteredPosts = newFilteredPosts.filter((post) => {
        const matchLocation = locationFilter
          ? post.location.toLowerCase().includes(locationFilter.toLowerCase())
          : true;

        const matchDate = dateFilter
          ? new Date(post.eventStartDate) <= new Date(dateFilter) &&
            new Date(post.eventEndDate) >= new Date(dateFilter)
          : true;

        const matchEventType = eventTypeFilter
          ? post.eventType.toLowerCase().includes(eventTypeFilter.toLowerCase())
          : true;

        return matchLocation && matchDate && matchEventType;
      });
      setSearchActive(true); // Filters are applied
    } else {
      newFilteredPosts = [...posts]; // Reset to all posts when no filters are active
      setSearchActive(false); // No filters applied
    }

    // Categorize events
    const now = new Date();
    setUpcomingEvents(newFilteredPosts.filter((post) => new Date(post.eventStartDate) > now));
    setCurrentEvents(
      newFilteredPosts.filter(
        (post) => new Date(post.eventStartDate).toDateString() === now.toDateString()
      )
    );
    setPastEvents(newFilteredPosts.filter((post) => new Date(post.eventEndDate) < now));

    setFilteredPosts(newFilteredPosts);
  };

  // Call filterPosts whenever filter criteria changes
  useEffect(() => {
    filterPosts();
  }, [locationFilter, dateFilter, eventTypeFilter, posts]);

  useEffect(() => {
    const token = localStorage.getItem("token") || cookies.get("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    // Fetch posts when component mounts
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/post/getPosts`, {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        // Inside fetchPosts function
        const allPosts = response.data.reverse(); // Make sure you are getting the correct response

        // Update categorization
        const now = new Date();
        const upcoming = [];
        const current = [];
        const past = [];

        allPosts.forEach((post) => {
          const eventStartDate = new Date(post.eventStartDate);
          const eventEndDate = new Date(post.eventEndDate);

          if (eventStartDate <= now && eventEndDate > now) {
            // Currently running event
            current.push(post);
          } else if (eventStartDate > now) {
            // Upcoming event
            upcoming.push(post);
          } else if (eventEndDate < now) {
            // Past event
            past.push(post);
          }
        });

        // Set states
        setPosts(allPosts);
        setUpcomingEvents(upcoming);
        setCurrentEvents(current);
        setPastEvents(past);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getUser`, {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setUser(response.data.user);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };

    fetchUser();
    fetchPosts();
  }, [newCommentAdd, navigate, isLoggedIn, viewMyPost, BASE_URL]);

  // get my post
  useEffect(() => {
    if (!myPostId) {
      return;
    }
    const fetchMyPosts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/post/getMyPosts/${myPostId}`, {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setMyPost(response.data);
        setViewMyPost(true);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };

    fetchMyPosts();
  }, [myPostId, viewMyPost, newCommentAdd, delComment, BASE_URL]);

  // add comments
  const addComment = async (post) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/post/addComment/${post._id}`,
        { comment },
        {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setComment("");
      setNewCommentAdd(true);
      toast.success(response.data.message);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const deleteComment = async (commentId, postId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/post/deleteComment`, {
        params: {
          commentId,
          postId,
        },
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      toast.success(response.data.message);
      setDelComment(true);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="pt-20 lg:pt-32">
          {/* Event search bar */}
          <div className="p-4 flex flex-wrap justify-between items-center">
            <div className="bg-white border-2 text-sm lg:text-base  shadow lg:p-2 rounded-xl flex w-full lg:w-[30%] mb-2 lg:mb-0">
              <span className="w-auto flex justify-end  items-center text-gray-500 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </span>
              <input
                name="episodequery"
                id=""
                className="border-white outline-none border-0 w-full rounded-xl p-2"
                type="text"
                placeholder="Filter by location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>

            <div className="bg-white border-2 text-sm lg:text-base shadow lg:p-2  rounded-xl flex w-full lg:w-[30%] lg:mx-2 mb-2 lg:mb-0">
              <span className="w-auto flex justify-end  items-center text-gray-500 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </span>
              <input
                name="episodequery"
                id=""
                className="border-white outline-none border-0 w-full rounded-xl p-2"
                type="text"
                placeholder="Filter by event type"
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
              />
            </div>

            <div className="bg-white border-2 text-sm lg:text-base shadow lg:p-2  rounded-xl flex w-full lg:w-[30%] lg:me-2 mb-2 lg:mb-0">
              <input
                type="datetime-local"
                placeholder="Filter by date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border-white outline-none border-0 w-full rounded-xl p-2"
              />
            </div>

            <button
              onClick={clearFilters}
              className="bg-red-500 text-white border-none text-sm lg:text-base py-1 lg:py-4 px-4 cursor-pointer rounded-md hover:bg-red-600"
            >
              Clear Filters
            </button>
          </div>

          {/* Display filtered posts */}
          {searchActive ? (
            <>
              <h2 className="text-2xl font-bold mb-4 ps-1">Search Result</h2>
              <div className="rounded-sm flex flex-wrap">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => (
                    <BlogCard
                      post={post}
                      key={index}
                      user={user}
                      newCommentAdd={newCommentAdd}
                      setNewCommentAdd={setNewCommentAdd}
                      delComment={delComment}
                      setDelComment={setDelComment}
                    />
                  ))
                ) : (
                  <p>No posts match the filters</p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Upcoming Events */}
              <h2 className="text-2xl font-bold mb-4 ps-1">Upcoming Events</h2>
              <div className="rounded-sm flex flex-wrap border-b-2 pb-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((post, index) => (
                    <BlogCard
                      post={post}
                      user={user}
                      key={index}
                      newCommentAdd={newCommentAdd}
                      setNewCommentAdd={setNewCommentAdd}
                      delComment={delComment}
                      setDelComment={setDelComment}
                    />
                  ))
                ) : (
                  <p>No upcoming events available</p>
                )}
              </div>

              {/* Current Events */}
              <h2 className="text-2xl font-bold mb-4 mt-8 ps-1 ">Current Events</h2>
              <div className="rounded-sm flex flex-wrap border-b-2 pb-4">
                {currentEvents.length > 0 ? (
                  currentEvents.map((post, index) => (
                    <BlogCard
                      post={post}
                      user={user}
                      key={index}
                      newCommentAdd={newCommentAdd}
                      setNewCommentAdd={setNewCommentAdd}
                      delComment={delComment}
                      setDelComment={setDelComment}
                    />
                  ))
                ) : (
                  <p>No current events available</p>
                )}
              </div>

              {/* Past Events */}
              <h2 className="text-2xl font-bold mb-4 mt-8 ps-1 ">Past Events</h2>
              <div className="rounded-sm flex flex-wrap border-b-2 pb-4">
                {pastEvents.length > 0 ? (
                  pastEvents.map((post, index) => (
                    <BlogCard
                      post={post}
                      user={user}
                      key={index}
                      newCommentAdd={newCommentAdd}
                      setNewCommentAdd={setNewCommentAdd}
                      delComment={delComment}
                      setDelComment={setDelComment}
                    />
                  ))
                ) : (
                  <p>No past events available</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {viewMyPost && (
        <div className="fixed w-screen h-screen top-0 left-0 bg-[rgba(27,28,24,0.34)]">
          <div className="w-[80%] xl:w-[60%] h-[70%] mt-[8%] mx-auto bg-white flex">
            <div className="w-full">
              <img className="w-full h-full aspect-auto" src={myPost.image} alt="" />
            </div>
            <div className="flex flex-col w-full">
              {/* Card header */}
              <div className="flex justify-start items-center p-2 border-b-2 h-[12%]">
                <img className="w-[40px] rounded-full me-5" src={myPost.user.image} alt="" />
                <span className="font-semibold">@{myPost.user.username}</span>
              </div>

              {/* Comment section */}
              <div className="h-[76%] overflow-y-scroll">
                {myPost.comments.length > 0 ? (
                  myPost.comments.map((comment, index) => (
                    <div className="p-2 flex items-center justify-between" key={index}>
                      <p>
                        <span className="font-bold me-2">@{comment.user.username}:</span>
                        {comment.comment}
                      </p>
                      {comment.user._id === user._id && (
                        <div
                          className="cursor-pointer"
                          onClick={() => deleteComment(comment._id, myPost._id)}
                        >
                          <span className="material-symbols-outlined text-red-800 text-lg font-bold">
                            close
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="h-full w-full flex justify-center items-center">
                    <p>No Comments Yet</p>
                  </div>
                )}
              </div>

              {/* Comment form */}
              <div className="flex items-center h-[12%] border-t-2 p-2">
                <span className="material-symbols-outlined">mood</span>
                <input
                  className="outline-none border border-gray-200 p-1 text-sm rounded-lg w-full mx-2"
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add Comments..."
                />
                <button
                  onClick={() => addComment(myPost)}
                  className="px-1 pb-2 text-lg text-blue-800 font-semibold"
                >
                  Post
                </button>
              </div>
            </div>
          </div>

          {/* Close comment section */}
          <div
            className="fixed top-5 right-5 cursor-pointer"
            onClick={() => {
              setViewMyPost(false);
              setMyPostId("");
            }}
          >
            <span className="material-symbols-outlined text-white text-4xl font-bold">close</span>
          </div>
        </div>
      )}
    </div>
  );
}
