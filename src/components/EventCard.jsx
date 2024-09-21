import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
  // console.log(event);
  const post = event.post;
  const user = event.post.user;

  const [isLiked, setIsLiked] = useState(post.likes.includes(user._id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [status, setStatus] = useState(event?.status);

  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const likePost = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/post/like/${post._id}`, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      // Toggle the like state
      if (isLiked) {
        setLikesCount(likesCount - 1);
      } else {
        setLikesCount(likesCount + 1);
      }
      setIsLiked(!isLiked);

      toast.success(response.data.message);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const OtherUserPage = (userId) => {
    navigate(`/otherUserProfile/${userId}`);
  };

  //update status for event
  const statusUpdate = async (status) => {
    try {
      const token = localStorage.getItem("token");

      if (!status) {
        toast.error("Invalid field");
        return;
      }

      // data send to backend
      const response = await axios.patch(
        `${BASE_URL}/post/statusUpdate`,
        {
          eventId: event._id,
          status,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="p-2 w-full mb-4">
      <div className="card border border-[rgb(173, 173, 173)] rounded-sm ">
        {/* card header */}
        <div className="flex justify-between items-center p-2 border-b border-[rgb(173, 173, 173)]">
          <div className="flex items-center space-x-4">
            <img className="w-[45px] h-[45px] rounded-full me-2" src={post.user.image} alt="" />
            <span
              onClick={() => {
                OtherUserPage(post.user._id);
              }}
              className="font-semibold text-sm cursor-pointer hover:text-blue-800 hover:font-bold hover:underline transition-colors"
            >
              Event organized by : @{post.user.username}
            </span>
          </div>
        </div>
        {/* date */}
        <div className="flex justify-between items-center px-2">
          <span className="text-xs text-gray-600">
            Start : {new Date(post.eventStartDate).toLocaleDateString()}{" "}
            {new Date(post.eventStartDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
          <br />
          <span className="text-xs text-gray-600">
            End : {new Date(post.eventEndDate).toLocaleDateString()}{" "}
            {new Date(post.eventEndDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>

        {/* card post image */}
        <div className="w-full aspect-h-2">
          <img className="object-cover w-full h-full" src={post.image} alt="" />
        </div>

        {/* card likes */}
        <div className="py-2 px-1 flex justify-between items-center border border-[rgb(173, 173, 173)]">
          <div className="">
            {isLiked ? (
              <span
                onClick={likePost}
                className="material-symbols-outlined material-symbols-outlined-red me-2 text-2xl cursor-pointer"
              >
                favorite
              </span>
            ) : (
              <span
                onClick={likePost}
                className="material-symbols-outlined me-2 text-2xl cursor-pointer"
              >
                favorite
              </span>
            )}
            <span className="material-symbols-outlined me-2 text-2xl cursor-pointer">maps_ugc</span>
            <span className="material-symbols-outlined text-2xl">send</span>
          </div>
          <span className="material-symbols-outlined text-2xl">bookmark</span>
        </div>

        <div className="my-2 px-2 flex justify-between items-center">
          <div>
            <span className="pe-2">{likesCount}</span>
            <span>likes</span>
          </div>
        </div>

        {/* title / description */}
        <div className="my-2 border-t border-[rgb(173, 173, 173)]">
          <div className="px-2 text-lg text-black ">
            <p>
              <span className="font-bold">Title : @</span>
              {post.title}
            </p>
          </div>
          <div className="px-2">
            <p>
              <span className="font-bold">Description : @</span>
              {post.disc}
            </p>
          </div>
        </div>

        {/* event details location*/}
        <div className="px-2 py-1 border-t border-[rgb(173, 173, 173)]">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="text-black ">
              <span className="font-bold ">Location :</span> {post.location}
            </span>
            <span className="text-black ">
              <span className="font-bold">Event Type :</span> {post.eventType}
            </span>
          </div>
        </div>

        {/* event details price*/}
        <div className="px-2 py-1 border-t border-[rgb(173, 173, 173)]">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="text-black ">
              <span className="font-bold">Max Attendees :</span> {post.attendees}
            </span>
            <span className="text-black ">
              <span className="font-bold">Ticket Price :</span> {post?.price}
            </span>
          </div>
        </div>

        {/* event details Your Name*/}
        <div className="px-2 py-1 border-t border-[rgb(173, 173, 173)]">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="text-black ">
              <span className="font-bold">Your Name :</span> {event?.name}
            </span>
            <span className="text-black ">
              <span className="font-bold">Your Email :</span> {event?.email}
            </span>
          </div>
        </div>

        {/* event details Your Name*/}
        <div className="px-2 py-1 border-t border-[rgb(173, 173, 173)]">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="text-black ">
              <span className="font-bold">Your Mobile Number :</span> {event?.mobile}
            </span>

            <div className="flex justify-end items-center w-2/3">
              <span className="font-bold text-black">Do You Join ? : </span>
              <select
                className="w-1/3 p-2 outline-none border rounded-lg my-2 me-3"
                value={status}
                onChange={(e) => {
                  statusUpdate(e.target.value);
                  setStatus(e.target.value);
                }}
              >
                <option value="">Select your response</option>
                <option value="yes">Yes, I will attend</option>
                <option value="no">No, I can&apos;t attend</option>
                <option value="maybe">Maybe</option>
              </select>
            </div>
          </div>
        </div>

        {/* event details amount*/}
        <div className="px-2 py-1 border-t border-[rgb(173, 173, 173)]">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="text-black ">
              <span className="font-bold">Ticket Price :</span> Rs. {post?.price}
            </span>
            <span className="text-black ">
              <span className="font-bold">Your Tickets ? :</span> {event?.ticketCount} No.
            </span>
            <span className="text-black ">
              <span className="font-bold">Total Amount :</span> Rs.{" "}
              {Number(post?.price) * event?.ticketCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    post: PropTypes.shape({
      user: PropTypes.shape({
        _id: PropTypes.string,
        image: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
      }).isRequired,
      eventStartDate: PropTypes.string.isRequired,
      eventEndDate: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      eventType: PropTypes.string.isRequired,
      attendees: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      disc: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
      likes: PropTypes.arrayOf(PropTypes.string).isRequired,
      comments: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    }).isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    mobile: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    ticketCount: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,

  owner: PropTypes.shape({
    _id: PropTypes.string,
  }),
};
