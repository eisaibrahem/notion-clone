import { useEffect, useState } from "react";

function useOrigin() {
  const [mounted, setMounted] = useState(false);
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return "";
  }

  return origin;
}

export default useOrigin;
