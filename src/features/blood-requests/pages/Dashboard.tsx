import { useState, useEffect, useCallback } from "react";
import BloodRequestCard from "../components/BloodRequestCard";
import DashboardStats from "../components/DashboardStats";
import RequestModal from "../components/RequestModal";
import { bloodRequestService } from "../bloodRequestService";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import type { BloodRequestDto } from "../../../shared/types";

const PAGE_SIZE = 16;

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bloodRequests, setBloodRequests] = useState<BloodRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBloodRequests = useCallback(async (pageNumber: number) => {
    try {
      setLoading(true);
      const data = await bloodRequestService.getAllBloodRequests(
        pageNumber,
        PAGE_SIZE
      );
      setBloodRequests(data.items);
      setTotalPages(data.totalPages || 1);
      setError(null);
    } catch (err) {
      setError(getApiErrorMessage(err, "Kan talepleri yüklenirken bir hata oluştu."));
      console.error("Error loading blood requests:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBloodRequests(currentPage);
  }, [loadBloodRequests, currentPage]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const handleRequestSuccess = () => {
    setCurrentPage(1);
    loadBloodRequests(1);
  };

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
                    {bloodRequests.map((request) => (
                      <BloodRequestCard key={request.id} request={request} />
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
