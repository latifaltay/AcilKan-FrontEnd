import React from 'react';

interface FilterProps {
  filters: {
    city: string;
    district: string;
    hospital: string;
    bloodType: string;
  };
  onFilterChange: (name: string, value: string) => void;
}

export function NearbyUsersFilter({ filters, onFilterChange }: FilterProps) {
  return (
    <div className="space-y-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Şehir
        </label>
        <select
          value={filters.city}
          onChange={(e) => onFilterChange('city', e.target.value)}
          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-red-500"
        >
          <option value="">Tüm Şehirler</option>
          <option value="istanbul">İstanbul</option>
          <option value="ankara">Ankara</option>
          <option value="izmir">İzmir</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          İlçe
        </label>
        <select
          value={filters.district}
          onChange={(e) => onFilterChange('district', e.target.value)}
          disabled={!filters.city}
          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-red-500"
        >
          <option value="">Tüm İlçeler</option>
          {filters.city === 'istanbul' && (
            <>
              <option value="kadikoy">Kadıköy</option>
              <option value="besiktas">Beşiktaş</option>
              <option value="uskudar">Üsküdar</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Hastane
        </label>
        <select
          value={filters.hospital}
          onChange={(e) => onFilterChange('hospital', e.target.value)}
          disabled={!filters.district}
          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-red-500"
        >
          <option value="">Tüm Hastaneler</option>
          {filters.district === 'kadikoy' && (
            <>
              <option value="hospital1">Kadıköy Devlet Hastanesi</option>
              <option value="hospital2">Özel Hastane</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Kan Grubu
        </label>
        <select
          value={filters.bloodType}
          onChange={(e) => onFilterChange('bloodType', e.target.value)}
          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-red-500"
        >
          <option value="">Tüm Kan Grupları</option>
          <option value="A+">A Rh+</option>
          <option value="A-">A Rh-</option>
          <option value="B+">B Rh+</option>
          <option value="B-">B Rh-</option>
          <option value="AB+">AB Rh+</option>
          <option value="AB-">AB Rh-</option>
          <option value="0+">0 Rh+</option>
          <option value="0-">0 Rh-</option>
        </select>
      </div>
    </div>
  );
}