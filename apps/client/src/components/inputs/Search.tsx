import { IUser } from "@mdm/mdm-core";

export interface ISearchComponentProps extends React.InputHTMLAttributes<HTMLInputElement>{
    label: string;
}
export function SearchComponent(props:React.InputHTMLAttributes<HTMLInputElement>){
    const { className,...rest} = props;
    return (
        <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                </div>
                <input  className={
                    `focus:outline-none block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 ${className??''}`
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
        <div onClick={props.onPress} className={`rounded-lg flex flex-row cursor-pointer px-3 py-2 mx-4 my-1 ${props.selected ? 'shadow-lg bg-blue-50':'bg-slate-50'} text-gray-700`}>
            <div className={`"avatar flex items-center justify-center font-bold ${props.selected?'bg-slate-700 text-white':'bg-gray-100'} w-12 h-12 mr-4 rounded-full text-white"`}>
                <span>
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                </span>
            </div>
            <div className="content flex flex-1 flex-start flex-col">
                <span className="name text-md font-medium pb-2">
                    {user.firstName} {user.lastName}
                </span>
                <span className="text-xs">
                    {user.email}
                </span>
            </div>
        </div>
    );
}
