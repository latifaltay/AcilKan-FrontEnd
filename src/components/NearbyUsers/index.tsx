import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { NearbyUsersFilter } from './NearbyUsersFilter';
import { NearbyUsersList } from './NearbyUsersList';

interface NearbyUser {
  id: number;
  name: string;
  bloodType: string;
  location: string;
  distance: string;
  lastActive: string;
}

interface Props {
  users: NearbyUser[];
  onMessageUser: (userId: number) => void;
  onViewProfile: (userId: number) => void;
}

export function NearbyUsers({ users, onMessageUser, onViewProfile }: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    district: '',
    hospital: '',
    bloodType: ''
  });

  const handleFilterChange = (name: string, value: string) => {
    if (name === 'city') {
      setFilters({
        ...filters,
        city: value,
        district: '',
        hospital: ''
      });
    } else if (name === 'district') {
      setFilters({
        ...filters,
        district: value,
        hospital: ''
      });
    } else {
      setFilters({
        ...filters,
        [name]: value
      });
    }
  };

  const filteredUsers = users.filter(user => {
    return (
      (!filters.city || user.location.toLowerCase().includes(filters.city.toLowerCase())) &&
      (!filters.district || user.location.toLowerCase().includes(filters.district.toLowerCase())) &&
      (!filters.bloodType || user.bloodType === filters.bloodType)
    );
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Yakın Çevredeki Aktif Kullanıcılar
      </h3>
      
      <div className="mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:text-red-600 border rounded-lg"
        >
          <Filter className="h-4 w-4" />
          Filtreleme Seçenekleri
        </button>
      </div>

      {showFilters && (
        <NearbyUsersFilter
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}

      <NearbyUsersList
        users={filteredUsers}
        onMessageUser={onMessageUser}
        onViewProfile={onViewProfile}
      />
    </div>
  );
}