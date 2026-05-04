// Simple API test utility
import apiService from '../services/api';

export const testAPIConnection = async () => {
  try {
    console.log('Testing API connection...');
    console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
    
    const response = await apiService.getStudySpots();
    console.log('API Response:', response);
    
    if (response && response.study_spots) {
      console.log(`✅ API working! Found ${response.study_spots.length} study spots`);
      return true;
    } else {
      console.log('❌ API returned unexpected response format');
      return false;
    }
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return false;
  }
};
