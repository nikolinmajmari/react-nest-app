import { Link, LinkProps, NavLinkProps } from "react-router-dom";

export interface INavigationButtonProps{
    children?:any,
    onClick?:()=>void
}

export function NavigationButton({children,onClick}:INavigationButtonProps){
    return (
        <span onClick={onClick} className="p-4 text-teal-800 rounded-full font-bold text-2xl cursor-pointer hover:bg-teal-800 hover:bg-opacity-20 transition-colors
            dark:text-teal-600 dark:hover:bg-gray-700 dark:hover:bg-opacity-70 dark:bg-opacity-20
        ">
            {children}
        </span>
    )
}

export function LinkNavigationButton({children,onClick,...rest}:LinkProps & INavigationButtonProps){
    return (
         <Link {...rest} className="p-4 text-teal-800 rounded-full font-bold text-2xl cursor-pointer hover:bg-teal-800 hover:bg-opacity-20 transition-colors
            dark:text-teal-600 dark:hover:bg-gray-700 dark:hover:bg-opacity-70  dark:bg-opacity-20
         ">
                        {children}
        </Link>
    )
}
