export interface INavigationHeaderProps{
    children:any,
    leading:React.ReactElement
}

export function NavigationHeader(props:any){
    return (
          <div className=" bg-teal-700 shadow-lg bg-opacity-30 sticky top-0 backdrop-blur-md flex flex-row items-center">
               <div className="h-20 flex flex-row items-center justify-between w-full">
                <div className="navigation flex flex-row justify-start items-center px-2">
                    {props.leading}
                </div>
                <div className="actions flex flex-row justify-start items-center px-4">
                    {props.children}
                </div>
               </div>
            </div>
    );
}
