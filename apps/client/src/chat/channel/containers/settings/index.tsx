import { Outlet } from "react-router-dom";
import AnimatedOpacity from "../../../../components/AnimatedOpacity";

export default function SettingsNavigator(){
    return (
    <AnimatedOpacity className='flex z-10 w-full h-full bg-white absolute flex-col flex-1 overflow-y-auto transition-opacity opacity-100'>
        <Outlet/>
    </AnimatedOpacity>);
}

