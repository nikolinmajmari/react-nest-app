import { animated } from "@react-spring/web";
import { useSpringOpacity } from "../app/hooks/springs";

export default function AnimatedOpacity(props:any){
    const springs = useSpringOpacity();
    const {styles,className,children,...rest} = props;
    return (
    <animated.main 
        {...rest} 
        style={{...styles,...springs}} 
        className={`transition-opacity opacity-100 ${className}`}
    >
         {children}
    </animated.main>
    );
}