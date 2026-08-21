import { useState } from "react";

function AuthModal({ onClose, onSubmit }) {
  const [mode, setMode] = useState("signin");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const resetFields = () => {
    setUsername("");
    setEmail("");
    setIdentifier("");
    setPassword("");
  };

  const handleSubmit = () => {
    if (mode === "register") {
      onSubmit({
        mode,
        username: username.trim(),
        email: email.trim() || null,
        password,
      });
    } else {
      onSubmit({
        mode,
        identifier: identifier.trim(),
        password,
      });
    }
  };

  const switchMode = () => {
    setMode((prev) => (prev === "signin" ? "register" : "signin"));
    resetFields();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl border border-[#344d3b] bg-[#22352a] p-5 shadow-xl">
        <div className="relative mb-4">
          <h3 className="text-center text-lg font-bold text-[#f5e8c8]">
            {mode === "signin" ? "Sign In Account" : "Create Account"}
          </h3>

          <button
            onClick={onClose}
            className="absolute right-0 top-0 rounded-lg px-3 py-2 text-sm text-[#b6c8a5] hover:text-white"
          >
            ✕
          </button>
        </div>

        {mode === "register" ? (
          <>
            <label className="mb-2 block text-sm text-[#b6c8a5]">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="mb-3 w-full rounded-lg border border-[#49634d] bg-[#2b4234] px-3 py-2 text-sm text-[#f5e8c8] outline-none"
            />

            <label className="mb-2 block text-sm text-[#b6c8a5]">
              Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mb-3 w-full rounded-lg border border-[#49634d] bg-[#2b4234] px-3 py-2 text-sm text-[#f5e8c8] outline-none"
            />

            <label className="mb-2 block text-sm text-[#b6c8a5]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mb-4 w-full rounded-lg border border-[#49634d] bg-[#2b4234] px-3 py-2 text-sm text-[#f5e8c8] outline-none"
            />
          </>
        ) : (
          <>
            <label className="mb-2 block text-sm text-[#b6c8a5]">
              Username or Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Username or Email"
              className="mb-3 w-full rounded-lg border border-[#49634d] bg-[#2b4234] px-3 py-2 text-sm text-[#f5e8c8] outline-none"
            />

            <label className="mb-2 block text-sm text-[#b6c8a5]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mb-4 w-full rounded-lg border border-[#49634d] bg-[#2b4234] px-3 py-2 text-sm text-[#f5e8c8] outline-none"
            />
          </>
        )}

        <button
          onClick={handleSubmit}
          className="w-full rounded-lg bg-[#7fa36a] py-2 text-sm text-[#f5e8c8] hover:bg-[#91b878]"
        >
          {mode === "signin" ? "Sign In" : "Register"}
        </button>

        <div className="mt-4 flex w-full justify-center gap-1 text-xs text-[#89ad76]">
          <span>
            {mode === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>

          <button
            className="hover:cursor-pointer hover:underline"
            onClick={switchMode}
          >
            {mode === "signin" ? "Register" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;