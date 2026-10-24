
import { request } from "./client";

export const ticketApi = {
  getAll() {
    return request("/tickets");
  },

  getById(id) {
    return request(`/tickets/${encodeURIComponent(id)}`);
  },

  getHistory(id) {
    return request(`/tickets/${encodeURIComponent(id)}/history`);
  },

  create(data) {
    return request("/tickets", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateStatus(id, status, note = "") {
    return request(`/tickets/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, note }),
    });
  },
};
