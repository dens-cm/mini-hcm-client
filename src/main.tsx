import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "@/components/ui/provider"
import { Toaster } from "@/components/ui/toaster"
import Router from '@/routes/Router'
import { PingServer } from '@/hooks/PingServer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <Toaster />
      <PingServer />
      <Router />
    </Provider>
  </StrictMode>
)
