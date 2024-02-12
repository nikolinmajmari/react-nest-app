import {motion} from "framer-motion";
import React from "react";

export default function MotionFadeIn(props:any){
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {props.children}
    </motion.div>
  );
}
