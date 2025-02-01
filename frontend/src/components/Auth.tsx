import { Link } from "react-router-dom"
import { LabelledInput} from "./LabelledInput"
import { useState } from "react"
import { signupType } from "@abhie.npm/blogbuddy-common"

export const Auth = ({type} : {type: "Signup | Signin"}) => {
    const [postInputs, setPostInputs] = useState<signupType>({
        name : "",
        email: "",
        password:""
    })
    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div className="border p-12">
                   <div className="px-10">
                        <div className="text-3xl font-bold">
                            Create An Account
                        </div>
                        <div className="pl-4 text-slate-500">
                            Already have an account ?
                            <Link to={'/signin'} className="underline ">Login</Link>
                    </div>
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
                </div>
            </div>
        </div>
    )
}