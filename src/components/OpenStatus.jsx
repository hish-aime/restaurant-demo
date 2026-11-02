import { useEffect, useState } from "react";
import { getShopStatus } from "../utils/shopStatus";

export default function OpenStatus() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const status = getShopStatus(now);

  return (
    <span className={`shop-status ${status.open ? "is-open" : "is-closed"}`}>
      <span className="shop-status-dot" />
      <strong>{status.open ? "Ouvert" : "Fermé"}</strong>
      {status.detail && <span className="shop-status-detail"> · {status.detail}</span>}
    </span>
  );
}
