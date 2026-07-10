import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Auth, AuthUsers } from "./services/auth";
import { useEffect, useState } from "react";
import { Loading } from "./utils/Loading";
import LoginPage from "./page/Login";
import NotFound from "./page/NotFound";
import Home from "./page/Home";
import History from "./utils/History";


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/dashboard/:t',
    element: (
      <TooltipProvider>
        <Auth />
      </TooltipProvider>
    )
  },
  {
    path: '/history',
    element: <History />
  },
  {
    path: '/anggota/:t',
    element: <AuthUsers />
  },
  {
    path: '*',
    element: <NotFound />
  },
]);

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      setReady(true);
      return <Navigate to="/dashboard" />
    }
    setTimeout(() => {
      init();
    }, 3000);
  }, []);

  if (ready === false) return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "#c1d2df",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
      }}
    >
      <Loading />
    </div>
  );
  return <RouterProvider router={router} />
}

export default App;