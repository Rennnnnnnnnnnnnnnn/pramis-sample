function Profile({ user }) {
    return (
        <div className="min-h-screen bg-maomao-night p-3 text-[#f2ead8] sm:p-5 lg:p-8">

            <div className="mx-auto max-w-2xl rounded-xl border border-maomao-dark-border bg-maomao-forest p-6 shadow-lg">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-6 text-center mb-5">
                    <h1 className="text-xl font-bold text-[#f5e8c8]">
                        Profile
                    </h1>

                    <p className="mt-1 text-sm text-[#829b7d]">
                        Manage your account and preferences
                    </p>
                </div>

                <div className="mt-6">
                    <h2 className="mb-1 text-sm font-semibold text-[#f5e8c8]">
                        Appearance
                    </h2>

                    <p className="mb-4 text-xs text-[#829b7d]">
                        Customize how the application looks.
                    </p>


                    {/* THEME */}
                    <div className="rounded-lg bg-[#1d3024] px-4 py-4">

                        <div className="mb-3">

                            <span className="text-sm font-medium text-[#e8dcc2]">
                                Theme
                            </span>

                            <p className="text-xs text-[#829b7d]">
                                Choose your preferred visual theme.
                            </p>

                        </div>


                        {/* THEME OPTIONS */}
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">

                            {/* DARK */}
                            <button
                                className="rounded-lg border border-[#7fa36a] bg-[#2b4234] px-3 py-3 text-left transition hover:bg-[#344d3b]"
                            >
                                <div className="mb-2 flex items-center gap-2">

                                    <div className="h-4 w-4 rounded-full border border-[#829b7d] bg-[#121a15]" />

                                    <span className="text-sm font-medium text-[#f5e8c8]">
                                        Dark
                                    </span>

                                </div>

                                <p className="text-xs text-[#829b7d]">
                                    Simple dark theme
                                </p>

                            </button>


                            {/* MAOMAO */}
                            <button
                                className="rounded-lg border border-[#344d3b] bg-[#263b2b] px-3 py-3 text-left transition hover:border-[#7fa36a] hover:bg-[#344d3b]"
                            >
                                <div className="mb-2 flex items-center gap-2">

                                    <div className="h-4 w-4 rounded-full border border-[#7fa36a] bg-[#7fa36a]" />

                                    <span className="text-sm font-medium text-[#f5e8c8]">
                                        Maomao
                                    </span>

                                </div>

                                <p className="text-xs text-[#829b7d]">
                                    Herbal green theme
                                </p>

                            </button>


                            {/* JINSHI */}
                            <button
                                className="rounded-lg border border-[#344d3b] bg-[#263b2b] px-3 py-3 text-left transition hover:border-[#9b7edb] hover:bg-[#344d3b]"
                            >
                                <div className="mb-2 flex items-center gap-2">

                                    <div className="h-4 w-4 rounded-full border border-[#9b7edb] bg-[#9b7edb]" />

                                    <span className="text-sm font-medium text-[#f5e8c8]">
                                        Jinshi
                                    </span>

                                </div>

                                <p className="text-xs text-[#829b7d]">
                                    Elegant violet theme
                                </p>

                            </button>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ACCOUNT INFORMATION
                ================================================= */}

                <div className="mt-6">

                    <h2 className="mb-1 text-sm font-semibold text-[#f5e8c8]">
                        Account Information
                    </h2>

                    <p className="mb-4 text-xs text-[#829b7d]">
                        Manage your account details.
                    </p>


                    <div className="space-y-3">

                        {/* USERNAME */}
                        <div className="flex items-center justify-between rounded-lg bg-[#1d3024] px-4 py-3">

                            <span className="text-sm text-[#829b7d]">
                                Username
                            </span>

                            <span className="text-sm text-[#e8dcc2]">
                                {user?.name || "Guest"}
                            </span>

                        </div>


                        {/* EMAIL */}
                        <div className="flex items-center justify-between rounded-lg bg-[#1d3024] px-4 py-3">

                            <span className="text-sm text-[#829b7d]">
                                Email
                            </span>

                            <span className="max-w-[60%] truncate text-sm text-[#e8dcc2]">
                                {user?.email || "Not available"}
                            </span>

                        </div>


                        {/* PASSWORD */}
                        <div className="flex items-center justify-between rounded-lg bg-[#1d3024] px-4 py-3">

                            <div>
                                <span className="text-sm text-[#829b7d]">
                                    Password
                                </span>

                                <p className="text-xs text-[#829b7d]">
                                    Your password is securely encrypted.
                                </p>
                            </div>

                            <button
                                className="rounded-md border border-[#49634d] px-3 py-1.5 text-xs text-[#b6c8a5] transition hover:border-[#7fa36a] hover:text-[#f5e8c8]"
                            >
                                Change
                            </button>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    DANGER ZONE
                ================================================= */}

                <div className="mt-8 border-t border-[#344d3b] pt-6">

                    <h2 className="mb-1 text-sm font-semibold text-[#f5e8c8]">
                        Account Actions
                    </h2>

                    <p className="mb-4 text-xs text-[#829b7d]">
                        Manage your account session and data.
                    </p>


                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">

                        {/* LOG OUT */}
                        <button
                            className="rounded-lg border border-[#49634d] px-4 py-2 text-sm font-semibold text-[#b6c8a5] transition hover:border-[#7fa36a] hover:bg-[#263b2b] hover:text-[#f5e8c8]"
                        >
                            Log out
                        </button>


                        {/* DELETE */}
                        <button
                            className="rounded-lg bg-red-600/70 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                            Delete Account
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Profile;