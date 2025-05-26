import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./SignUpForm.css";
import { useRegisterUserMutation } from "../features/authApi";

const SignUpForm = ({ onRegister }) => {
  const [form, setForm] = useState({ username: "", email: "", password: "", repeat: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [registerUser] = useRegisterUserMutation();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.repeat) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data } = await registerUser({ username: form.username, email: form.email, password: form.password }).unwrap();
      localStorage.setItem("token", data.user.token);
      if (onRegister) onRegister(data.user);
      history.push("/");
    } catch (err) {
      setError(err.data?.errors?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-bg">
      <div className="signup-form-wrapper">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2 className="signup-title">Create new account</h2>
          <label>
            <span>Username</span>
            <input name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange} required />
          </label>
          <label>
            <span>Email address</span>
            <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          </label>
          <label>
            <span>Repeat Password</span>
            <input name="repeat" type="password" placeholder="Password" value={form.repeat} onChange={handleChange} required />
          </label>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            <span>
              I agree to the processing of my personal information
            </span>
          </label>
          <button className="create-btn" type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
          {error && <div className="error-message">{error}</div>}
          <div className="signin-link">
            Already have an account?{' '}
            <span className="signin-link-text" onClick={() => history.push('/sign-in')}>
              Sign In.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm; 