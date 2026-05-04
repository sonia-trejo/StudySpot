import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const Navigation = () => {
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    // Mock login - in real app would authenticate
    setIsLoggedIn(true)
    setShowLoginModal(false)
    setIsSignUpMode(false)
  }

  const handleSignUp = (e) => {
    e.preventDefault()
    // Mock sign up - in real app would register user
    setIsLoggedIn(true)
    setShowLoginModal(false)
    setIsSignUpMode(false)
  }

  const toggleAuthMode = () => {
    setIsSignUpMode(!isSignUpMode)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <>
      <nav className="main-navigation">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            📚 StudySpot
          </Link>
        </div>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/results" 
            className={`nav-link ${isActive('/results') ? 'active' : ''}`}
          >
            Results
          </Link>
          <Link 
            to="/review" 
            className={`nav-link ${isActive('/review') ? 'active' : ''}`}
          >
            Review
          </Link>
          <Link 
            to="/moderation" 
            className={`nav-link ${isActive('/moderation') ? 'active' : ''}`}
          >
            Moderation
          </Link>
        </div>

        <div className="nav-auth">
          {isLoggedIn ? (
            <div className="user-menu">
              <span className="user-name">👤 User</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            location.pathname === '/review' && (
              <button 
                className="btn btn-primary" 
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </button>
            )
          )}
        </div>
      </nav>

      {showLoginModal && (
        <div className="login-modal">
          <div className="login-content">
            <div className="login-header">
              <h2>{isSignUpMode ? 'Sign up for StudySpot' : 'Login to StudySpot'}</h2>
              <button 
                className="close-btn" 
                onClick={() => {
                  setShowLoginModal(false)
                  setIsSignUpMode(false)
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={isSignUpMode ? handleSignUp : handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              {isSignUpMode && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {isSignUpMode ? 'Sign Up' : 'Login'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowLoginModal(false)
                    setIsSignUpMode(false)
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
            
            <div className="login-footer">
              <p>
                {isSignUpMode ? 'Already have an account?' : "Don't have an account?"} 
                <button 
                  type="button"
                  className="link-btn" 
                  onClick={toggleAuthMode}
                >
                  {isSignUpMode ? 'Login' : 'Sign up'}
                </button>
              </p>
              <p><button className="link-btn">Forgot password?</button></p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navigation
