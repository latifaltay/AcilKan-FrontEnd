import api from './api';

class BloodRequestService {
  async createBloodRequest(requestData: any) {
    try {
      const response = await api.post('/BloodRequest/CreateBloodRequest', requestData);
      return response.data;
    } catch (error) {
      console.error('Error creating blood request:', error);
      throw error;
    }
  }

  async getAllBloodRequests() {
    try {
      const response = await api.get('/BloodRequest/GetAllBloodRequest');
      return response.data;
    } catch (error) {
      console.error('Error fetching blood requests:', error);
      throw error;
    }
  }
}

export const bloodRequestService = new BloodRequestService();