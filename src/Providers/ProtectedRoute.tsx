import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null; // o un spinner <Loading />
  }

  return <>{children}</>;
};

export default ProtectedRoute;