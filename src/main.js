import "./style.css";
import "./firebase.js";

const app = document.getElementById("app");

app.innerHTML = `
  <main class="app">
    <div class="logo">TRUSTED <span>OP</span></div>

    <section class="auth-card">
      <h1>Welcome to Trusted OP</h1>
      <p>Secure Gaming Tournament Platform</p>

      <div class="auth-tabs">
        <button class="active">Email</button>
        <button>Mobile OTP</button>
      </div>

      <div class="form">
        <input
          type="email"
          placeholder="Enter email"
          autocomplete="email"
        />

        <input
          type="password"
          placeholder="Enter password"
          autocomplete="current-password"
        />

        <button class="primary-btn">
          Login
        </button>

        <p class="signup-text">
          Don't have an account?
          <button class="link-btn">Create Account</button>
        </p>
      </div>
    </section>
  </main>
`;
