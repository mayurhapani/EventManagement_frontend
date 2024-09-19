import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import img1 from "../assets/images/default-featured-image.jpg";
import { AuthContext } from "../context/AuthProvider";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function CreatePost() {
  const [image, setImage] = useState(null);
  const [disc, setDisc] = useState("");
  const [title, setTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("");
  const [attendees, setAttendees] = useState("");
  const [user, setUser] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // console.log(user);
  useEffect(() => {
    const token = localStorage.getItem("token") || cookies.get("token");

    if (!token) {
      navigate("/signin");
      return;
    }

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
  }, [isLoggedIn, navigate]);

  // console.log(image, disc);

  const shareData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (
        !image ||
        !disc ||
        !title ||
        !eventStartDate ||
        !eventEndDate ||
        !location ||
        !attendees
      ) {
        toast.error("All fields are required");
        navigate("/createPost");
        return;
      }

      // image upload
      const dataImage = new FormData();
      dataImage.append("file", image);
      dataImage.append("upload_preset", "instaClone");
      dataImage.append("cloud_name", "mayurcloud21");
      dataImage.append("folder", "eventManagement");

      const responseImage = await axios.post(
        "https://api.cloudinary.com/v1_1/mayurcloud21/upload",
        dataImage
      );
      const uploadedImagePath = responseImage.data.url;

      // data send to backend
      const response = await axios.post(
        `${BASE_URL}/post/createPost`,
        {
          disc,
          image: uploadedImagePath,
          title,
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

      console.log(response);
      if (response) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
        navigate("/createPost");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const loadFile = (event) => {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src);
    };
    setImage(event.target.files[0]);
  };

  return (
    <div className="container mx-auto ">
      <div className="pt-32 flex flex-col items-center">
        <div className="max-w-[40rem] border border-[rgb(173, 173, 173)] rounded-sm">
          {/* header */}
          <div className="flex items-center p-1 border-b">
            <img className="w-7 rounded-full" src={user.image} alt="" />
            <span className="ms-3 text-sm font-bold">{user.username}</span>
          </div>
          <div className="flex p-2 border-b border-[rgb(173, 173, 173)]">
            <h1 className="w-full text-center font-bold">Create New Event</h1>
            <button
              onClick={() => {
                shareData();
              }}
              className="font-bold text-blue-600 text-sm"
            >
              Create
            </button>
          </div>

          {/* image upload */}
          <div className="">
            <img
              className="w-full h-56"
              src={image ? URL.createObjectURL(image) : img1}
              alt=""
              id="output"
            />

            <div className="flex items-center justify-between bg-grey-lighter mb-3 w-full">
              <label className="w-full flex justify-evenly items-center p-4 bg-zinc-300 rounded-lg shadow-lg tracking-wide uppercase border border-zinc-300 cursor-pointer hover:bg-zinc-600 hover:text-white">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span className="mt-2 text-base leading-normal">Select a event image</span>
                <input
                  onChange={loadFile}
                  accept="image/*"
                  type="file"
                  name="image"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* content */}

          <input
            type="text"
            className="w-full p-2 outline-none border rounded-lg my-2"
            placeholder="Write a Title....."
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <textarea
            className="w-full p-2 outline-none border rounded-lg"
            placeholder="Write a description....."
            onChange={(e) => {
              setDisc(e.target.value);
            }}
            name=""
            id=""
          ></textarea>

          <div className="flex justify-between items-center">
            <div className=" my-2">
              <label className="text-sm text-bold ps-2">Start Date & Time</label>
              <input
                type="datetime-local"
                className="w-full p-2 outline-none border rounded-lg"
                onChange={(e) => {
                  setEventStartDate(e.target.value); // This will capture both the date and time selected by the user
                }}
              />
            </div>

            <div className="my-2">
              <label className="text-sm text-bold ps-2">End Date & Time</label>
              <input
                type="datetime-local"
                className="w-full p-2 outline-none border rounded-lg "
                onChange={(e) => {
                  setEventEndDate(e.target.value); // This will capture both the date and time selected by the user
                }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <select
              className="w-full p-2 outline-none border rounded-lg my-2"
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            >
              <option value="">Select event location</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Chicago">Chicago</option>
              <option value="Houston">Houston</option>
              <option value="Phoenix">Phoenix</option>
              <option value="Philadelphia">Philadelphia</option>
              <option value="San Antonio">San Antonio</option>
              <option value="San Diego">San Diego</option>
              <option value="Dallas">Dallas</option>
              <option value="San Jose">San Jose</option>
            </select>

            <select
              className="w-full p-2 outline-none border rounded-lg my-2"
              onChange={(e) => {
                setEventType(e.target.value);
              }}
            >
              <option value="">Select event type</option>
              <option value="Conference">Conference</option>
              <option value="Wedding">Wedding</option>
              <option value="Concert">Concert</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Meetup">Meetup</option>
              <option value="Festival">Festival</option>
              <option value="Party">Party</option>
            </select>

            <select
              className="w-full p-2 outline-none border rounded-lg my-2"
              onChange={(e) => {
                setAttendees(e.target.value);
              }}
            >
              <option value="">Enter max attendees</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="80">80</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
