import { useEffect, useState } from "react";
import Dashboard from "../page/Dashboard";
import NotFound from "@/page/NotFound";
import { decodeJWT, isTokenExpired } from "@/types/jwt";
import { Loading } from "@/utils/Loading";

type GuardStatus = "checking" | "authorized" | "denied";

function useAuthGuard(requiredIsAdmin: boolean): GuardStatus {
  const [status, setStatus] = useState<GuardStatus>("checking");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("RToken");
      localStorage.removeItem("role");
      localStorage.removeItem("nkp");
      setStatus("denied");
      return;
    }

    const payload = decodeJWT(token);

    if (!payload || Boolean(payload.is_admin) !== requiredIsAdmin) {
      setStatus("denied");
      return;
    }

    setStatus("authorized");
  }, [requiredIsAdmin]);

  return status;
}

export const Auth = () => {
  const status = useAuthGuard(true);

  if (status === "checking") return <Loading />;
  if (status === "denied") return <NotFound />;
  return <Dashboard />;
};

export const AuthUsers = () => {
  const status = useAuthGuard(false);

  if (status === "checking") return <Loading />;
  if (status === "denied") return <NotFound />;
  return <Dashboard />;
};