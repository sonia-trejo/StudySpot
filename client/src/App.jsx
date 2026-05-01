import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Results from './pages/Results'
import Location from './pages/Location'
import Review from './pages/Review'
import Moderation from './pages/Moderation'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/location/:id" element={<Location />} />
            <Route path="/review" element={<Review />} />
            <Route path="/moderation" element={<Moderation />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
