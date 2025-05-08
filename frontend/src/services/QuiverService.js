import axios from "axios";

export class QuiverService {
  static async list() {
    const response = await axios.get("/api/quivers");
    return response.data;
  }

  static async create(name) {
    const response = await axios.post("/api/quivers", { name });
    return response.data;
  }

  static async update(id, name) {
    const response = await axios.put(`/api/quivers/${id}`, { name });
    return response.data;
  }

  static async delete(id) {
    const response = await axios.delete(`/api/quivers/${id}`);
    return response.data;
  }

  static async getDetail(id) {
    const response = await axios.get(`/api/quivers/${id}`);
    return response.data;
  }
}
