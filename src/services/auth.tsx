import Users from "../page/Users" 
import Dashboard from "../page/Dashboard";
import NotFound from '@/page/NotFound';
import { useParams } from "react-router-dom";

export const Auth = () => {
    const { t } = useParams();
    const token =  localStorage.getItem("token");

  if (!token || t !== token) {
    return <NotFound />;
  }

  return <Dashboard />;
};

export const AuthUsers = () => {
    const { t } = useParams();
    const token =  localStorage.getItem("token");

    if (!token || t !== token) {
        return <NotFound />;
    }
    return <Users />;
}