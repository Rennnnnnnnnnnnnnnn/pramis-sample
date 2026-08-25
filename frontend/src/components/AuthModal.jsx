import { useState } from "react";

function AuthModal({ onClose, onSubmit }) {
  const [mode, setMode] = useState("signin");

  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const resetFields = () => {
    setUsername("");
    setEmail("");
    setIdentifier("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async () => {
    setError("");

    let result;

    if (mode === "register") {
      result = await onSubmit({
        mode,
        username: username.trim(),
        email: email.trim() || null,
        password,
      });

      if (result.success) {
        resetFields();
        setMode("success");
      } else {
        setError(result.message);
      }

    } else {
      result = await onSubmit({
        mode,
        identifier: identifier.trim(),
        password,
      });

      if (!result.success) {
        setError(result.message);
      }
    }
  };

  const switchMode = () => {
    setMode((prev) => (prev === "signin" ? "register" : "signin"));
    resetFields();
  };

  const continueToSignIn = () => {
    resetFields();
    setMode("signin");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl border border-[#344d3b] bg-[#22352a] p-5 shadow-xl">
        {/* SUCCESS MESSAGE */}
        {mode === "success" ? (
          <>
            <div className="py-6 text-center">
              <div className="mb-4 text-4xl">
                ✓
              </div>

              <h3 className="mb-2 text-lg font-bold text-[#f5e8c8]">
                Registration Successful
              </h3>

              <p className="text-sm text-[#b6c8a5]">
                Your account has been created successfully.
              </p>

              <p className="mt-1 text-sm text-[#b6c8a5]">
                Please sign in to continue.
              </p>
            </div>

            <button
              onClick={continueToSignIn}
              className="w-full rounded-lg bg-[#7fa36a] py-2 text-sm text-[#f5e8c8] hover:bg-[#91b878] cursor-pointer"
            >
              Continue to Sign In
            </button>

            <button
              onClick={onClose}
              className="mt-3 w-full py-2 text-xs text-[#89ad76] hover:underline"
            >
              Close
            </button>
          </>
        ) : (
          <>
            {/* HEADER */}
            <div className="relative mb-4">
              <h3 className="text-center text-lg font-bold text-[#f5e8c8]">
                {mode === "signin" ? "Sign In Account" : "Create Account"}
              </h3>

              <button
                onClick={onClose}
                className="absolute right-0 top-0 rounded-lg px-3 py-2 text-sm text-[#b6c8a5] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* REGISTER FORM */}
            {mode === "register" ? (
              <>
                <label className="mb-2 block text-sm text-[#b6c8a5]">
                  Username
                </label>

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

                <label className="mb-2 block text-sm text-[#b6c8a5]">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="mb-4 w-full rounded-lg border border-[#49634d] bg-[#2b4234] px-3 py-2 text-sm text-[#f5e8c8] outline-none"
                />
              </>
            ) : (
              /* SIGN IN FORM */
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

                <label className="mb-2 block text-sm text-[#b6c8a5]">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="mb-4 w-full rounded-lg border border-[#49634d] bg-[#2b4234] px-3 py-2 text-sm text-[#f5e8c8] outline-none"
                />
              </>
            )}
            {/* ERROR FIELD */}
            {error && (
              <p className="mb-3 text-center text-sm text-red-400">
                {error}
              </p>
            )}
            {/* SUBMIT */}
            <button
              onClick={handleSubmit}
              className="w-full rounded-lg bg-[#7fa36a] py-2 text-sm text-[#f5e8c8] hover:bg-[#91b878] cursor-pointer"
            >
              {mode === "signin" ? "Sign In" : "Register"}
            </button>

            {/* SWITCH MODE */}
            <div className="mt-2 flex w-full justify-center gap-1 text-xs text-[#89ad76] hover:cursor-pointer hover:underline cursor-pointer">
              <span
                onClick={switchMode}
              >
                {mode === "signin" ? "Don't have an account? Register" : "Already have an account? Sign in"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthModal;