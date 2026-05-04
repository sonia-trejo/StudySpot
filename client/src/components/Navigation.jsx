import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { authService } from '../services/auth'

const Navigation = () => {
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  
  useEffect(() => {
    // Check current auth state
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
        setIsLoggedIn(!!currentUser)
      } catch (error) {
        console.error('Error checking auth state:', error)
      }
    }
    
    checkAuth()
    
    // Listen to auth changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setIsLoggedIn(!!session?.user)
    })
    
    return () => subscription.unsubscribe()
  }, [])
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')
    
    try {
      setAuthLoading(true)
      setAuthError('')
      await authService.signIn(email, password)
      setShowLoginModal(false)
      setIsSignUpMode(false)
    } catch (error) {
      setAuthError(error.message || 'Login failed. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')
    
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match')
      return
    }
    
    try {
      setAuthLoading(true)
      setAuthError('')
      await authService.signUp(email, password)
      setAuthError('Check your email to confirm your account')
      setIsSignUpMode(false)
    } catch (error) {
      setAuthError(error.message || 'Sign up failed. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  const toggleAuthMode = () => {
    setIsSignUpMode(!isSignUpMode)
  }

  const handleLogout = async () => {
    try {
      await authService.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
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
              <span className="user-name">👤 {user?.email || 'User'}</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            (location.pathname === '/review' || location.pathname === '/moderation') && (
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
              {authError && (
                <div className="auth-error">
                  {authError}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  disabled={authLoading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  disabled={authLoading}
                />
              </div>
              
              {isSignUpMode && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    required
                    disabled={authLoading}
                  />
                </div>
              )}
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={authLoading}>
                  {authLoading ? 'Loading...' : (isSignUpMode ? 'Sign Up' : 'Login')}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowLoginModal(false)
                    setIsSignUpMode(false)
                    setAuthError('')
                  }}
                  disabled={authLoading}
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
                  onClick={() => {
                    setIsSignUpMode(!isSignUpMode)
                    setAuthError('')
                  }}
                  disabled={authLoading}
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
