/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { type User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/utils/firebase'
import { authService } from '@/utils/services/AuthService'
import type { RoleType } from '@/utils/constants'
import { Flex, Spinner } from '@chakra-ui/react'

export interface UserProfile {
  name: string
  email: string
  role: RoleType
  timezone: string
  schedule?: {
    start: string
    end: string
  }
}

interface AuthContextType {
  currentUser: User | null
  userProfile: UserProfile | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, userProfile: null, loading: true, refreshProfile: async () => {} })

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    if (auth.currentUser) {
      try {
        setCurrentUser(auth.currentUser)
        const profile = await authService.getMyProfile()
        setUserProfile(profile.data)
      } catch (error) {
        console.error("Error fetching user profile", error)
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (authService.isRegistering) {
        return
      }

      setLoading(true)
      setCurrentUser(user)
      if (user) {
        try {
          const profile = await authService.getMyProfile()
          setUserProfile(profile.data)
        } catch (error) {
          console.error("Error fetching user profile", error)
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, refreshProfile }}>
      {loading ? (
        <Flex height="100vh" align="center" justify="center">
          <Spinner size="xl" />
        </Flex>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}
