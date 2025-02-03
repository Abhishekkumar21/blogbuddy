import { Link } from "react-router-dom"

interface authHeaderType {
    type: "Signup" | "Signin"
}
export const AuthHeader = ({type} :authHeaderType)  => {
    return(
        <>
        <div className="text-3xl font-bold">
              {type === "Signup" ? " Create An Account" : "Sign in to account" }             
        </div>
        <div className="pl-4 text-slate-500">
              {type === "Signup" ? "Already have an account? " : "Don't have an account? "}              
              {type === "Signup"? <Link to={'/signin'} className="underline ">Sign in</Link>
                        : <Link to={'/signup'} className="underline ">Sign up</Link> }
        </div>
        </>
    )
}