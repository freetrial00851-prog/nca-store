import { useEffect, useState } from "react";

/** Returns true only after client mount — avoids hydration mismatch with localStorage state. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
