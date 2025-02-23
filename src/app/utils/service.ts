import { useEffect } from "react"

export const generateQueryParams = (args: any) => {
    let str = ''
    let replace = ''
    for (const key in args) {
      if (typeof (args[key]) === 'object') {
        for (const key1 in args[key]) {
          str += `&filters[${key1}]=${args[key][key1]}`
          replace = str.slice(1)
        }
      } else {
        str += `&${key}=${args[key]}`
        replace = str.slice(1)
      }
    }
    return replace
  }

  export const useAutoLogout = (logoutFunction:any, timeout = 10 * 60 * 1000) => {
    useEffect(() => {
      let logoutTimer:any;
  
      const resetTimer = () => {
        if (logoutTimer) clearTimeout(logoutTimer);
        logoutTimer = setTimeout(() => {
          logoutFunction(); // Auto logout function call
        }, timeout);
      };
  
      // Activity event listeners
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("click", resetTimer);
      window.addEventListener("scroll", resetTimer);
  
      resetTimer(); // Start timer initially
  
      return () => {
        clearTimeout(logoutTimer);
        window.removeEventListener("mousemove", resetTimer);
        window.removeEventListener("keydown", resetTimer);
        window.removeEventListener("click", resetTimer);
        window.removeEventListener("scroll", resetTimer);
      };
    }, [logoutFunction, timeout]);
  };