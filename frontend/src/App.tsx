import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Create from './pages/Create'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Signup from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/criar" element={<Create />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
