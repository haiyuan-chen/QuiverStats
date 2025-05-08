import axios from "axios";

export class ArrowService {
  static async list(quiverId) {
    const response = await axios.get(`/api/quivers/${quiverId}/arrows`);
    return response.data;
  }

  static async create(quiverId, name) {
    const response = await axios.post(`/api/quivers/${quiverId}/arrows`, { name });
    return response.data;
  }

  static async update(id, name) {
    const response = await axios.put(`/api/arrows/${id}`, { name });
    return response.data;
  }

  static async delete(id) {
    const response = await axios.delete(`/api/arrows/${id}`);
    return response.data;
  }
  
  static async getScores(arrowId) {
    const response = await axios.get(`/api/arrows/${arrowId}/scores`);
    return response.data;
  }
  
  static async addScore(arrowId, score) {
    const response = await axios.post(`/api/arrows/${arrowId}/scores`, { score });
    return response.data;
  }
  
  static async deleteScore(scoreId) {
    const response = await axios.delete(`/api/arrows/scores/${scoreId}`);
    return response.data;
  }
}
