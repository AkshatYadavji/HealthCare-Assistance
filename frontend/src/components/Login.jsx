import React, { useState } from 'react';
import api from '../api'; // Custom Axios courier bridge
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      
      // FIXED TYPO HERE: Changed formData.email to just email
      const nameToSave = res.data.user?.name || res.data.name || email.split('@')[0];
      localStorage.setItem('username', nameToSave);
      
      navigate('/chat');
    } catch (err) {
      console.log("Captured backend validation rejection:", err.response);
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    }
  };

  // MATTE BLACK & CHARCOAL GREY AESTHETIC STYLES
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column', // Stack header above the card vertically
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0a0a0c', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    },
    systemHeaderOutside: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '24px', 
      textAlign: 'center'
    },
    systemTitleOutside: {
      color: '#ffffff', 
      fontSize: '22px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      margin: 0
    },
    iconOutside: {
      width: '24px',
      height: '24px',
      color: '#9ca3af' 
    },
    card: {
      backgroundColor: '#16161a', 
      border: '1px solid #2a2a32', 
      borderRadius: '16px',
      padding: '40px',
      width: '100%',
      maxWidth: '420px',
      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8)',
      boxSizing: 'border-box'
    },
    title: {
      color: '#ffffff',
      fontSize: '24px',
      fontWeight: '700',
      textAlign: 'center',
      margin: '0 0 6px 0',
      letterSpacing: '-0.02em'
    },
    subtitle: {
      color: '#6b7280', 
      fontSize: '13px',
      textAlign: 'center',
      margin: '0 0 28px 0',
      lineHeight: '1.4'
    },
    errorBanner: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      color: '#ef4444',
      padding: '12px',
      borderRadius: '10px',
      fontSize: '13px',
      textAlign: 'center',
      marginBottom: '20px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '18px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    label: {
      color: '#9ca3af', 
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      paddingLeft: '2px'
    },
    input: {
      backgroundColor: '#0f0f12', 
      border: '1px solid #2a2a32',
      borderRadius: '10px',
      padding: '13px 16px',
      color: '#ffffff',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box'
    },
    button: {
      backgroundColor: isHovered ? '#ffffff' : '#f3f4f6', 
      color: '#0a0a0c', 
      border: 'none',
      borderRadius: '10px',
      padding: '14px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '8px',
      boxShadow: isHovered ? '0 0 20px rgba(255, 255, 255, 0.1)' : 'none'
    },
    footer: {
      textAlign: 'center',
      fontSize: '13px',
      color: '#6b7280',
      marginTop: '24px',
      marginBottom: '0'
    },
    link: {
      color: '#f3f4f6',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: '4px'
    }
  };

  return (
    <div style={styles.pageContainer}>
      
      {/* BRANDING HEADER OUTSIDE AND ABOVE THE FORM CARD */}
      <div style={styles.systemHeaderOutside}>
        <svg style={styles.iconOutside} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
        </svg>
        <h1 style={styles.systemTitleOutside}>Healthcare Assistant</h1>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Log in to access your secure medical assistant</p>
        
        {error && <div style={styles.errorBanner}>⚠️ {error}</div>}

        <form style={styles.form} onSubmit={onSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              placeholder="name@example.com"
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#4b5563'; 
                e.target.style.backgroundColor = '#121216';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#2a2a32';
                e.target.style.backgroundColor = '#0f0f12';
              }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              placeholder="••••••••"
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#4b5563';
                e.target.style.backgroundColor = '#121216';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#2a2a32';
                e.target.style.backgroundColor = '#0f0f12';
              }}
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Sign In
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;