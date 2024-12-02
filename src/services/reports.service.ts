import axios from 'axios';

export const reportsService = {
  async getReportData() {
    try {
      const { data } = await axios.get('http://localhost:3001/api/reportes/estadisticas/dashboard');
      return data;
    } catch (error) {
      console.error('Error obteniendo datos de reportes:', error);
      throw error;
    }
  }
}; 