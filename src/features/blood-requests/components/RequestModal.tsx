import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { bloodRequestService } from "../bloodRequestService";
import { locationService, type City, type District } from "../../../shared/api/locationService";
import { hospitalService, type Hospital } from "../hospitalService";
import { bloodGroups } from "../../../shared/lib/bloodGroups";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { Input } from "../../../shared/ui/Input";
import { Select } from "../../../shared/ui/Select";
import { Button } from "../../../shared/ui/Button";
import type { BloodGroupType } from "../../../shared/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const initialFormData = {
  patientName: "",
  patientSurname: "",
  patientIdentityNumber: "",
  bloodGroup: "" as BloodGroupType | "",
  requiredUnits: "1",
  /** v1: backend her zaman exact uyumluluk yazar; UI seçeneği yakında. */
  /** v1: backend her zaman exact uyumluluk yazar; UI seçeneği yakında. */
  isDonorCompatibilityRequired: true,
  isHospitalSpecific: false,
  cityId: "",
  districtId: "",
  hospitalId: "",
};

export default function RequestModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState(initialFormData);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCities = useCallback(async () => {
    try {
      setCities(await locationService.getCities());
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  }, []);

  const fetchDistricts = useCallback(async (cityId: number) => {
    try {
      setDistricts(await locationService.getDistrictsByCityId(cityId));
    } catch (err) {
      console.error("Error fetching districts:", err);
    }
  }, []);

  const fetchHospitals = useCallback(async (districtId: number) => {
    try {
      setHospitals(await hospitalService.getHospitalsByDistrict(districtId));
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchCities();
  }, [isOpen, fetchCities]);

  useEffect(() => {
    if (formData.cityId) {
      fetchDistricts(parseInt(formData.cityId));
      setFormData((prev) => ({ ...prev, districtId: "", hospitalId: "" }));
      setHospitals([]);
    }
  }, [formData.cityId, fetchDistricts]);

  useEffect(() => {
    if (formData.districtId) {
      fetchHospitals(parseInt(formData.districtId));
      setFormData((prev) => ({ ...prev, hospitalId: "" }));
    }
  }, [formData.districtId, fetchHospitals]);

  const resetForm = () => {
    setFormData(initialFormData);
    setDistricts([]);
    setHospitals([]);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.bloodGroup) {
      setError("Lütfen kan grubu seçin.");
      return;
    }

    if (formData.isHospitalSpecific && !formData.hospitalId) {
      setError("Belirli bir hastane seçtiyseniz hastaneyi belirtmelisiniz.");
      return;
    }

    setLoading(true);
    try {
      await bloodRequestService.createBloodRequest({
        patientName: formData.patientName,
        patientSurname: formData.patientSurname,
        patientIdentityNumber: formData.patientIdentityNumber,
        bloodGroup: formData.bloodGroup,
        requiredUnits: parseInt(formData.requiredUnits) || 1,
        isDonorCompatibilityRequired: true,
        isHospitalSpecific: formData.isHospitalSpecific,
        hospitalId: formData.isHospitalSpecific
          ? parseInt(formData.hospitalId)
          : null,
      });
      toast.success("Kan talebiniz oluşturuldu.");
      onSuccess?.();
      onClose();
      resetForm();
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Kan talebi oluşturulurken bir hata oluştu.")
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Kan İhtiyacı Oluştur
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hasta Adı"
              required
              fullWidth
              value={formData.patientName}
              onChange={(e) =>
                setFormData({ ...formData, patientName: e.target.value })
              }
            />
            <Input
              label="Hasta Soyadı"
              required
              fullWidth
              value={formData.patientSurname}
              onChange={(e) =>
                setFormData({ ...formData, patientSurname: e.target.value })
              }
            />
          </div>

          <Input
            label="Hasta TC Kimlik No"
            required
            fullWidth
            maxLength={11}
            value={formData.patientIdentityNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                patientIdentityNumber: e.target.value.replace(/\D/g, ""),
              })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Kan Grubu"
              required
              fullWidth
              placeholder="Seçiniz"
              value={formData.bloodGroup}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bloodGroup: e.target.value as BloodGroupType,
                })
              }
              options={bloodGroups.map((group) => ({
                value: group.id,
                label: group.label,
              }))}
            />
            <Input
              label="Gereken Ünite"
              type="number"
              min={1}
              required
              fullWidth
              value={formData.requiredUnits}
              onChange={(e) =>
                setFormData({ ...formData, requiredUnits: e.target.value })
              }
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed">
            <input
              type="checkbox"
              checked
              disabled
              className="rounded text-red-600 focus:ring-red-500 opacity-60"
            />
            <span>
              Bağışçı kan grubu uyumluluğu şart
              <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">
                (Yakında — v1&apos;de yalnızca aynı grup)
              </span>
            </span>
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={formData.isHospitalSpecific}
              onChange={(e) =>
                setFormData({ ...formData, isHospitalSpecific: e.target.checked })
              }
              className="rounded text-red-600 focus:ring-red-500"
            />
            Belirli bir hastanede ihtiyaç var
          </label>

          {formData.isHospitalSpecific && (
            <div className="space-y-4 pl-1 border-l-2 border-red-200 dark:border-red-900">
              <Select
                label="İl"
                fullWidth
                required
                placeholder="İl Seçiniz"
                value={formData.cityId}
                onChange={(e) =>
                  setFormData({ ...formData, cityId: e.target.value })
                }
                options={cities.map((city) => ({ value: city.id, label: city.name }))}
              />
              <Select
                label="İlçe"
                fullWidth
                required
                disabled={!formData.cityId}
                placeholder="İlçe Seçiniz"
                value={formData.districtId}
                onChange={(e) =>
                  setFormData({ ...formData, districtId: e.target.value })
                }
                options={districts.map((district) => ({
                  value: district.id,
                  label: district.name,
                }))}
              />
              <Select
                label="Hastane"
                fullWidth
                required
                disabled={!formData.districtId}
                placeholder="Hastane Seçiniz"
                value={formData.hospitalId}
                onChange={(e) =>
                  setFormData({ ...formData, hospitalId: e.target.value })
                }
                options={hospitals.map((hospital) => ({
                  value: hospital.id,
                  label: hospital.name,
                }))}
              />
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" loading={loading}>
              Oluştur
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
