import axios from 'axios'
import { ApiService } from '@/utils/services/ApiService'
import { auth } from '@/utils/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import type { UserProfile } from '@/hooks/AuthContext'
import { Role } from '@/utils/constants'
import type { RoleType } from '@/utils/constants'

type Schedule = NonNullable<UserProfile['schedule']>

class AuthService extends ApiService {
    public isRegistering = false

    async register(email: string, password: string, name: string, role: RoleType, timezone: string, schedule: Schedule) {
        this.isRegistering = true
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            const headers = await this.getHeaders()
            const response = await axios.post(`${this.baseUrl}/users/profile`, {
                name, email, role, timezone, schedule
            }, { headers })
            
            return response.data
        } finally {
            this.isRegistering = false
        }
    }

    async updateProfile(name: string, timezone: string, schedule: Schedule) {
        const headers = await this.getHeaders()
        const currentUser = auth.currentUser
        if (!currentUser) throw new Error("No authenticated user")
        
        const response = await axios.post(`${this.baseUrl}/users/profile`, {
            name, 
            email: currentUser.email, 
            role: Role.EMPLOYEE, 
            timezone, 
            schedule
        }, { headers })
        
        return response.data
    }

    async login(email: string, password: string) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        return userCredential.user
    }

    async logout() {
        await signOut(auth)
    }

    async getMyProfile() {
        const headers = await this.getHeaders()
        const response = await axios.get(`${this.baseUrl}/users/me`, { headers })
        return response.data
    }
}

export const authService = new AuthService()
