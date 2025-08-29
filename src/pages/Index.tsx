import { useState } from "react"
import SplashScreen from "@/components/SplashScreen"
import Dashboard from "@/components/Dashboard"
import ComplaintRegistration from "@/components/ComplaintRegistration"
import ComplaintTracking from "@/components/ComplaintTracking"
import HelplineNumbers from "@/components/HelplineNumbers"
import AdminPortal from "@/components/AdminPortal"

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<string>('splash')

  const handleNavigation = (screen: string) => {
    setCurrentScreen(screen)
  }

  const handleBack = () => {
    if (currentScreen === 'complaint' || currentScreen === 'tracking' || currentScreen === 'helpline') {
      setCurrentScreen('dashboard')
    } else {
      setCurrentScreen('splash')
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onNavigate={handleNavigation} />
      
      case 'login':
      case 'signup':
        // For now, simulate successful login and go to dashboard
        setTimeout(() => setCurrentScreen('dashboard'), 100)
        return <SplashScreen onNavigate={handleNavigation} />
      
      case 'dashboard':
        return <Dashboard onBack={handleBack} onNavigate={handleNavigation} />
      
      case 'complaint':
        return <ComplaintRegistration onBack={handleBack} />
      
      case 'tracking':
        return <ComplaintTracking onBack={handleBack} />
      
      case 'helpline':
        return <HelplineNumbers onBack={handleBack} />
      
      case 'admin':
        return <AdminPortal onBack={handleBack} />
      
      default:
        return <SplashScreen onNavigate={handleNavigation} />
    }
  }

  return (
    <div className="min-h-screen">
      {renderScreen()}
    </div>
  )
}

export default Index