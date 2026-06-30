import { auth } from '@/utils/firebase'

export class ApiService {
    protected baseUrl = 'http://localhost:3000'

    protected async getHeaders() {
        const user = auth.currentUser
        if (!user) {
            throw new Error('Not authenticated')
        }
        const token = await user.getIdToken()
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
}
