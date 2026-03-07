import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        name: name,
        email: email,
        password: password
      });

      setSuccess(response.data);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

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
        
        @keyframes checkmark {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
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
                Join Thousands of<br/>
                <span style={styles.heroGradient}>Productive Teams</span>
              </h2>
              <p style={styles.heroSubtitle}>
                Start your journey to better productivity. Create your account in seconds 
                and unlock powerful tools designed for modern teams.
              </p>
            </div>
            
            <div style={styles.benefitsList}>
              <div style={styles.benefitItem}>
                <div style={styles.checkCircle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={styles.benefitText}>
                  <div style={styles.benefitTitle}>Free to start</div>
                  <div style={styles.benefitDesc}>No credit card required</div>
                </div>
              </div>
              
              <div style={{...styles.benefitItem, animationDelay: '0.1s'}}>
                <div style={styles.checkCircle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={styles.benefitText}>
                  <div style={styles.benefitTitle}>Setup in minutes</div>
                  <div style={styles.benefitDesc}>Get started immediately</div>
                </div>
              </div>
              
              <div style={{...styles.benefitItem, animationDelay: '0.2s'}}>
                <div style={styles.checkCircle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={styles.benefitText}>
                  <div style={styles.benefitTitle}>Cancel anytime</div>
                  <div style={styles.benefitDesc}>No long-term commitment</div>
                </div>
              </div>
              
              <div style={{...styles.benefitItem, animationDelay: '0.3s'}}>
                <div style={styles.checkCircle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={styles.benefitText}>
                  <div style={styles.benefitTitle}>24/7 support</div>
                  <div style={styles.benefitDesc}>We're here to help</div>
                </div>
              </div>
            </div>
            
            <div style={styles.testimonialCard}>
              <div style={styles.quoteIcon}>"</div>
              <p style={styles.testimonialText}>
                WorkFast transformed how our team collaborates. We've seen a 40% 
                increase in productivity since switching.
              </p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.authorAvatar}>JD</div>
                <div>
                  <div style={styles.authorName}>Jessica Davis</div>
                  <div style={styles.authorRole}>Product Manager, TechCorp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Section - Register Form */}
        <div style={styles.rightSection}>
          <div style={styles.formContainer}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Create Account</h2>
              <p style={styles.formSubtitle}>Start your productivity journey today</p>
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
            
            {success && (
              <div style={styles.successAlert}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{minWidth: '20px'}}>
                  <circle cx="10" cy="10" r="9" stroke="#10B981" strokeWidth="2"/>
                  <path d="M6 10l3 3 5-6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{success}</span>
              </div>
            )}
            
            <form onSubmit={handleRegister} style={styles.form}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Full Name</label>
                <div style={styles.inputContainer}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={styles.inputIcon}>
                    <path d="M10 10a4 4 0 100-8 4 4 0 000 8zM3 18a7 7 0 0114 0" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    style={styles.input}
                    placeholder="John Doe"
                  />
                </div>
              </div>
              
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
              
              <div style={styles.passwordHint}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#94A3B8" strokeWidth="1.5"/>
                  <path d="M8 5v3M8 11v1" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span style={styles.hintText}>Password must be at least 8 characters</span>
              </div>
              
              <label style={styles.termsLabel}>
                <input type="checkbox" required style={styles.checkbox} />
                <span style={styles.termsText}>
                  I agree to the <a href="/terms" style={styles.link}>Terms of Service</a> and{' '}
                  <a href="/privacy" style={styles.link}>Privacy Policy</a>
                </span>
              </label>
              
              <button type="submit" style={styles.submitButton}>
                <span>Create Account</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 10h10M12 7l3 3-3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
            
            <div style={styles.divider}>
              <span style={styles.dividerText}>or sign up with</span>
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
              Already have an account? <a href="/login" style={styles.signupLink}>Sign in</a>
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
    marginBottom: '50px',
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
    marginBottom: '40px',
  },
  
  heroTitle: {
    fontSize: '52px',
    fontWeight: '900',
    color: 'white',
    lineHeight: '1.1',
    marginBottom: '20px',
    letterSpacing: '-0.03em',
  },
  
  heroGradient: {
    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  
  heroSubtitle: {
    fontSize: '17px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.7',
    fontWeight: '300',
  },
  
  benefitsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '40px',
  },
  
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    animation: 'fadeIn 0.6s ease-out',
  },
  
  checkCircle: {
    width: '48px',
    height: '48px',
    minWidth: '48px',
    background: 'rgba(16, 185, 129, 0.15)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(16, 185, 129, 0.3)',
  },
  
  benefitText: {
    flex: 1,
  },
  
  benefitTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '2px',
  },
  
  benefitDesc: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  
  testimonialCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '28px',
    position: 'relative',
  },
  
  quoteIcon: {
    fontSize: '64px',
    fontWeight: '900',
    color: 'rgba(59, 130, 246, 0.3)',
    lineHeight: '1',
    marginBottom: '12px',
    fontFamily: 'Georgia, serif',
  },
  
  testimonialText: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: '1.7',
    marginBottom: '20px',
    fontStyle: 'italic',
  },
  
  testimonialAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  
  authorAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
    color: 'white',
  },
  
  authorName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'white',
  },
  
  authorRole: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.6)',
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
    overflowY: 'auto',
  },
  
  formContainer: {
    width: '100%',
    maxWidth: '400px',
    animation: 'slideInRight 0.8s ease-out',
  },
  
  formHeader: {
    marginBottom: '32px',
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
  
  successAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#D1FAE5',
    border: '1px solid #6EE7B7',
    borderRadius: '12px',
    padding: '14px 16px',
    marginBottom: '24px',
    fontSize: '14px',
    color: '#065F46',
    animation: 'fadeIn 0.3s ease-out',
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
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
  
  passwordHint: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '-8px',
  },
  
  hintText: {
    fontSize: '13px',
    color: '#64748B',
  },
  
  termsLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    cursor: 'pointer',
    marginTop: '4px',
  },
  
  checkbox: {
    width: '18px',
    height: '18px',
    marginTop: '2px',
    cursor: 'pointer',
    accentColor: '#3B82F6',
    minWidth: '18px',
  },
  
  termsText: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.5',
  },
  
  link: {
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
    margin: '28px 0',
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
    marginBottom: '28px',
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
    
    .social-button:hover {
      border-color: #CBD5E1 !important;
      background: #F8FAFC !important;
    }
    
    .signup-link:hover, .link:hover {
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

export default Register;