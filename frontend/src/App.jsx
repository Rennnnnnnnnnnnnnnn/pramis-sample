import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Calendar from "./pages/Calendar";
import Today from "./pages/Today";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import api from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // AUTHENTICATION
  const handleAuthSuccess = async (data) => {
    try {
      let response;

      // SIGN IN
      if (data.mode === "signin") {
        response = await api.post(
          "/api/auth/login",
          {
            identifier: data.identifier,
            password: data.password,
          }
        );

        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);
        setShowAuthModal(false);

        return {
          success: true,
        };
      }

      // REGISTER
      response = await api.post(
        "/api/auth/register",
        {
          username: data.username,
          email: data.email,
          password: data.password,
        }
      );

      return {
        success: true,
      };

    } catch (error) {
      console.error(
        "Authentication failed:",
        error.response?.data || error
      );

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      };
    }
  };

  // RESTORE LOGIN SESSION
  useEffect(() => {
    const token = localStorage.getItem("token");

    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(
        JSON.parse(storedUser)
      );
    }
    setAuthLoading(false);
  }, []);

  if (authLoading) { return null; }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-app-bg">
        <div className="p-5 text-center text-md font-medium italic tracking-wide text-app-text-muted">
          <span>
            KEEP YOUR PROMISES.
          </span>
          <br className="lg:hidden" />
          <span>
            {" "}Don't CHEAT on yourself!
          </span>
        </div>

        <Navbar
          user={user}
          onOpenAuth={() => setShowAuthModal(true)}
        />

        <Routes>
          <Route path="/calendar"
            element={<Calendar user={user} />}
          />

          <Route path="/"
            element={<Today user={user} />}
          />

          <Route path="/profile"
            element={
              <Profile
                // user={user}
                onOpenAuth={() => setShowAuthModal(true)}
              />
            }
          />
        </Routes>

        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSubmit={handleAuthSuccess}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;