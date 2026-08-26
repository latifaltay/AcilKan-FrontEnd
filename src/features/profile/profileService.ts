import { donationApi } from "../../shared/api/httpClient";
import { unwrap, type ApiSuccess } from "../../shared/api/envelope";
import type { DashboardSummaryDto } from "../../shared/types";

export const profileService = {
  async getDashboard(): Promise<DashboardSummaryDto> {
    return unwrap(
      donationApi.get<ApiSuccess<DashboardSummaryDto>>("/Profile/dashboard")
    );
  },
};
