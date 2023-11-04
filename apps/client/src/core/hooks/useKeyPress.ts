import React, {KeyboardEventHandler} from "react";

export default function useKeyPress(){
  const [alt,setAlt] = React.useState<boolean>(false);
  const handleKeyUp:KeyboardEventHandler = function (e){
    switch (e.key){
      case "Alt":
        setAlt(false);
        break;
    }
  }
  const handleKeyDown:KeyboardEventHandler = function (e){
    switch (e.key){
      case "Alt":
        setAlt(true);
        break;
    }
  }
  return {
    alt,onKeyUp:handleKeyUp,onKeyDown:handleKeyDown
  }
}
