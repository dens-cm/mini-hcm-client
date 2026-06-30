import axios from 'axios'
import { ApiService } from '@/utils/services/ApiService'

class AdminService extends ApiService {
    async getAllSummaries() {
        const headers = await this.getHeaders()
        const response = await axios.get(`${this.baseUrl}/admin/all-summaries`, { headers })
        return response.data
    }

    async getAllPunches() {
        const headers = await this.getHeaders()
        const response = await axios.get(`${this.baseUrl}/admin/punches`, { headers })
        return response.data
    }

    async updatePunch(id: string, timestamp: string, type: 'in' | 'out') {
        const headers = await this.getHeaders()
        const response = await axios.put(`${this.baseUrl}/admin/punches/${id}`, { timestamp, type }, { headers })
        return response.data
    }

    async getAllUsers() {
        const headers = await this.getHeaders()
        const response = await axios.get(`${this.baseUrl}/users/all`, { headers })
        return response.data
    }

    async getWeeklyReports(startDate: string, endDate: string) {
        const headers = await this.getHeaders()
        const response = await axios.get(`${this.baseUrl}/admin/weekly-reports?startDate=${startDate}&endDate=${endDate}`, { headers })
        return response.data
    }
}

export const adminService = new AdminService()
