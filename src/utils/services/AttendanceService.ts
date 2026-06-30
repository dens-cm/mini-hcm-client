import axios from 'axios'
import { ApiService } from '@/utils/services/ApiService'

class AttendanceService extends ApiService {
    async punch(type: 'in' | 'out') {
        const headers = await this.getHeaders()
        const response = await axios.post(`${this.baseUrl}/attendance/punch`, { type }, { headers })
        return response.data
    }

    async getMySummaries() {
        const headers = await this.getHeaders()
        const response = await axios.get(`${this.baseUrl}/summary/my-summaries`, { headers })
        return response.data
    }
}

export const attendanceService = new AttendanceService()
