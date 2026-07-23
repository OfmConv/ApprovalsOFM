import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Auth, AuthUsers } from "./services/auth";
import { useEffect, useState } from "react";
import { Loading } from "./utils/Loading";
import LoginPage from "./page/Login";
import NotFound from "./page/NotFound";
import Home from "./page/Home";
import History from "./utils/History";
import ErrorBoundary from "./utils/ErrorBoundary";
import Article from "./page/Article";


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorBoundary><div>Terjadi kesalahan.</div></ErrorBoundary>
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorBoundary><div>Terjadi kesalahan.</div></ErrorBoundary>
  },
  {
    path: '/dashboard/:t',
    element: (
      <TooltipProvider>
        <Auth />
      </TooltipProvider>
    ),
    errorElement: <ErrorBoundary><div>Terjadi kesalahan.</div></ErrorBoundary>
  },
  {
    path: '/history',
    element: <History />,
    errorElement: <ErrorBoundary><div>Terjadi kesalahan.</div></ErrorBoundary>
  },
  {
    path: '/anggota/:t',
    element: <AuthUsers />,
    errorElement: <ErrorBoundary><div>Terjadi kesalahan.</div></ErrorBoundary>
  },
  {
    path: '/kegiatan',
    element: <Article />
  },
  {
    path: '*',
    element: <NotFound />
  },
]);


function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (mounted) setReady(true);
    }, 3000);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
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