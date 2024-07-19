'use client';

import { useEffect, useState } from "react";
import ThemeContext from "@/context/themeContext";


/**
 * Deals with providing dark/light theme
 */
const ThemeProvider = ({ children }:{ children: React.ReactNode}) => {

    // If localstorage is defined and hotel-theme exists, we assign hotel-theme. Otherwise, false.
    const themeFromLocalStorage : boolean =
        typeof localStorage !== 'undefined' && localStorage.getItem('hotel-theme')
            ? JSON.parse(localStorage.getItem('hotel-theme')!)
            : false;

    const [darkTheme, setDarkTheme] = useState<boolean>(themeFromLocalStorage);

    const [renderComponent, setRenderComponent] = useState(false);


    // When mounted, switch to true. If not true, don't render it (safety)
    useEffect(() => {
        setRenderComponent(true);
    }, []);

    if (!renderComponent) return <></>


    return (
        <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>

            {/* Is darktheme true ? Then we provide 'dark' class */}
            <div className={`${darkTheme ? "dark" : ""} min-h-screen`}>
                <div className="dark:text-white dark:bg-black text-[#1E1E1E]">
                    {children}
                </div>
            </div>

        </ThemeContext.Provider>
    )
}

export default ThemeProvider;