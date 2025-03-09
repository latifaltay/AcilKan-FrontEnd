import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  bloodGroup: string | null;
  city: string;
  district: string;
  phoneNumber: string;
}

interface UserProfileContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

export function UserProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          console.error("⚠️ Access Token bulunamadı.");
          setError("Giriş yapmalısınız.");
          return;
        }

        console.log("🛠 API isteği gönderiliyor...");

        const response = await api.get<UserProfile>(
          "/UserInformation/GetHomePageChartByUserId",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("✅ API Yanıtı:", response.data);

        setUserProfile(response.data);
      } catch (err) {
        console.error("❌ Kullanıcı bilgisi yüklenirken hata oluştu:", err);
        setError("Profil bilgileri yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <UserProfileContext.Provider value={{ userProfile, loading, error }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}
