import { Signup} from "../components/Signup"
import { Quote } from "../components/Quote"


 export const SignupPage = () => {
    return(
       <div className="grid grid-cols-1 lg:grid-cols-2">
         <div>
          <Signup/>
         </div>
            <div className="hidden lg:block">
                <Quote/>
            </div>
       </div>
    )
}