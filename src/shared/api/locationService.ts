import { identityApi } from "./httpClient";
import { unwrap, type ApiSuccess } from "./envelope";
import type { City, District } from "../types";

export type { City, District };

export const locationService = {
  async getCities(): Promise<City[]> {
    return unwrap(identityApi.get<ApiSuccess<City[]>>("/Locations/cities"));
  },

  async getDistrictsByCityId(cityId: number): Promise<District[]> {
    return unwrap(
      identityApi.get<ApiSuccess<District[]>>(
        `/Locations/cities/${cityId}/districts`
      )
    );
  },
};
