import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";

export default function Header() {
  const { isLoggedIn } = useContext(AuthContext);
  const [logoutModel, setLogoutModel] = useState(false);

  return (
    <>
      <div className=" bg-white fixed top-0 left-0 right-0 z-[500]">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <h1 className="text-xl md:text-3xl font-bold text-gray-600 ">Sundaram Enterprise</h1>
            <nav>
              <ul className="flex ">
                <Link to="/signin" className={isLoggedIn ? "hidden" : "block"}>
                  <li className="py-3 px-6 text-sm lg:text-xl font-semibold text-gray-600">
                    Sign In
                  </li>
                </Link>
                <Link to="/signup" className={isLoggedIn ? "hidden" : "block"}>
                  <li className="py-3 px-6 text-sm lg:text-xl font-semibold text-gray-600">
                    Sign Up
                  </li>
                </Link>
                <Link to="/" className={isLoggedIn ? "block" : "hidden"}>
                  <li className="py-2 px-3 text-sm lg:text-xl font-semibold text-gray-600">Home</li>
                </Link>
                <Link to="/profile" className={isLoggedIn ? "block" : "hidden"}>
                  <li className="py-2 px-3 text-sm lg:text-xl font-semibold text-gray-600">
                    Profile
                  </li>
                </Link>
                <Link to="/createPost" className={isLoggedIn ? "block" : "hidden"}>
                  <li className="py-2 px-3 text-sm lg:text-xl font-semibold text-gray-600">
                    Create Event
                  </li>
                </Link>
                <Link
                  onClick={() => setLogoutModel(true)}
                  className={isLoggedIn ? "block" : "hidden"}
                >
                  <li className="py-2 px-3 text-sm lg:text-xl font-semibold text-gray-600">
                    LogOut
                  </li>
                </Link>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      {logoutModel && (
        <div className=" fixed w-screen h-screen top-0 left-0 bottom-0 bg-[rgba(27,28,24,0.34)] z-[1000">
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
