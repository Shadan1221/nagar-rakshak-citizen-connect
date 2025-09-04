import { useState } from "react"
import SplashScreen from "@/components/SplashScreen"
import Dashboard from "@/components/Dashboard"
import ComplaintRegistration from "@/components/ComplaintRegistration"
import ComplaintTracking from "@/components/ComplaintTracking"
import HelplineNumbers from "@/components/HelplineNumbers"
import AdminPortal from "@/components/AdminPortal"
import AuthLogin from "@/components/AuthLogin"
import AuthSignup from "@/components/AuthSignup"

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<string>('splash')
  const [userRole, setUserRole] = useState<string>('')

  const handleNavigation = (screen: string) => {
    setCurrentScreen(screen)
  }

  const handleBack = () => {
    if (currentScreen === 'complaint' || currentScreen === 'tracking' || currentScreen === 'helpline') {
      setCurrentScreen('dashboard')
    } else if (currentScreen === 'auth-login' || currentScreen === 'auth-signup') {
      setCurrentScreen('splash')
    } else {
      setCurrentScreen('splash')
    }
  }

  const handleAuthSuccess = (role: string) => {
    setUserRole(role)
    if (role === 'admin') {
      setCurrentScreen('admin')
    } else {
      setCurrentScreen('dashboard')
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onNavigate={handleNavigation} />
      
      case 'login':
        return (
          <AuthLogin 
            onBack={handleBack} 
            onSuccess={handleAuthSuccess}
            onNavigateToSignup={() => setCurrentScreen('signup')}
          />
        )
      
      case 'signup':
        return (
          <AuthSignup 
            onBack={handleBack}
            onSuccess={() => setCurrentScreen('login')}
          />
        )
      
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