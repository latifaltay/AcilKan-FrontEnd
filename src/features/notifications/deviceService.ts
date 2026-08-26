import { donationApi } from "../../shared/api/httpClient";
import { unwrapMessage } from "../../shared/api/envelope";
import type { DevicePlatform } from "../../shared/types";

export interface RegisterDevicePayload {
  fcmToken: string;
  platform: DevicePlatform;
  deviceModel?: string;
  appVersion?: string;
}

export const deviceService = {
  async registerDevice(payload: RegisterDevicePayload): Promise<string> {
    return unwrapMessage(donationApi.post("/Devices/register", payload));
  },

  async unregisterDevice(fcmToken: string): Promise<string> {
    return unwrapMessage(
      donationApi.post("/Devices/unregister", { fcmToken })
    );
  },
};
