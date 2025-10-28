
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-DXRGEETRBB", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

export default Analytics;
