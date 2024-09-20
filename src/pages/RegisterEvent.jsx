import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function RegisterEvent() {
  const [post, setPost] = useState({});
  const [user, setUser] = useState([]);

  const [name, setName] = useState(0);
  const [email, setEmail] = useState(0);
  const [mobile, setMobile] = useState(0);
  const [status, setStatus] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);

  const navigate = useNavigate();
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token") || cookies.get("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    if (!id) {
      return;
    }

    const fetchMyPosts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/post/getMyPosts/${id}`, {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        setPost(response.data);

        //date formating
        // const startDate = new Date(response.data.eventStartDate);
        // const formattedStartDate = startDate.toISOString().slice(0, 16);

        // const endDate = new Date(response.data.eventEndDate);
        // const formattedEndDate = endDate.toISOString().slice(0, 16);
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

    fetchMyPosts();
    fetchUser();
  }, [navigate, BASE_URL, id]);

  //register for event
  const shareData = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log(disc, title, eventStartDate, eventEndDate, location, attendees);

      if (
        !disc ||
        !title ||
        !price ||
        !eventStartDate ||
        !eventEndDate ||
        !location ||
        !attendees
      ) {
        toast.error("All fields are required");
        navigate("/");
        return;
      }

      // data send to backend
      const response = await axios.patch(
        `${BASE_URL}/post/editPost`,
        {
          postId: id,
          disc,
          image: imageUrl,
          title,
          price,
          eventStartDate,
          eventEndDate,
          location,
          eventType,
          attendees,
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
        navigate("/");
      } else {
        toast.error(response.data.message);
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  // handle  ticket count
  const handleDecrement = () => {
    if (ticketCount > 0) {
      setTicketCount(ticketCount - 1);
    }
  };

  const handleIncrement = () => {
    if (ticketCount < 10) {
      setTicketCount(ticketCount + 1);
    }
  };

  return (
    <div className="bg-red-50">
      <div className="container mx-auto ">
        <div className="pt-20 lg:pt-32 pb-10 flex flex-col items-center">
          <div className="max-w-[40rem] px-1 border border-[rgb(173, 173, 173)] bg-white rounded-sm">
            {/* header */}
            <div className="flex justify-between items-center p-2 border-b border-[rgb(173, 173, 173)]">
              <h1 className=" font-bold">Register to event</h1>
              <button
                onClick={() => {
                  shareData();
                }}
                className="font-bold text-blue-600 text-sm"
              >
                Register
              </button>
            </div>

            {/* Event details */}
            <div className="flex justify-between items-center p-2 border-b border-[rgb(173, 173, 173)]">
              <h1 className=" font-bold">{post.title}</h1>

              {/* date */}
              <div className="flex justify-between items-center px-2">
                <span className="text-xs text-gray-600 me-3">
                  <span className="font-bold">Start : </span>
                  {new Date(post.eventStartDate).toLocaleDateString()}{" "}
                  {new Date(post.eventStartDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
                <br />
                <span className="text-xs text-gray-600">
                  <span className="font-bold">End :</span>{" "}
                  {new Date(post.eventEndDate).toLocaleDateString()}{" "}
                  {new Date(post.eventEndDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>

            {/* image  */}
            <div className="">
              <img className="w-full h-56" src={post.image} alt="" />
            </div>

            {/* content */}
            <input
              type="text"
              className="w-full p-2 outline-none border rounded-lg my-2"
              placeholder="Write a Title....."
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              type="text"
              className="w-full p-2 outline-none border rounded-lg my-2"
              placeholder="Write a Title....."
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="tel"
              className="w-full p-2 outline-none border rounded-lg my-2"
              placeholder="Write a Title....."
              onChange={(e) => {
                setMobile(e.target.value);
              }}
            />

            <div className="flex flex-col lg:flex-row justify-between items-center">
              <select
                className="w-full p-2 outline-none border rounded-lg my-2"
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              >
                <option value="">Select your response</option>
                <option value="yes">Yes, I will attend</option>
                <option value="no">No, I can&apos;t attend</option>
                <option value="maybe">Maybe</option>
              </select>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDecrement}
                  className="bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded-l focus:outline-none hover:bg-gray-400"
                >
                  -
                </button>
                <input
                  type="number"
                  value={ticketCount}
                  readOnly
                  className="w-16 text-center border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleIncrement}
                  className="bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded-r focus:outline-none hover:bg-gray-400"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
