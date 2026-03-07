import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password
      });

      console.log('Server response:', response.data);

      // Store user data in localStorage for the Dashboard
      localStorage.setItem('userName', response.data.name);
      localStorage.setItem('userEmail', response.data.email);

      navigate('/dashboard');

    } catch (err) {
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data.error) {
          setError(err.response.data.error + ': Please check your inputs.');
        } else {
          setError('Validation error or invalid request.');
        }
      } else {
        setError('Cannot connect to the server. Is Spring Boot running?');
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;900&family=DM+Mono:wght@400;500&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          overflow: hidden;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(5deg); }
          66% { transform: translateY(-10px) rotate(-5deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
      `}</style>
      
      <div style={styles.mainContainer}>
        {/* Left and Middle Section - Visual Design */}
        <div style={styles.leftSection}>
          {/* Background gradient overlay */}
          <div style={styles.gradientOverlay}></div>
          
          {/* Animated background circles */}
          <div style={{...styles.circle, ...styles.circle1}}></div>
          <div style={{...styles.circle, ...styles.circle2}}></div>
          <div style={{...styles.circle, ...styles.circle3}}></div>
          
          {/* Content */}
          <div style={styles.leftContent}>
            <div style={styles.logoSection}>
              <div style={styles.logoIcon}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M8 8L24 24L40 8M24 24L8 40M24 24L40 40" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  <circle cx="24" cy="24" r="20" stroke="white" strokeWidth="2.5" fill="none" opacity="0.3"/>
                </svg>
              </div>
              <h1 style={styles.logoText}>WorkFast</h1>
            </div>
            
            <div style={styles.heroSection}>
              <h2 style={styles.heroTitle}>
                Accelerate Your<br/>
                <span style={styles.heroGradient}>Productivity</span>
              </h2>
              <p style={styles.heroSubtitle}>
                Streamline workflows, collaborate seamlessly, and achieve more in less time. 
                Your ultimate workspace awaits.
              </p>
            </div>
            
            <div style={styles.featureGrid}>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>⚡</div>
                <div style={styles.featureText}>Lightning Fast</div>
              </div>
              <div style={{...styles.featureCard, animationDelay: '0.1s'}}>
                <div style={styles.featureIcon}>🔒</div>
                <div style={styles.featureText}>Secure & Private</div>
              </div>
              <div style={{...styles.featureCard, animationDelay: '0.2s'}}>
                <div style={styles.featureIcon}>🎯</div>
                <div style={styles.featureText}>Goal Focused</div>
              </div>
            </div>
            
            <div style={styles.statsSection}>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>50K+</div>
                <div style={styles.statLabel}>Active Users</div>
              </div>
              <div style={styles.statDivider}></div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>99.9%</div>
                <div style={styles.statLabel}>Uptime</div>
              </div>
              <div style={styles.statDivider}></div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>4.9★</div>
                <div style={styles.statLabel}>Rating</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Section - Login Form */}
        <div style={styles.rightSection}>
          <div style={styles.formContainer}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Welcome Back</h2>
              <p style={styles.formSubtitle}>Sign in to continue to your workspace</p>
            </div>
            
            {error && (
              <div style={styles.errorAlert}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{minWidth: '20px'}}>
                  <circle cx="10" cy="10" r="9" stroke="#dc2626" strokeWidth="2"/>
                  <path d="M10 6v4M10 13v1" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputContainer}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={styles.inputIcon}>
                    <path d="M3 6l7 5 7-5M3 6v8a1 1 0 001 1h12a1 1 0 001-1V6M3 6a1 1 0 011-1h12a1 1 0 011 1" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={styles.input}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputContainer}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={styles.inputIcon}>
                    <rect x="5" y="9" width="10" height="7" rx="1" stroke="#6b7280" strokeWidth="1.5"/>
                    <path d="M7 9V6a3 3 0 016 0v3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={styles.input}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div style={styles.formOptions}>
                <label style={styles.checkboxLabel}>
                  <input type="checkbox" style={styles.checkbox} />
                  <span style={styles.checkboxText}>Remember me</span>
                </label>
                <a href="/forgot-password" style={styles.forgotLink}>Forgot password?</a>
              </div>
              
              <button type="submit" style={styles.submitButton}>
                <span>Sign In</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 10h10M12 7l3 3-3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
            
            <div style={styles.divider}>
              <span style={styles.dividerText}>or continue with</span>
            </div>
            
            <div style={styles.socialButtons}>
              <button style={styles.socialButton}>
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path d="M18.2 10.2c0-.7-.1-1.4-.2-2H10v3.8h4.6c-.2 1-.8 1.9-1.7 2.5v2.1h2.7c1.6-1.5 2.6-3.7 2.6-6.4z" fill="#4285F4"/>
                  <path d="M10 18c2.3 0 4.2-.8 5.6-2.1l-2.7-2.1c-.8.5-1.8.8-2.9.8-2.2 0-4.1-1.5-4.8-3.5H2.4v2.2C3.8 15.8 6.7 18 10 18z" fill="#34A853"/>
                  <path d="M5.2 11.1c-.3-.9-.3-1.9 0-2.8V6.1H2.4c-1 2-1 4.3 0 6.3l2.8-1.3z" fill="#FBBC04"/>
                  <path d="M10 5.2c1.2 0 2.3.4 3.2 1.2l2.4-2.4C14.2 2.6 12.2 2 10 2 6.7 2 3.8 4.2 2.4 7.3l2.8 2.2C5.9 6.7 7.8 5.2 10 5.2z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>
              <button style={styles.socialButton}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#1877F2">
                  <path d="M18 10c0-4.4-3.6-8-8-8s-8 3.6-8 8c0 4 2.9 7.3 6.7 7.9v-5.6H6.9V10h1.8V8.3c0-1.8 1.1-2.8 2.7-2.8.8 0 1.6.1 1.6.1v1.8h-.9c-.9 0-1.2.6-1.2 1.1V10h2l-.3 2.3h-1.7v5.6c3.8-.6 6.7-3.9 6.7-7.9z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>
            
            <p style={styles.signupText}>
              Don't have an account? <a href="/register" style={styles.signupLink}>Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  mainContainer: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    fontFamily: "'Outfit', sans-serif",
    overflow: 'hidden',
  },
  
  // LEFT SECTION STYLES
  leftSection: {
    flex: '1 1 65%',
    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  
  circle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    animation: 'float 8s ease-in-out infinite',
  },
  
  circle1: {
    width: '500px',
    height: '500px',
    top: '-150px',
    left: '-100px',
    animationDelay: '0s',
  },
  
  circle2: {
    width: '350px',
    height: '350px',
    bottom: '-100px',
    right: '10%',
    animationDelay: '2s',
  },
  
  circle3: {
    width: '250px',
    height: '250px',
    top: '40%',
    right: '-50px',
    animationDelay: '4s',
  },
  
  leftContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '600px',
    padding: '0 60px',
    animation: 'slideInLeft 0.8s ease-out',
  },
  
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '60px',
  },
  
  logoIcon: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
  },
  
  logoText: {
    fontSize: '42px',
    fontWeight: '900',
    color: 'white',
    letterSpacing: '-0.02em',
  },
  
  heroSection: {
    marginBottom: '50px',
  },
  
  heroTitle: {
    fontSize: '56px',
    fontWeight: '900',
    color: 'white',
    lineHeight: '1.1',
    marginBottom: '24px',
    letterSpacing: '-0.03em',
  },
  
  heroGradient: {
    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  
  heroSubtitle: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.7',
    fontWeight: '300',
  },
  
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '50px',
  },
  
  featureCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    animation: 'fadeIn 0.6s ease-out',
  },
  
  featureIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  
  featureText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  
  statsSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '30px 40px',
  },
  
  statItem: {
    textAlign: 'center',
  },
  
  statNumber: {
    fontSize: '32px',
    fontWeight: '900',
    color: 'white',
    marginBottom: '4px',
    fontFamily: "'DM Mono', monospace",
  },
  
  statLabel: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
  },
  
  statDivider: {
    width: '1px',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.2)',
  },
  
  // RIGHT SECTION STYLES
  rightSection: {
    flex: '0 0 35%',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    minWidth: '480px',
  },
  
  formContainer: {
    width: '100%',
    maxWidth: '400px',
    animation: 'slideInRight 0.8s ease-out',
  },
  
  formHeader: {
    marginBottom: '40px',
  },
  
  formTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  
  formSubtitle: {
    fontSize: '15px',
    color: '#64748B',
    fontWeight: '400',
  },
  
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FEE2E2',
    border: '1px solid #FCA5A5',
    borderRadius: '12px',
    padding: '14px 16px',
    marginBottom: '24px',
    fontSize: '14px',
    color: '#991B1B',
    animation: 'fadeIn 0.3s ease-out',
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1E293B',
    letterSpacing: '0.01em',
  },
  
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  
  inputIcon: {
    position: 'absolute',
    left: '16px',
    pointerEvents: 'none',
  },
  
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    fontSize: '15px',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: "'Outfit', sans-serif",
    backgroundColor: '#F8FAFC',
    color: '#1E293B',
  },
  
  formOptions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '-8px',
  },
  
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#3B82F6',
  },
  
  checkboxText: {
    fontSize: '14px',
    color: '#475569',
    fontWeight: '500',
  },
  
  forgotLink: {
    fontSize: '14px',
    color: '#3B82F6',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s ease',
  },
  
  submitButton: {
    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
    marginTop: '8px',
    fontFamily: "'Outfit', sans-serif",
  },
  
  divider: {
    position: 'relative',
    textAlign: 'center',
    margin: '32px 0',
  },
  
  dividerText: {
    background: 'white',
    padding: '0 16px',
    fontSize: '13px',
    color: '#94A3B8',
    fontWeight: '500',
    position: 'relative',
    zIndex: 1,
  },
  
  socialButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '32px',
  },
  
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    background: 'white',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Outfit', sans-serif",
  },
  
  signupText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#64748B',
  },
  
  signupLink: {
    color: '#3B82F6',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s ease',
  },
};

// Add hover effects via inline style object
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .feature-card:hover {
      transform: translateY(-4px);
      background: rgba(255, 255, 255, 0.08) !important;
      border-color: rgba(255, 255, 255, 0.2) !important;
    }
    
    input:focus {
      border-color: #3B82F6 !important;
      background: white !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }
    
    .submit-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4) !important;
    }
    
    .submit-button:active {
      transform: translateY(0);
    }
    
    .forgot-link:hover {
      color: #2563EB !important;
    }
    
    .social-button:hover {
      border-color: #CBD5E1 !important;
      background: #F8FAFC !important;
    }
    
    .signup-link:hover {
      color: #2563EB !important;
    }
    
    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #E2E8F0;
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Login;