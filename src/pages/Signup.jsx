import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth, provider } from '../firebase';
import { FcGoogle } from 'react-icons/fc';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Set the username in Firebase user profile
      await updateProfile(userCredential.user, {
        displayName: username.trim(),
      });

      alert('✅ Sign up successful! Please log in.');
      navigate('/login');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert('✅ Signed up with Google!');
      navigate('/home');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAdminSignup = () => {
    navigate('/admin');
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup} className="signup-form">
        <h2 className="signup-title">Create Account</h2>
        
        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            pattern=".{6,}"
            title="Password must be at least 6 characters long"
            required
          />
        </div>

        <button type="submit" className="signup-btn">
          Sign Up
        </button>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <button type="button" className="google-btn" onClick={handleGoogleSignup}>
          <FcGoogle size={20} />
          Sign Up with Google
        </button>

        <button type="button" className="admin-btn" onClick={handleAdminSignup}>
          Sign Up as Admin
        </button>

        <p className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
