import { Link, useLocation } from "react-router-dom";

function Navbar({ user, onOpenAuth }) {
    const location = useLocation();
    const handleProfileClick = (e) => {
        if (!user) {
            e.preventDefault();
            onOpenAuth();
        }
    };

    return (
        <nav className="border-b border-app-border bg-app-bg">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
                {/* LOGO / NAME */}
                <span
                    to="/calendar"
                    className="text-lg font-bold tracking-wide text-app-text"
                >
                    Pramis
                </span>

                {/* NAV LINKS */}
                <div className="flex items-center gap-2 rounded-lg bg-app-card p-1">
                    {/* TODAY */}
                    <Link
                        to="/"
                        className={`rounded-md px-4 py-2 text-sm font-medium transition ${location.pathname === "/"
                            ? "bg-app-primary text-app-text"
                            : "text-app-text-muted hover:bg-app-card hover:text-app-text"
                            }`}
                    >
                        Today
                    </Link>
                    {/* CALENDAR */}
                    <Link
                        to="/calendar"
                        className={`rounded-md px-4 py-2 text-sm font-medium transition ${location.pathname === "/calendar"
                            ? "bg-app-primary text-app-text"
                            : "text-app-text-muted hover:bg-app-card hover:text-app-text"
                            }`}
                    >
                        Calendar
                    </Link>
                    {/* PROFILE */}
                    <Link
                        to="/profile"
                        onClick={handleProfileClick}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition ${location.pathname === "/profile"
                            ? "bg-app-primary text-app-text"
                            : "text-app-text-muted hover:bg-app-card hover:text-app-text"
                            }`}
                    >
                        Profile
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;