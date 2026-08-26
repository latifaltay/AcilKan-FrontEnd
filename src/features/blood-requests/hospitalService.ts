import { donationApi } from "../../shared/api/httpClient";
import { unwrap, type ApiSuccess } from "../../shared/api/envelope";
import type { Hospital } from "../../shared/types";

export type { Hospital };

export const hospitalService = {
  async getHospitalsByDistrict(districtId: number): Promise<Hospital[]> {
    return unwrap(
      donationApi.get<ApiSuccess<Hospital[]>>(
        `/Hospitals/districts/${districtId}`
      )
    );
  },
};
