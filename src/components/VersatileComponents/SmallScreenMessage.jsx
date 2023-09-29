import { createTheme } from "@mui/material";
import { useMemo } from "react";
import { themeSettings } from "../../utils/theme";
import { useCustomTheme } from "../../contexts/ThemeContext";

const SmallScreenMessage = () => {
  const { mode } = useCustomTheme();
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const screentxtStyle = theme.palette.mode === "dark" ? "#B1B1B1": "#292727";

  return ( 
    <div id="small_screen_protector"
         style={{background: theme.palette.mode === "dark"? "#0D1633" : "#D3D3D3"}}>
      <div id="small_screen_cont" style={{
           background: theme.palette.mode === "dark" ? "#2C3A69": "#8F9BC3" }}>
        <h1 style={{color: screentxtStyle}}>Inapropriate Screen Size</h1>
        <h3 style={{color: screentxtStyle}}>Your screen size is below 1200px. For the best experience, please use a larger screen like tablet, laptop or desktop. Thank You !</h3>
      </div>
    </div> 
   )
}
 
export default SmallScreenMessage;