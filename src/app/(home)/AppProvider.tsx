"use client";
import {User} from "@/apiRequest/ApiAuth";
import {clientAccessToken} from "@/apiRequest/http";
import socket from "@/lib/socket";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React, {createContext, useContext, useState} from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

export default function AppProvider({
  children,
  initialAccessToken = "",
  user: userProp,
}: {
  children: React.ReactNode;
  user: User | null;
  initialAccessToken?: string;
}) {
  const [user, setUser] = useState<User | null>(userProp);
  useState(() => {
    if (typeof window !== "undefined") {
      clientAccessToken.value = initialAccessToken;
      socket.connect();
      console.log("connect socket");
    }
  });
  return (
    <AppContext.Provider value={{user, setUser}}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AppContext.Provider>
  );
}
