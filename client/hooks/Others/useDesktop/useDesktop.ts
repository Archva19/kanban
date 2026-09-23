import { useEffect, useState } from "react";

function useDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [isXl, setIsXl] = useState<boolean>(false);

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth > 768);
      setIsXl(window.innerWidth > 1280);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isDesktop, isXl };
}

export default useDesktop;
