import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "maomao"
    );

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}