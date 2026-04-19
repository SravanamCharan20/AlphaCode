"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type User = {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};

type SigninInput = {
  email: string;
  password: string;
};

type SignupInput = SigninInput & {
  username: string;
};

type UserContextValue = {
  user: User | null;
  isBootstrapping: boolean;
  signin: (payload: SigninInput) => Promise<User>;
  signup: (payload: SignupInput) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function bootstrapUser() {
      try {
        const profile = await apiRequest<User>("/auth/profile");
        if (!ignore) {
          setUser(profile);
        }
      } catch {
        if (!ignore) {
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrapUser();

    return () => {
      ignore = true;
    };
  }, []);

  const refreshUser = async () => {
    try {
      const profile = await apiRequest<User>("/auth/profile");
      setUser(profile);
      return profile;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const signin = async ({ email, password }: SigninInput) => {
    const data = await apiRequest<{ user: User }>("/auth/signin", {
      method: "POST",
      body: { email, password },
    });

    if (data?.user) {
      setUser(data.user);
      return data.user;
    }

    return refreshUser();
  };

  const signup = async ({ username, email, password }: SignupInput) => {
    await apiRequest<{ user: User }>("/auth/signup", {
      method: "POST",
      body: { username, email, password },
    });

    return signin({ email, password });
  };

  const logout = async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } finally {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isBootstrapping,
        signin,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const value = useContext(UserContext);

  if (!value) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return value;
}
