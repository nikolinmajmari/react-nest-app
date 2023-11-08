import { IUser } from "@mdm/mdm-core";
import {FaSearch} from "react-icons/fa";
import {AiOutlineSearch} from "react-icons/ai";

export interface ISearchComponentProps extends React.InputHTMLAttributes<HTMLInputElement>{
    label: string;
}
export function SearchComponent(props:React.InputHTMLAttributes<HTMLInputElement>){
    const { className,...rest} = props;
    return (
        <div className="relative">
                <AiOutlineSearch size={35} className={'absolute my-3 inset-y-0 left-0 flex items-center pl-3 pointer-events-none ' +
                  ' text-gray-400 font-bold'
                  }/>
                <input  className={
                    `focus:outline-none block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500
                     dark:bg-gray-700 dark:border-gray-500 dark:text-white
                      ${className??''}`
                }
                {...rest}
                />
        </div>
    )
}




interface ISearchedUserProps{
    user:IUser,
    selected:boolean,
    onPress:()=>void
}
export function SearchedUserItem(props:ISearchedUserProps){
    const {user} = props;
    return (
        <div onClick={props.onPress} className={`rounded-lg flex flex-row cursor-pointer px-3 py-1 mx-3 my-1
        ${props.selected ?
          'bg-blue-50 dark:bg-slate-600 shadow-lg'
          :
          'bg-slate-50 dark:bg-gray-600 dark:bg-opacity-40'}
          text-gray-700 dark:text-white
        `}>
            <div className={`"avatar flex items-center justify-center font-bold
            ${props.selected?'bg-slate-700 dark:bg-slate-500 text-white':'bg-gray-700 bg-opacity-40 dark:bg-gray-500'}
            w-10 h-10 mr-4 rounded-full text-white
            "`}>
                <span>
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                </span>
            </div>
            <div className="content flex flex-1 flex-start flex-col">
                <span className="name text-sm font-medium pb-1">
                    {user.firstName} {user.lastName}
                </span>
                <span className="text-xs">
                    {user.email}
                </span>
            </div>
        </div>
    );
}
