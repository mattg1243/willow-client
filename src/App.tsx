import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// pages
import {
  SplashPage,
  LoginPage,
  RegisterPage,
  ProfilePage,
  Dashboard,
  ClientPage,
  ResetPasswordPage,
} from './components/pages';
// components
import ProtectedRoute from './components/ProtectedRoute';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';

function App() {
  return (
    <div className="App">
      <ChakraProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/home" element={<SplashPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/resetpassword/:token/:username" element={<ResetPasswordPage />} />
            {/* All routes below are priveleged and need to be wrapped in a PrivateRoutes component */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/clients" element={<Dashboard archiveMode={false} />} />
              <Route path="/client/:id" element={<ClientPage />} />
              <Route path="/client-archive" element={<Dashboard archiveMode />} />
            </Route>
          </Routes>
        </Router>
      </ChakraProvider>
    </div>
  );
}

export default App;
