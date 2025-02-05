import { ChangeEvent } from "react"

 interface labelledInputType {
    label : string,
    placeholder: string,
    onChange : (e: ChangeEvent<HTMLInputElement>) => void
    type? : string
 }

export const LabelledInput = ({label, placeholder, type, onChange}: labelledInputType) => {
    return(
        <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
        <input type= {type || "text"}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder={placeholder}
                onChange = {onChange}
                required />
    </div>
    )
}