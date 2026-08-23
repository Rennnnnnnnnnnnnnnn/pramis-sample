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
        <nav className="border-b border-[#344d3b] bg-maomao-night">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
                {/* LOGO / NAME */}
                <Link
                    to="/calendar"
                    className="text-lg font-bold tracking-wide text-[#f5e8c8]"
                >
                    Pramis
                </Link>

                {/* NAV LINKS */}
                <div className="flex items-center gap-2 rounded-lg bg-[#1d3024] p-1">
                    {/* TODAY */}
                    <Link
                        to="/"
                        className={`rounded-md px-4 py-2 text-sm font-medium transition ${location.pathname === "/"
                            ? "bg-[#7fa36a] text-[#f5e8c8]"
                            : "text-[#b6c8a5] hover:bg-[#263b2b] hover:text-[#f5e8c8]"
                            }`}
                    >
                        Today
                    </Link>
                    {/* CALENDAR */}
                    <Link
                        to="/calendar"
                        className={`rounded-md px-4 py-2 text-sm font-medium transition ${location.pathname === "/calendar"
                            ? "bg-[#7fa36a] text-[#f5e8c8]"
                            : "text-[#b6c8a5] hover:bg-[#263b2b] hover:text-[#f5e8c8]"
                            }`}
                    >
                        Calendar
                    </Link>
                    {/* PROFILE */}
                    <Link
                        to="/profile"
                        onClick={handleProfileClick}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition ${location.pathname === "/profile"
                            ? "bg-[#7fa36a] text-[#f5e8c8]"
                            : "text-[#b6c8a5] hover:bg-[#263b2b] hover:text-[#f5e8c8]"
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