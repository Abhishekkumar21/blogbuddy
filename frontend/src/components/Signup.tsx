import { useState } from "react"
import { AuthHeader } from "./AuthHeader"
import { LabelledInput } from "./LabelledInput"
import { signupType } from "@abhie.npm/blogbuddy-common"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_BASE_URL } from "../config/config"

export const Signup = () => {
    const [postInputs, setPostInputs] = useState<signupType>({
        name : "",
        email: "",
        password: ""
    })

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const sendSignUpDeatailsToServer = async () =>{
        setLoading(true);
        const payload = postInputs;
        try{
            const response = await axios.post(API_BASE_URL+'/api/v1/user/signup', payload)
            const token = response.data.jwtToken;
            localStorage.setItem("ACCESS_TOKEN", token)
            navigate("/blogs")                
        
        }catch(e){
            //Alert the user here that signup request failed
        } finally{
            setLoading(false);
        }
      
    }
  return (
          <div className="h-screen flex justify-center flex-col">
              <div className="flex justify-center">
                  <div className=" shadow-2xl p-12">
                     <div className="px-10">
                         <AuthHeader type={"Signup"} />
                     </div>
                      <div className="pt-8">
                      <LabelledInput label="Name"  placeholder="Enter your full name" onChange={(e) =>{
                                       setPostInputs({...postInputs, name: e.target.value, })}}
                      />
                      <LabelledInput label="Email"  placeholder="Enter your email" onChange={(e) =>{
                                       setPostInputs({...postInputs, email: e.target.value, })}}
                      />
                      <LabelledInput label="Password" type = {"password"} placeholder="Enter your password" onChange={(e) =>{
                                       setPostInputs({...postInputs, password: e.target.value, })}}
                      />
                      </div>
                      <button onClick={sendSignUpDeatailsToServer} 
                              type="button" 
                              className="text-white bg-gray-800 disabled:cursor-progress hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4 w-full"
                              disabled = {loading}
                        >
                            {loading ? "Signing up..." : "Sign up"}
                      </button>
                  </div>
              </div>
          </div>
      )
}