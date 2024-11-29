import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, User, Search, MapPin, Filter } from 'lucide-react';

interface ActiveUser {
  id: number;
  name: string;
  bloodType: string;
  location: string;
  distance: string;
  avatar: string;
  lastActive: string;
  donationCount: number;
  lastDonation: string;
}

export function ActiveUsersPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    bloodType: '',
    maxDistance: '',
    city: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

  const usersPerPage = 8;

  // Örnek veri - gerçek uygulamada API'den gelecek
  const mockUsers: ActiveUser[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Kullanıcı ${i + 1}`,
    bloodType: ['A+', 'B+', 'AB+', '0+', 'A-', 'B-', 'AB-', '0-'][i % 8],
    location: ['Kadıköy', 'Üsküdar', 'Beşiktaş', 'Şişli'][i % 4] + ', İstanbul',
    distance: `${(i + 1) * 0.5} km`,
    avatar: `https://placehold.co/100x100/red/white?text=U${i + 1}`,
    lastActive: `${(i + 1) * 5} dk önce`,
    donationCount: Math.floor(Math.random() * 10),
    lastDonation: '2023-11-15',
  }));

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodType = !filters.bloodType || user.bloodType === filters.bloodType;
    const matchesDistance = !filters.maxDistance || 
                           parseFloat(user.distance) <= parseFloat(filters.maxDistance);
    const matchesCity = !filters.city || user.location.toLowerCase().includes(filters.city.toLowerCase());

    return matchesSearch && matchesBloodType && matchesDistance && matchesCity;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleMessageUser = (userId: number) => {
    navigate(`/messages/${userId}`);
  };

  const handleViewProfile = (userId: number) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 pt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Aktif Kan Bağışçıları</h1>
        <p className="text-gray-600 dark:text-gray-400">Yakınınızdaki aktif kan bağışçılarını bulun ve iletişime geçin.</p>
      </div>

      {/* Arama ve Filtre Bölümü */}
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="İsim veya konum ara..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <Filter className="h-5 w-5" />
            Filtrele
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kan Grubu</label>
              <select
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={filters.bloodType}
                onChange={(e) => setFilters({ ...filters, bloodType: e.target.value })}
              >
                <option value="">Tümü</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Maksimum Mesafe</label>
              <select
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={filters.maxDistance}
                onChange={(e) => setFilters({ ...filters, maxDistance: e.target.value })}
              >
                <option value="">Tümü</option>
                <option value="1">1 km</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="20">20 km</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Şehir</label>
              <input
                type="text"
                placeholder="Şehir ara..."
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Kullanıcı Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{user.bloodType}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  {user.location} • {user.distance}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{user.donationCount}</span> bağış yaptı
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Son aktif: {user.lastActive}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t dark:border-gray-700">
                <button
                  onClick={() => handleMessageUser(user.id)}
                  className="flex items-center justify-center w-1/2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mesaj
                </button>
                <button
                  onClick={() => handleViewProfile(user.id)}
                  className="flex items-center justify-center w-1/2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            Önceki
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 border rounded-md ${
                currentPage === page
                  ? 'bg-red-600 text-white'
                  : 'hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}