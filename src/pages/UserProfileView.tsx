import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Mail, Phone, MessageSquare } from 'lucide-react';

export function UserProfileView() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Mock user data - In real app, fetch from API
  const user = {
    id: userId,
    name: 'Yağız Demiray',
    email: 'yagiz@example.com',
    phone: '0532 XXX XX XX',
    bloodType: 'A+',
    address: 'Kadıköy, İstanbul',
    lastDonation: '2023-10-15',
    totalDonations: 5,
  };

  const handleMessage = () => {
    navigate('/messages');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <div className="w-32 h-32 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl text-red-600 dark:text-red-400 font-bold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user.bloodType} Kan Grubu</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <MapPin className="h-5 w-5" />
              <span>{user.address}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Mail className="h-5 w-5" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Phone className="h-5 w-5" />
              <span>{user.phone}</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">Son Bağış</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{user.lastDonation}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">Toplam Bağış</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{user.totalDonations}</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button 
              onClick={handleMessage}
              className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Mesaj Gönder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileView;