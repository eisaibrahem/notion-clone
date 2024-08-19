import { useEffect, useState } from "react";

function useOrigin() {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  return origin;
}

export default useOrigin;
