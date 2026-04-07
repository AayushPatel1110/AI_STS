import './App.css'
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import ExplorePage from './pages/Explore/ExplorePage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import MessagesPage from './pages/Messages/MessagesPage';
import ProfilePage from './pages/Profile/ProfilePage';
import AuthCallbackPage from './pages/auth-callback/AuthCallbackPage';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

import AuthSync from './components/AuthSync';

function App() {
  return (
    <>
      <AuthSync />
      <Routes>
        <Route path='/' element={<HomePage />} /> 
        <Route path='/explore' element={<ExplorePage />} />
        <Route path='/notifications' element={<NotificationsPage />} />
        <Route path='/messages' element={<MessagesPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/profile/:id' element={<ProfilePage />} />
        
        <Route path='/sso-callback' 
        element={<AuthenticateWithRedirectCallback  signInForceRedirectUrl={'/auth-callback'}/>} />
        <Route path='/auth-callback' element={<AuthCallbackPage />} />
      </Routes>
    </>
  )
}

export default App