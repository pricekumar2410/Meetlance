import './App.css'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import LandingPage from './pages/LandingPage.jsx'
import Authentication from './pages/authentication.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import VedioComponent from './pages/VedioCall.jsx'
import HomeComponent from './pages/home.jsx'
import AddMeeting from './pages/addMeeting.jsx'

function App() {

  return (
    <div>

      <Router>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/auth' element={<Authentication />} />
            <Route path='/:url' element={<VedioComponent />} />
          </Routes>
        </AuthProvider>
      </Router>

    </div>
  )
}

export default App
