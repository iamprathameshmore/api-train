import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/constant/route-constant";
import { useAppDispatch } from "@/store/hook";
import { refreshAccessToken } from "@/store/slices/auth-slice";

export default function AuthGuard() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken) {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      dispatch(refreshAccessToken())
        .unwrap()
        .then((token: string | null) => {
          if (token) {
            sessionStorage.setItem("accessToken", token);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-sm text-gray-600">Checking session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}
