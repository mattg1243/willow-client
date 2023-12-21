import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// pages
import { 
  SplashPage, 
  LoginPage, 
  RegisterPage, 
  ProfilePage, 
  Dashboard, 
  ClientPage,
  ResetPasswordPage 
} from './components/pages';
// components
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/home' element={<SplashPage />} />
          <Route path='/' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/resetpassword/:token/:username' element={<ResetPasswordPage />} />
          {/* All routes below are priveleged and need to be wrapped in a PrivateRoutes component */}
          <Route path='/profile' element={<ProtectedRoute />}>
            <ProfilePage />
          </Route>
          <Route path='/clients' element={<ProtectedRoute />}>
            <Dashboard />
          </Route>
          <Route path='/client-archive' element={<ProtectedRoute />} >
            <Dashboard archiveMode={true} />
          </Route>
          <Route path='/client/:id' element={<ProtectedRoute />} >
            <ClientPage />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
