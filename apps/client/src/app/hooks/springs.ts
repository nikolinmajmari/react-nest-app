import { useSpring } from "@react-spring/web";

export function useSpringOpacity(){
     return useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config:{
            duration: 100
        }
     });
}
