import { useEffect, useState } from "react";
import type React from "react";
import Dashboard from "../page/Dashboard";
import NotFound from "@/page/NotFound";
import { isTokenExpired } from "@/types/jwt";
import { Loading } from "@/utils/Loading";

type GuardStatus = "checking" | "authorized" | "denied";

function useAuthGuard(requiredIsAdmin: boolean): GuardStatus {
  const [status, setStatus] = useState<GuardStatus>("checking");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || isTokenExpired(token) || !role) {
      localStorage.removeItem("token");
      localStorage.removeItem("RToken");
      localStorage.removeItem("role");
      localStorage.removeItem("nkp");
      setStatus("denied");
      return;
    }

    const isAdmin = role !== "MemberOFM";

    if (isAdmin !== requiredIsAdmin) {
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

export const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const status = useAuthGuard(true);

  if (status === "checking") return <Loading />;
  if (status === "denied") return <NotFound />;
  return <>{children}</>;
};