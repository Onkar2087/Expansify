import React from "react";
import logo from "../assets/favicon.png";
import google from "../assets/google.png";
import github from "../assets/github.png"
import linkedin from "../assets/linkedin.png" 
import microsoft from "../assets/microsoft.png"
import  {IoEyeOutline} from "react-icons/io5";
import  {IoEye} from "react-icons/io5";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase.js";
import axios from "axios";

function logIn() {
    let [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [loading, setLoading] = useState(false);
        const dispatch = useDispatch();
    let navigate = useNavigate()

    const handleLogin = async ()=>{
      setLoading(true);
      try {
        const result = await axios.post(serverUrl + "/api/auth/login", {email, password}, {withCredentials:true});
        dispatch(setUserData(result.data));
        setLoading(false);
        navigate("/")
        toast.success("Login Sucessfully")
      } catch (error) {
        setLoading(false);
        toast.error(error.response.data.message);  
      }
    }

    const googleLogin = async ()=>{
      try {
        const response = await signInWithPopup(auth, provider)
        let user= response.user
        let name = user.displayName
        let email = user.email
        let role = ""
        const result = await axios.post(serverUrl + "/api/auth/googleauth", {name, email, role}, {withCredentials:true});
        dispatch(setUserData(result.data));
        navigate("/");
        toast.success("Login Successfully");
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
      }
    }
  return (
    <div className="bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center">
      <form
        action=""
        onSubmit={(e)=>e.preventDefault()}
        className="w-[90%] md:w-200 h-165 md:h-160  bg-[white] shadow-xl rounded-2xl flex"
      >
        <div className="md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-6">
            <img src={logo} className="w-[70px] md:hidden" alt="" />
          <div>
            <h1 className="font-semibold text-black text-2xl">
              Welcome Back
            </h1>
            <h2 className="text-[#999797] text-[18px]">Log in your account</h2>
          </div>
          <div className="flex flex-col gap-5 w-[100%] items-center justify-center px-3">
            <div className="flex flex-col gap-2 w-[80%] items-start justify-center px-3 cursor-pointer">
              <label htmlFor="email" className="font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="border-1 w-[100%] h-[35px] border-gray-400 text-[15px] rounded-lg px-[20px]"
                placeholder="Enter your email address"
              />
            </div>
            <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3 cursor-pointer ">
              <label htmlFor="password" className="font-semibold">
                Password
              </label>
              <div className="rounded-lg border-1 w-[100%] h-[35px] border-gray-400 text-[15px] flex  justify-between items-center relative">
                <input
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
                type={showPassword? "text":"password"}
                id="password"
                className="w-[100%] h-[35px] border-gray-400 text-[15px] px-[20px]"
                placeholder="Create your password"
              />
              {!showPassword? <IoEyeOutline className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]" onClick={()=>setShowPassword(prev=>!prev)}/>:
               <IoEye className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]" onClick={()=>setShowPassword(prev=>!prev)}/> }
              </div>
            </div>
            <button className="w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]" 
            onClick={handleLogin}
            disabled={loading}>
              {loading?<ClipLoader size={30} color="white"/>:"Log In"}
            </button>
            <span className="text-[16px] cursor-pointer text-[#585757] hover:underline" onClick={()=>navigate("/forget")}>Forgot Password</span>
            <div className="w-[80%] flex items-center gap-2">
              <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
              <div className="w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center">
                Or Continue
              </div>
              <div className="w-[20%] h-[0.5px] bg-[#c4c4c4]"></div>
            </div>
            <div className="flex w-[80%] justify-center gap-4 items-center">
              <div className="w-[20%] h-[40px] border-1 border-black rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-black hover:text-white"
              onClick={googleLogin}>
                <img src={google} className="w-[25px]" alt="" />
              </div>
              <div className="w-[20%] h-[40px] border-1 border-black rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-black hover:text-white">
                <img src={github} className="w-[25px]" alt="" />
              </div>
              <div className="w-[20%] h-[40px] border-1 border-black rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-black hover:text-white">
                <img src={linkedin} className=" rounded-lg w-[25px]" alt="" />
              </div>
              <div className="w-[20%] h-[40px] border-1 border-black rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-black hover:text-white">
                <img src={microsoft} className="rounded-lg w-[25px]" alt="" />
              </div>
            </div>
            <div onClick={()=>navigate("/signup")} className="cursor-pointer">
              <h3 className="text-[#6f6f6f]">Create a new account? <span className="underline underline-offset-1 text-black">Sign Up</span></h3>
            </div>
          </div>
        </div>
        <div className="w-[50%] h-[100%] rounded-r-2xl bg-black md:flex flex-col items-center justify-center hidden">
          <img src={logo} alt="" className="w-30 shadow-2xl" />
          <span className="text-2xl text-white ">Expansify</span>
          <h3 className="text-xl text-white">Expand. Your. Skills.</h3>
        </div>
      </form>
    </div>
  );
}

export default logIn;
