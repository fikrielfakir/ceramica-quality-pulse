// API service to replace Supabase client calls
const API_BASE_URL = '';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}/api${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: { email: string; password: string; fullName?: string; department?: string; role?: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Quality Tests
  async getQualityTests() {
    return this.request('/quality-tests');
  }

  async createQualityTest(testData: any) {
    return this.request('/quality-tests', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  }

  async updateQualityTest(id: string, testData: any) {
    return this.request(`/quality-tests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testData),
    });
  }

  // Production Lots
  async getProductionLots() {
    return this.request('/production-lots');
  }

  async createProductionLot(lotData: any) {
    return this.request('/production-lots', {
      method: 'POST',
      body: JSON.stringify(lotData),
    });
  }

  // Energy Consumption
  async getEnergyConsumption() {
    return this.request('/energy-consumption');
  }

  async createEnergyRecord(recordData: any) {
    return this.request('/energy-consumption', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  }

  // Waste Records
  async getWasteRecords() {
    return this.request('/waste-records');
  }

  async createWasteRecord(recordData: any) {
    return this.request('/waste-records', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  }

  // Compliance Documents
  async getComplianceDocuments() {
    return this.request('/compliance-documents');
  }

  async createComplianceDocument(documentData: any) {
    return this.request('/compliance-documents', {
      method: 'POST',
      body: JSON.stringify(documentData),
    });
  }

  // Testing Campaigns
  async getTestingCampaigns() {
    return this.request('/testing-campaigns');
  }

  async createTestingCampaign(campaignData: any) {
    return this.request('/testing-campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  }
}

export const apiService = new ApiService();