import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../AuthContextProvider";
import secureLocalStorage from "react-secure-storage";

export default function Page() {
  const Login = () => {
    const [isChecked, setChecked] = useState(true);
    const { setUser, setIsLogged } = useAuth();
    const [isLoginFailed, setLoginFailed] = useState(false);
    const [isVerified, setVerifiedStatus] = useState(true);
    const [isLoginGoogleFailed, setLoginGoogleFailed] = useState(false);
    let features = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=no,height=600,width=400";
    const googleAuth = () => {
      const popup = window.open("http://localhost:5000/auth/google", "_blank", features);
      window.addEventListener("message", (event) => {
        if (event.data === "Exit") {
          popup.close();
          window.location.href = "http://localhost:3000/";
        }
        if (event.data === "Failed") {
          popup.close();
          setLoginGoogleFailed(true);
        }
      });
    };
    const facebookAuth = () => {
      const popup = window.open("http://localhost:5000/auth/facebook", "_blank", features);
      popup.postMessage("message", "http://localhost:3000/login");
      window.addEventListener("message", (event) => {
        if (event.data === "Exit") {
          popup.close();
          navigate("/home", { replace: true });
        }
        if (event.data === "Failed") {
          popup.close();
          setLoginGoogleFailed(true);
        }
      });
    };
    const SendMessage = () => {
      window.opener.postMessage("Exit", "http://localhost:3000/login");
    };
    useEffect(() => {
      const closePopUp = () => {
        if (!window.opener) {
          window.close();
        } else {
          SendMessage();
        }
      };
      closePopUp();
    }, []);
    const [email, setEmail] = useState("");
    const [password, setPassWord] = useState("");
    const navigate = useNavigate();
    const handleCheckboxChange = () => {
      setChecked(!isChecked);
    };
    const submit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post("http://localhost:5000/auth/signin", {
          email,
          password,
        });
        console.log(response.data);
        if (response.status === 200) {
          const { userData } = await response.data;
          setUser(userData);
          setIsLogged(true);
          secureLocalStorage.setItem("user", JSON.stringify(userData));
          navigate("/", { replace: true });
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message === "User is not verified") {
          setVerifiedStatus(false);
        } else {
          setLoginFailed(true);
        }
        console.log(err);
      }
    };
    return (
      <div className="flex flex-col w-full items-center pt-20 font-bold text-2xl mb-28">
        {isLoginGoogleFailed === true ? (
          <div className="px-5 py-2 mb-5 bg-red-300">
            <p className="text-base">Registered email must match Gmail. Try again!</p>
          </div>
        ) : (
          ""
        )}
        {isLoginFailed === true ? (
          <div className="px-5 py-2 mb-5 bg-red-300">
            <p className="text-base">Your email or password is incorrect. Try again!</p>
          </div>
        ) : (
          ""
        )}
        {isVerified === false ? (
          <div className="px-5 py-2 mb-5 bg-red-300">
            <p className="text-base">Your email isn&apos;t verified. Please check mailbox!</p>
          </div>
        ) : (
          ""
        )}
        <p>Login to Your Udemy Account</p>
        <form className="flex flex-col w-full items-center" onSubmit={submit}>
          <div className="relative z-0 w-96 mb-2 group">
            <input
              type="email"
              name="floating_email"
              id="floating_email"
              className="block py-4 px-2 w-full text-sm font-normal text-gray-900 bg-transparent border border-gray-600 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <label
              htmlFor="floating_email"
              className="peer-focus:font-bold absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 pl-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Email address
            </label>
          </div>
          <div className="relative z-0 w-96 mb-2 group">
            <input
              type="password"
              name="floating_password"
              id="floating_password"
              className="block py-4 px-2 w-full text-sm font-normal text-gray-900 bg-transparent border border-gray-600 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              onChange={(e) => {
                setPassWord(e.target.value);
              }}
            />
            <label
              htmlFor="floating_password"
              className="peer-focus:font-bold absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 pl-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Password
            </label>
          </div>
          <div className="flex flex-row justify-between w-96">
            <label className="flex flex-row items-center">
              <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} className="w-4 h-4" />
              <span className="checkmark"></span>
            </label>
            <div className="text-base font-normal hover:cursor-pointer hover:text-purple-700">Forgot password?</div>
          </div>
          <button type="submit" className="w-96 bg-purple-700 text-white py-2 text-xl mt-6 hover:bg-purple-800">
            Sign On
          </button>
        </form>
      </div>
    );
  };
}
