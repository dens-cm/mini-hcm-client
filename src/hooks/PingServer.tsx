import { useEffect } from 'react'

export const PingServer = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const apiUrl = import.meta.env.VITE_API_URL
      fetch(`${apiUrl}/ping`).catch(console.error)
    }, 120000) // 2 minutes
    return () => clearInterval(interval)
  }, [])
  return null
}
