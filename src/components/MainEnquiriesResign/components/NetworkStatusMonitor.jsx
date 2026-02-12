import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export const NetworkStatusMonitor = ({ isOnline, setIsOnline }) => {
  const lastToastTimeRef = useRef(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (!isOnline) {
        // toast.success("🌐 Internet connection restored!");
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (isOnline) {
        // toast.error("📡 Please check your internet connection!");
      }
    };

    if (!navigator.onLine) {
      handleOffline();
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline, setIsOnline]);

  const checkInternetConnection = () => {
    if (!navigator.onLine) {
      const now = Date.now();
      if (now - lastToastTimeRef.current > 3000) {
        // toast.error("📡 Please check your internet connection!");
        lastToastTimeRef.current = now;
      }
      return false;
    }
    return true;
  };

  return { checkInternetConnection };
};
