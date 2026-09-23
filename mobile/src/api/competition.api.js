import apiClient from './client';

export const competitionApi = {
  getCompetition: async (competitionId) => {
    const response = await apiClient.get(`/competitions/${competitionId}`);
    return response.data; // { competition, userState }
  },

  listCompetitions: async (params) => {
    const response = await apiClient.get('/competitions', { params });
    return response.data;
  },

  register: async (competitionId, data = {}) => {
    const response = await apiClient.post(`/competitions/${competitionId}/register`, data);
    return response.data;
  },

  getRegistration: async (competitionId) => {
    const response = await apiClient.get(`/competitions/${competitionId}/registration`);
    return response.data;
  },

  createSubmission: async (competitionId, submissionData) => {
    const response = await apiClient.post(`/competitions/${competitionId}/submissions`, submissionData);
    return response.data;
  },

  getMySubmission: async (competitionId) => {
    const response = await apiClient.get(`/competitions/${competitionId}/submissions/me`);
    return response.data;
  },

  getResults: async (competitionId) => {
    const response = await apiClient.get(`/competitions/${competitionId}/results`);
    return response.data;
  },

  getReviews: async (competitionId) => {
    const response = await apiClient.get(`/competitions/${competitionId}/reviews`);
    return response.data;
  },

  getServerTime: async () => {
    const response = await apiClient.get('/system/time');
    return response.data;
  },

  getReferral: async () => {
    const response = await apiClient.post('/system/referrals');
    return response.data;
  },

  setDevLifecycle: async (competitionId, targetLifecycle) => {
    const response = await apiClient.patch(`/system/dev-lifecycle/${competitionId}`, { targetLifecycle });
    return response.data;
  },

  resetDevPersona: async (email) => {
    const response = await apiClient.post('/system/dev-reset-persona', { email });
    return response.data;
  },
};
