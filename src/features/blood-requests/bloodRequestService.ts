import { donationApi } from "../../shared/api/httpClient";
import { unwrap, unwrapMessage, type ApiSuccess, type PaginatedList } from "../../shared/api/envelope";
import type { BloodGroupType, BloodRequestDto } from "../../shared/types";

export interface CreateBloodRequestPayload {
  patientName: string;
  patientSurname: string;
  patientIdentityNumber: string;
  bloodGroup: BloodGroupType;
  requiredUnits: number;
  isDonorCompatibilityRequired: boolean;
  isHospitalSpecific: boolean;
  hospitalId?: number | null;
}

class BloodRequestService {
  async createBloodRequest(
    payload: CreateBloodRequestPayload
  ): Promise<BloodRequestDto> {
    return unwrap(
      donationApi.post<ApiSuccess<BloodRequestDto>>("/BloodRequests", payload)
    );
  }

  async getAllBloodRequests(
    pageNumber = 1,
    pageSize = 16
  ): Promise<PaginatedList<BloodRequestDto>> {
    return unwrap(
      donationApi.get<ApiSuccess<PaginatedList<BloodRequestDto>>>(
        "/BloodRequests",
        { params: { pageNumber, pageSize } }
      )
    );
  }

  async getMyBloodRequests(): Promise<BloodRequestDto[]> {
    return unwrap(
      donationApi.get<ApiSuccess<BloodRequestDto[]>>("/BloodRequests/mine")
    );
  }

  async getBloodRequestsByCity(
    cityId: number,
    pageNumber = 1,
    pageSize = 16
  ): Promise<PaginatedList<BloodRequestDto>> {
    return unwrap(
      donationApi.get<ApiSuccess<PaginatedList<BloodRequestDto>>>(
        `/BloodRequests/city/${cityId}`,
        { params: { pageNumber, pageSize } }
      )
    );
  }

  async getBloodRequestsByDistrict(
    districtId: number,
    pageNumber = 1,
    pageSize = 16
  ): Promise<PaginatedList<BloodRequestDto>> {
    return unwrap(
      donationApi.get<ApiSuccess<PaginatedList<BloodRequestDto>>>(
        `/BloodRequests/district/${districtId}`,
        { params: { pageNumber, pageSize } }
      )
    );
  }

  async cancelBloodRequest(id: string): Promise<string> {
    return unwrapMessage(
      donationApi.post(`/BloodRequests/${id}/cancel`)
    );
  }
}

export const bloodRequestService = new BloodRequestService();
