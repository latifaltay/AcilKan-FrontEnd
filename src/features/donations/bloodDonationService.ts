import { donationApi } from "../../shared/api/httpClient";
import { unwrap, unwrapMessage, type ApiSuccess, type PaginatedList } from "../../shared/api/envelope";
import type {
  BloodDonationOfferDto,
  ConfirmedBloodDonationResult,
  CreatedDonationOfferResult,
  GeneratedConfirmationCodeResult,
  MyDonationOfferDto,
  ReceivedDonationItemDto,
} from "../../shared/types";

export const bloodDonationService = {
  async createOffer(bloodRequestId: string): Promise<CreatedDonationOfferResult> {
    return unwrap(
      donationApi.post<ApiSuccess<CreatedDonationOfferResult>>(
        "/BloodDonations",
        { bloodRequestId }
      )
    );
  },

  async acceptOffer(id: string): Promise<GeneratedConfirmationCodeResult> {
    return unwrap(
      donationApi.post<ApiSuccess<GeneratedConfirmationCodeResult>>(
        `/BloodDonations/${id}/accept`
      )
    );
  },

  async regenerateCode(id: string): Promise<GeneratedConfirmationCodeResult> {
    return unwrap(
      donationApi.post<ApiSuccess<GeneratedConfirmationCodeResult>>(
        `/BloodDonations/${id}/regenerate-code`
      )
    );
  },

  async rejectOffer(id: string): Promise<string> {
    return unwrapMessage(donationApi.post(`/BloodDonations/${id}/reject`));
  },

  async cancelOffer(id: string): Promise<string> {
    return unwrapMessage(donationApi.post(`/BloodDonations/${id}/cancel`));
  },

  async medicalReject(id: string): Promise<string> {
    return unwrapMessage(
      donationApi.post(`/BloodDonations/${id}/medical-reject`)
    );
  },

  async confirmOffer(
    id: string,
    code: string
  ): Promise<ConfirmedBloodDonationResult> {
    return unwrap(
      donationApi.post<ApiSuccess<ConfirmedBloodDonationResult>>(
        `/BloodDonations/${id}/confirm`,
        { code }
      )
    );
  },

  async getMyOffers(): Promise<MyDonationOfferDto[]> {
    return unwrap(
      donationApi.get<ApiSuccess<MyDonationOfferDto[]>>(
        "/BloodDonations/my-offers"
      )
    );
  },

  async getOffersForRequest(
    bloodRequestId: string
  ): Promise<BloodDonationOfferDto[]> {
    return unwrap(
      donationApi.get<ApiSuccess<BloodDonationOfferDto[]>>(
        `/BloodDonations/requests/${bloodRequestId}`
      )
    );
  },

  async getReceivedDonations(
    pageNumber = 1,
    pageSize = 16
  ): Promise<PaginatedList<ReceivedDonationItemDto>> {
    return unwrap(
      donationApi.get<ApiSuccess<PaginatedList<ReceivedDonationItemDto>>>(
        "/BloodDonations/received",
        { params: { pageNumber, pageSize } }
      )
    );
  },
};
