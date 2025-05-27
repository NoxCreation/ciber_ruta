import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/router";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  login: (userData?: any ) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<any | null>>;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

interface Profile {
  picture: string;
  name: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: (codeResponse: any) => {
      setUser(codeResponse);
      router.push("/");
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const logout = () => {
    googleLogout();
    router.push("/login");
    setProfile(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    profile,
    login,
    logout,
    setUser,
    setProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
