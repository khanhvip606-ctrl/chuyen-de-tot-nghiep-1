
import { request } from "./client";

export const deviceApi = {
  getAll() {
    return request("/devices");
  },

  create(data) {
    return request("/devices", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
