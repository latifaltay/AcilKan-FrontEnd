import { useState } from 'react';

interface DonationHistory {
  id: number;
  date: string;
  location: string;
  type: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'given' | 'received'>('given');

  const user = {
    name: 'Yağız Demiray',
    email: 'ahmet@example.com',
    phone: '0532 XXX XX XX',
    bloodType: 'A+',
    address: 'Kadıköy, İstanbul',
    lastDonation: '2023-10-15',
    totalDonations: 5,
  };

  const givenDonations: DonationHistory[] = [
    {
      id: 1,
      date: '15 Ekim 2023',
      location: 'Merkez Hastanesi',
      type: 'Tam Kan',
      status: 'completed',
    },
    {
      id: 2,
      date: '1 Temmuz 2023',
      location: 'Kızılay Kan Merkezi',
      type: 'Tam Kan',
      status: 'completed',
    },
    {
      id: 3,
      date: '20 Kasım 2023',
      location: 'Özel Hastane',
      type: 'Trombosit',
      status: 'pending',
    },
  ];

  const receivedDonations: DonationHistory[] = [
    {
      id: 4,
      date: '10 Aralık 2023',
      location: 'Devlet Hastanesi',
      type: 'Tam Kan',
      status: 'completed',
    },
    {
      id: 5,
      date: '25 Kasım 2023',
      location: 'Özel Hastane',
      type: 'Trombosit',
      status: 'completed',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'pending':
        return 'Beklemede';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <br></br>
      <br></br>
      <br></br>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sol Sidebar - Profil Özeti */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div className="w-32 h-32 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl text-red-600 font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.bloodType} Kan Grubu</p>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Toplam Bağış</span>
                <span className="font-semibold text-gray-800">{user.totalDonations}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Son Bağış</span>
                <span className="font-semibold text-gray-800">{user.lastDonation}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sonraki Bağış</span>
                <span className="font-semibold text-green-600">15 Ocak 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Ana İçerik */}
        <div className="md:col-span-2">
          {/* Profil Bilgileri */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Profil Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad
                </label>
                <p className="text-gray-800">{user.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <p className="text-gray-800">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <p className="text-gray-800">{user.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kan Grubu
                </label>
                <p className="text-gray-800">{user.bloodType}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adres
                </label>
                <p className="text-gray-800">{user.address}</p>
              </div>
            </div>
          </div>



          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Bağış Geçmişi</h3>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('given')}
                  className={`pb-4 text-sm font-medium ${
                    activeTab === 'given'
                      ? 'border-b-2 border-red-500 text-red-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Yapılan Bağışlar
                </button>
                <button
                  onClick={() => setActiveTab('received')}
                  className={`pb-4 text-sm font-medium ${
                    activeTab === 'received'
                      ? 'border-b-2 border-red-500 text-red-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Alınan Bağışlar
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hasta Adı Soyadı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hastane Adı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Onay
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(activeTab === 'given' ? givenDonations : receivedDonations).map((donation) => (
                    <tr key={donation.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {donation.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {/* {donation.patientName} */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {/* {donation.hospitalName} */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {donation.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {donation.approval ? 'Onaylandı' : 'Bekliyor'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                          {getStatusText(donation.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(activeTab === 'given' ? givenDonations : receivedDonations).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Kayıt bulunamadı.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;