import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";

export default function Header() {
  const { isLoggedIn } = useContext(AuthContext);
  const [logoutModel, setLogoutModel] = useState(false);

  return (
    <>
      <div className=" bg-white fixed top-0 left-0 right-0">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-3xl font-bold text-gray-600 ">Sundaram Enterprise</h1>
            <div className={`${isLoggedIn ? "block" : "hidden"} w-1/3 my-3`}>
              <form method="GET" action="">
                <div className="bg-white border-2  shadow p-2 relative rounded-xl flex">
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
                    id="title"
                    className="border-white outline-none border-0 w-full rounded-xl p-2"
                    type="text"
                    placeholder="Search Events"
                  />
                  <button
                    type="submit"
                    className="bg-black hover:bg-gray-700 rounded-xl text-white text-xl p-2 pl-4 pr-4 ml-2"
                  >
                    <p className="font-semibold text-xs">Search</p>
                  </button>
                </div>
              </form>
            </div>
            <nav>
              <ul className="flex">
                <Link to="/signin" className={isLoggedIn ? "hidden" : "block"}>
                  <li className="py-3 px-6 text-xl font-semibold text-gray-600">SignIn</li>
                </Link>
                <Link to="/signup" className={isLoggedIn ? "hidden" : "block"}>
                  <li className="py-3 px-6 text-xl font-semibold text-gray-600">Sign Up</li>
                </Link>
                <Link to="/" className={isLoggedIn ? "block" : "hidden"}>
                  <li className="py-2 px-3 text-xl font-semibold text-gray-600">Home</li>
                </Link>
                <Link to="/profile" className={isLoggedIn ? "block" : "hidden"}>
                  <li className="py-2 px-3 text-xl font-semibold text-gray-600">Profile</li>
                </Link>
                <Link to="/createPost" className={isLoggedIn ? "block" : "hidden"}>
                  <li className="py-2 px-3 text-xl font-semibold text-gray-600">Create Event</li>
                </Link>
                <Link
                  onClick={() => setLogoutModel(true)}
                  className={isLoggedIn ? "block" : "hidden"}
                >
                  <li className="py-2 px-3 text-xl font-semibold text-gray-600">LogOut</li>
                </Link>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      {logoutModel && (
        <div className=" fixed w-screen h-screen top-0 left-0 bottom-0 bg-[rgba(27,28,24,0.34)]">
          <div className="flex justify-center items-center h-full">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-10 text-center">
                Are you sure you want to log out?
              </h2>
              <div className="flex justify-evenly">
                <Link
                  to={"/logout"}
                  onClick={() => {
                    setLogoutModel(false);
                  }}
                  className="ml-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-400"
                >
                  Log Out
                </Link>
                <button
                  onClick={() => {
                    setLogoutModel(false);
                  }}
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
