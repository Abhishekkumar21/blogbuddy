import { Quote } from "../components/Quote"
import { Signin } from "../components/Signin"


export const SigninPage = () => {
    return(
       <div className="grid grid-cols-1 lg:grid-cols-2">
         <div>
          <Signin />
         </div>
            <div className="hidden lg:block">
                <Quote/>
            </div>
       </div>
    )
}