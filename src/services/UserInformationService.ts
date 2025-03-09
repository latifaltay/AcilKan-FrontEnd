import api from "./api";

export const UserInformationService = {
  /**
   * Kullanıcı ana sayfa bilgilerini getirir.
   * @returns Kullanıcı profil verisi veya null
   */
  getHomePageChartByUserId: async () => {
    try {
      const response = await api.get("/UserInformation/GetHomePageChartByUserId");
      return response.data;
    } catch (error) {
      console.error("❌ Kullanıcı ana sayfa bilgisi alınırken hata oluştu:", error);
      return null;
    }
  },
};
