import ThemeContext from "./theme.context";
import React from "react";


export default function ThemeProvider(props:any){
  const defaultTheme = localStorage.getItem('app.locale.theme')??"light";
  const [theme,setTheme] = React.useState<string>(defaultTheme);
  const toggleTheme = ()=>{
    if(theme==='light'){
      setTheme('dark');
    }else{
      setTheme('light');
    }
  }

  React.useEffect(()=>{
    if(theme==='light'){
      document.body.classList.remove('dark');
    }else{
      document.body.classList.add('dark');
    }
  },[theme]);

  return (
    <ThemeContext.Provider value={{theme:theme, toggleTheme}}>
      {props.children}
    </ThemeContext.Provider>
  );
}
