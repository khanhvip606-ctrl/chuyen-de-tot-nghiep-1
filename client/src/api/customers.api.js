
import { request } from "./client";

export const customerApi = {
  getAll() {
    return request("/customers");
  },

  create(data) {
    return request("/customers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
