import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { bloodRequestService } from '../services/bloodRequestService';
import axios from 'axios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface City {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
}

interface Hospital {
  id: number;
  hospitalName: string;
}

enum BloodGroupType {
  APositive = 1,
  ANegative = 2,
  BPositive = 3,
  BNegative = 4,
  ABPositive = 5,
  ABNegative = 6,
  OPositive = 7,
  ONegative = 8
}

const bloodGroups = [
  { id: BloodGroupType.APositive, label: 'A RH +' },
  { id: BloodGroupType.ANegative, label: 'A RH -' },
  { id: BloodGroupType.BPositive, label: 'B RH +' },
  { id: BloodGroupType.BNegative, label: 'B RH -' },
  { id: BloodGroupType.ABPositive, label: 'AB RH +' },
  { id: BloodGroupType.ABNegative, label: 'AB RH -' },
  { id: BloodGroupType.OPositive, label: '0 RH +' },
  { id: BloodGroupType.ONegative, label: '0 RH -' },
];

export default function RequestModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    patientName: '',
    patientSurname: '',
    bloodGroupId: '',
    hospitalId: '',
    cityId: '',
    districtId: '',
  });

  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (formData.cityId) {
      fetchDistricts(parseInt(formData.cityId));
      // Reset district and hospital when city changes
      setFormData(prev => ({ ...prev, districtId: '', hospitalId: '' }));
      setHospitals([]);
    }
  }, [formData.cityId]);

  useEffect(() => {
    if (formData.districtId) {
      fetchHospitals(parseInt(formData.districtId));
      // Reset hospital when district changes
      setFormData(prev => ({ ...prev, hospitalId: '' }));
    }
  }, [formData.districtId]);

  const fetchCities = async () => {
    try {
      const response = await axios.get('https://localhost:7132/api/City/GetAllCity');
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchDistricts = async (cityId: number) => {
    try {
      const response = await axios.get(`https://localhost:7132/api/City/GetDistrictsByCityId/${cityId}`);
      setDistricts(response.data);
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchHospitals = async (districtId: number) => {
    try {
      const response = await axios.get(`https://localhost:7132/api/District/${districtId}`);
      setHospitals(response.data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = {
        hospitalId: parseInt(formData.hospitalId),
        bloodGroupId: parseInt(formData.bloodGroupId),
        patientName: formData.patientName,
        patientSurname: formData.patientSurname
      };

      await bloodRequestService.createBloodRequest(requestData);
      onSuccess?.();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating blood request:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      patientSurname: '',
      bloodGroupId: '',
      hospitalId: '',
      cityId: '',
      districtId: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Kan İhtiyacı Oluştur</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ad</label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Soyad</label>
              <input
                type="text"
                value={formData.patientSurname}
                onChange={(e) => setFormData({ ...formData, patientSurname: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kan Grubu</label>
            <select
              value={formData.bloodGroupId}
              onChange={(e) => setFormData({ ...formData, bloodGroupId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">Seçiniz</option>
              {bloodGroups.map(group => (
                <option key={group.id} value={group.id}>{group.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">İl</label>
            <select
              value={formData.cityId}
              onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">İl Seçiniz</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">İlçe</label>
            <select
              value={formData.districtId}
              onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              disabled={!formData.cityId}
            >
              <option value="">İlçe Seçiniz</option>
              {districts.map(district => (
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hastane</label>
            <select
              value={formData.hospitalId}
              onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              disabled={!formData.districtId}
            >
              <option value="">Hastane Seçiniz</option>
              {hospitals.map(hospital => (
                <option key={hospital.id} value={hospital.id}>{hospital.hospitalName}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}