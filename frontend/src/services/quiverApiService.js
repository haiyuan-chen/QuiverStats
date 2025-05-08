import axios from 'axios';

const API_BASE_URL = '/api';

// Quiver endpoints
export const fetchQuivers = () => axios.get(`${API_BASE_URL}/quivers`);
export const createQuiver = (quiverData) => axios.post(`${API_BASE_URL}/quivers`, quiverData);
export const updateQuiver = (quiverId, quiverData) => axios.put(`${API_BASE_URL}/quivers/${quiverId}`, quiverData);
export const deleteQuiver = (quiverId) => axios.delete(`${API_BASE_URL}/quivers/${quiverId}`);

// Arrow endpoints
export const fetchArrows = (quiverId) => axios.get(`${API_BASE_URL}/quivers/${quiverId}/arrows`);
export const createArrow = (quiverId, arrowData) => axios.post(`${API_BASE_URL}/quivers/${quiverId}/arrows`, arrowData);
export const updateArrow = (arrowId, arrowData) => axios.put(`${API_BASE_URL}/arrows/${arrowId}`, arrowData); // Assuming a general /arrows/:arrowId endpoint for updates
export const deleteArrow = (arrowId) => axios.delete(`${API_BASE_URL}/arrows/${arrowId}`); // Assuming a general /arrows/:arrowId endpoint for deletes

// Score endpoints
export const fetchScoresForArrow = (arrowId) => axios.get(`${API_BASE_URL}/arrows/${arrowId}/scores`);
// Ensure scoreData matches the new structure: { value, x, y, sequence }
export const addScoreToArrow = (arrowId, scoreData) => axios.post(`${API_BASE_URL}/arrows/${arrowId}/scores`, scoreData);
// Assuming score IDs are unique and can be deleted directly.
// If scores are sub-resources of arrows for deletion as well, adjust the endpoint.
export const deleteScoreEntry = (scoreId) => axios.delete(`${API_BASE_URL}/scores/${scoreId}`);
