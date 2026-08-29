import { useEffect, useState } from "react";

function useDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth > 768);

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth > 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isDesktop;
}

export default useDesktop;
