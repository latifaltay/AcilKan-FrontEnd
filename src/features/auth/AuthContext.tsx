import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "./authService";
import { deviceService } from "../notifications/deviceService";
import { getFcmToken } from "../../shared/config/firebase";
import { toast } from "react-toastify";
import type { AuthResponse, AuthToken } from "../../shared/types";

export interface AuthUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Adres güncelleme vb. sonrası dönen JWT'yi localStorage'a yazar. */
  setTokens: (token: AuthToken) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toAuthUser(response: AuthResponse): AuthUser {
  return {
    id: response.userId,
    name: response.name,
    surname: response.surname,
    email: response.email,
    phoneNumber: response.phoneNumber,
  };
}

/** Giriş sonrası bildirim izni isteyip FCM token'ı backend'e kaydeder — sessizce başarısız olabilir. */
async function registerPushDevice() {
  try {
    const fcmToken = await getFcmToken();
    if (!fcmToken) return;

    localStorage.setItem("fcmToken", fcmToken);
    await deviceService.registerDevice({ fcmToken, platform: "Web" });
  } catch (error) {
    console.warn("Push bildirim cihazı kaydedilemedi:", error);
  }
}

async function unregisterPushDevice() {
  const fcmToken = localStorage.getItem("fcmToken");
  if (!fcmToken) return;

  try {
    await deviceService.unregisterDevice(fcmToken);
  } catch (error) {
    console.warn("Push bildirim cihazı kaydı silinemedi:", error);
  } finally {
    localStorage.removeItem("fcmToken");
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);

    localStorage.setItem("accessToken", response.token.accessToken);
    localStorage.setItem("refreshToken", response.token.refreshToken);

    const authUser = toAuthUser(response);
    localStorage.setItem("user", JSON.stringify(authUser));
    setUser(authUser);

    void registerPushDevice();

    toast.success(`Hoş geldiniz, ${authUser.name}! 🚀`, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });

    navigate("/home");
  };

  const logout = async () => {
    await unregisterPushDevice();

    try {
      await authService.logout();
    } catch (error) {
      console.warn("Sunucu tarafında çıkış işlemi tamamlanamadı:", error);
    }

    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const setTokens = (token: AuthToken) => {
    localStorage.setItem("accessToken", token.accessToken);
    localStorage.setItem("refreshToken", token.refreshToken);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, setTokens }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
