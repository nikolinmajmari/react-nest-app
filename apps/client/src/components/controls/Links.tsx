import {Link, LinkProps, useLocation} from "react-router-dom";
import {INavigationButtonProps} from "./Buttons";


export function RouterAwareLinkNavigationButton({children,onClick,className,...rest}:LinkProps & INavigationButtonProps){
  const location = useLocation();
  function getLinkClassIfActive(){
    if(typeof rest.to==='string'){
      if(location.pathname.startsWith(rest.to.toString())){
        return 'bg-emerald-700 bg-opacity-25'
      }
      return '';
    }
    throw Error('unhandled path name')
  }
  return (
    <Link {...rest} className={
      `p-4 text-teal-800 rounded-full font-bold text-2xl cursor-pointer hover:bg-teal-800 hover:bg-opacity-20 transition-colors
            dark:text-teal-600 dark:hover:bg-gray-700 dark:hover:bg-opacity-70  dark:bg-opacity-20
            ${getLinkClassIfActive()}
            ${className}
         `
    }>
      {children}
    </Link>
  )
}


export function TabLinkNavigation({children,onClick,className,active,...rest}:LinkProps & INavigationButtonProps){
    return (
        <Link {...rest} className={
            `inline-block p-4 border-b-2 rounded-t-lg
            ${className}
            ${active ?
                'text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
            :
                'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
            }
         `
        }>
            {children}
        </Link>
    )
}

export function LinkButton({children,onClick,className,...rest}:LinkProps & INavigationButtonProps){
  return (
    <Link {...rest} className={
      `
            ${className}
         `
    }>
      {children}
    </Link>
  )
}
