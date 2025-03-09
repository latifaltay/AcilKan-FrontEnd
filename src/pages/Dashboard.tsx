import { useState, useEffect } from "react";
import BloodRequestCard from "../components/BloodRequestCard";
import DashboardStats from "../components/DashboardStats";
import RequestModal from "../components/RequestModal";
import { bloodRequestService } from "../services/bloodRequestService";

interface BloodRequest {
  id: number;
  appUserId: number;
  appUserFullName: string;
  bloodGroupName: string | null;
  hospitalName: string;
  city: string;
  district: string;
  isActive: boolean;
  requestDate: string;
  patientFullName: string;
  status: string;
}

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 16;

  useEffect(() => {
    loadBloodRequests();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const loadBloodRequests = async () => {
    try {
      setLoading(true);
      const data = await bloodRequestService.getAllBloodRequests();
      setBloodRequests(data);
      setError(null);
    } catch (err) {
      setError("Kan talepleri yüklenirken bir hata oluştu.");
      console.error("Error loading blood requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSuccess = () => {
    loadBloodRequests();
  };

  // const mockNearbyUsers = [
  //   {
  //     id: 1,
  //     name: "Ayşe Demir",
  //     bloodType: "A Rh+",
  //     location: "Kadıköy, İstanbul",
  //     distance: "1 km",
  //     lastActive: "5 dk önce",
  //   },
  //   {
  //     id: 2,
  //     name: "Mehmet Kaya",
  //     bloodType: "B Rh-",
  //     location: "Üsküdar, İstanbul",
  //     distance: "3 km",
  //     lastActive: "10 dk önce",
  //   },
  //   {
  //     id: 3,
  //     name: "Ali Yılmaz",
  //     bloodType: "0 Rh+",
  //     location: "Beşiktaş, İstanbul",
  //     distance: "5 km",
  //     lastActive: "15 dk önce",
  //   },
  // ];

  const handleContactRequest = (requestId: number) => {
    // Handle contact request
    console.log("Contact request:", requestId);
  };

  const handleDonateRequest = (requestId: number) => {
    // Handle donate request
    console.log("Donate request:", requestId);
  };

  const totalPages = Math.ceil(bloodRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedRequests = bloodRequests.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Hoş Geldiniz
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kan bağışı ile hayat kurtarmaya devam edin
            </p>
          </div>
        </div>

        {/* Stats */}
        <DashboardStats />

        {/* Main Content */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Nearby Users */}
          {/* <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-24">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Yakın Çevredeki Aktif Kullanıcılar
              </h3>
              
              <div className="space-y-4">
                {mockNearbyUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {user.bloodType} • {user.distance}
                        </span>
                        <span className="text-xs text-gray-500">
                          Son aktif: {user.lastActive}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMessageUser(user.id)}
                        className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        title="Mesaj Gönder"
                      >
                        <MessageSquare className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleViewProfile(user.id)}
                        className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        title="Profili Görüntüle"
                      >
                        <User className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/activeUser')}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Tüm Kullanıcıları Görüntüle
                </button>
              </div>
            </div>
          </div> */}

          {/* Blood Requests */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Kan İhtiyaçları
                </h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Kan İhtiyacı Oluştur
                </button>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                      Yükleniyor...
                    </p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">{error}</p>
                  </div>
                ) : bloodRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">
                      Henüz kan talebi bulunmuyor.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayedRequests.map((request) => (
                      <BloodRequestCard
                        key={request.id}
                        request={request}
                        onContact={() => handleContactRequest(request.id)}
                        onDonate={() => handleDonateRequest(request.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center space-x-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      Önceki
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            currentPage === page
                              ? "bg-red-600 text-white"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      Sonraki
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRequestSuccess}
      />
    </div>
  );
}
