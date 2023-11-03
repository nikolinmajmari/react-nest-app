import { animated } from "@react-spring/web";
import { useSpringOpacity } from "../app/hooks/springs";
import React from "react";

const AnimatedOpacity = React.forwardRef<HTMLElement,React.HTMLProps<HTMLElement>>(
  function (props:any,ref){
    const springs = useSpringOpacity();
    const {styles,className,children,...rest} = props;
    return (
      <animated.div
        {...rest}
        ref={ref}
        style={{...styles,...springs}}
        className={`transition-opacity opacity-100 ${className}`}
      >
        {children}
      </animated.div>
    );
  }
);

export default AnimatedOpacity;
