import './App.css'
import { Toaster } from 'react-hot-toast';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import ExplorePage from './pages/Explore/ExplorePage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import MessagesPage from './pages/Messages/MessagesPage';
import ProfilePage from './pages/Profile/ProfilePage';
import TicketDetailPage from './pages/Ticket/TicketDetailPage';
import AuthCallbackPage from './pages/auth-callback/AuthCallbackPage';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

import AuthSync from './components/AuthSync';

function App() {
  return (
    <>
      <AuthSync />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d0d1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
      <Routes>
        <Route path='/' element={<HomePage />} /> 
        <Route path='/explore' element={<ExplorePage />} />
        <Route path='/notifications' element={<NotificationsPage />} />
        <Route path='/messages' element={<MessagesPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/profile/:id' element={<ProfilePage />} />
        <Route path='/ticket/:id' element={<TicketDetailPage />} />
        
        <Route path='/sso-callback' 
        element={<AuthenticateWithRedirectCallback  signInForceRedirectUrl={'/auth-callback'}/>} />
        <Route path='/auth-callback' element={<AuthCallbackPage />} />
      </Routes>
    </>
  )
}

export default App