import './App.css'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import LandingPage from './pages/LandingPage.jsx'
import Authentication from './pages/authentication.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import VedioComponent from './pages/VedioCall.jsx'
import HomeComponent from './pages/homePage.jsx'
import AddMeeting from './pages/addmeeting.jsx'
import PracticeCoding from './Practice_Coding/practiceCoding.jsx'
import JoinMeeting from './pages/joinMeeting.jsx'
import History from './pages/history.jsx'


function App() {

  return (
    <div>

      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/home" element={<HomeComponent />} />
            <Route path="/addmeeting" element={<AddMeeting />} />
            <Route path="/joinmeeting" element={<JoinMeeting />} />
            <Route path='practicecode' element={<PracticeCoding />} />
            <Route path='history' element={<History />} />
            <Route path="/:url" element={<VedioComponent />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  )
}

export default App
