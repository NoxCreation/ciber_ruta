import { useRouter } from 'next/router';
import { useAuth } from "./AuthProvider";
import { useEffect } from "react";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const publicRoutes = ["/login"];
    if (!user && !publicRoutes.includes(router.pathname)) {
      router.push("/login");
    }
  }, [user, router]);

   if (!user && router.pathname !== "/login") {
    return null; // o un spinner <Loading />
  }

  return <>{children}</>;
};
