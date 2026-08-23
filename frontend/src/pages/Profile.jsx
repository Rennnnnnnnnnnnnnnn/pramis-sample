function Profile({ user }) {
    return (
        <div className="p-3 sm:p-5 lg:p-8 text-[#f2ead8]">
            <div className="mx-auto max-w-2xl rounded-xl border border-maomao-dark-border bg-maomao-forest p-6 shadow-lg">
                {/* HEADER */}
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-[#f5e8c8]">
                        Profile
                    </h1>

                    <p className="text-sm text-[#829b7d]">
                        Your account
                    </p>
                </div>

                {/* PROFILE */}
                <div className="flex items-center gap-4 border-b border-[#344d3b] pb-6">
                    {/* AVATAR */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#7fa36a] text-2xl font-bold text-[#f5e8c8]">
                        {user?.name?.charAt(0)?.toUpperCase() || "G"}
                    </div>
                    {/* USER INFO */}
                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-bold text-[#f5e8c8]">
                            {user?.name || "Guest"}
                        </h2>

                        <p className="truncate text-sm text-[#829b7d]">
                            {user?.email || "Guest account"}
                        </p>
                    </div>

                </div>

                {/* ACCOUNT INFORMATION */}
                <div className="mt-6">
                    <h2 className="mb-4 text-sm font-semibold text-[#f5e8c8]">
                        Account Information
                    </h2>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg bg-[#1d3024] px-4 py-3">
                            <span className="text-sm text-[#829b7d]">
                                Name
                            </span>

                            <span className="text-sm text-[#e8dcc2]">
                                {user?.name || "Guest"}
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-[#1d3024] px-4 py-3">
                            <span className="text-sm text-[#829b7d]">
                                Email
                            </span>

                            <span className="max-w-[60%] truncate text-sm text-[#e8dcc2]">
                                {user?.email || "Not available"}
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-[#1d3024] px-4 py-3">
                            <span className="text-sm text-[#829b7d]">
                                Account
                            </span>

                            <span className="text-sm text-[#e8dcc2]">
                                {user ? "Registered" : "Guest"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex justify-end gap-2">
                    <button
                        className="rounded-lg bg-[#7fa36a] px-4 py-2 text-sm font-semibold text-[#f5e8c8] transition hover:bg-[#91b878]"
                    >
                        {user?.name ? "Sign In" : "Log out"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;