import { useState, useEffect } from "react";

const useScreenSize = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const smallScreenMediaQuery = window.matchMedia("(max-width: 768px)");
    const mediumScreenMediaQuery = window.matchMedia(
      "(min-width: 769px) and (max-width: 1024px)"
    );
    const largeScreenMediaQuery = window.matchMedia("(min-width: 1025px)");

    const handleSmallScreenChange = (event) => setIsSmallScreen(event.matches);
    const handleMediumScreenChange = (event) =>
      setIsMediumScreen(event.matches);
    const handleLargeScreenChange = (event) => setIsLargeScreen(event.matches);

    smallScreenMediaQuery.addListener(handleSmallScreenChange);
    handleSmallScreenChange(smallScreenMediaQuery);

    mediumScreenMediaQuery.addListener(handleMediumScreenChange);
    handleMediumScreenChange(mediumScreenMediaQuery);

    largeScreenMediaQuery.addListener(handleLargeScreenChange);
    handleLargeScreenChange(largeScreenMediaQuery);

    return () => {
      smallScreenMediaQuery.removeListener(handleSmallScreenChange);
      mediumScreenMediaQuery.removeListener(handleMediumScreenChange);
      largeScreenMediaQuery.removeListener(handleLargeScreenChange);
    };
  }, []);

  return {
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
  };
};

export default useScreenSize;
