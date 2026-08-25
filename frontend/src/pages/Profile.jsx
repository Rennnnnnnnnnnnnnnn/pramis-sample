import { useEffect, useState } from "react";
import api from "../services/api";
import { useProfile } from "../hooks/useProfile";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingPassword, setEditingPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleting, setDeleting] = useState(false);

    const {
        updateUsername,
        updateEmail,
        updatePassword,
        savingUsername,
        savingEmail,
        savingPassword,
        deleteAccount,
    } = useProfile();

    const [editingUsername, setEditingUsername] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const handlePasswordUpdate = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("Please fill in all password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            await updatePassword(oldPassword, newPassword);

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setEditingPassword(false);
        } catch (error) {
            console.log("Error: ", error.message);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) { return; }

        try {
            setDeleting(true);

            await deleteAccount(deletePassword);
            localStorage.removeItem("token");
            window.location.href = "/";
        } catch (error) {
            console.log(error.message);
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/api/account/me");
                setUser(response.data);
                setUsername(response.data.username || "");
                setEmail(response.data.email || "");
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleUsernameUpdate = async () => {
        try {
            await updateUsername(username);

            setUser((prev) => ({
                ...prev,
                username: username.trim()
            }));

            setEditingUsername(false);
        } catch (error) {
            console.log("Error updating username", error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/";
    };

    const handleEmailUpdate = async () => {
        try {
            await updateEmail(email);

            setUser((prev) => ({
                ...prev,
                email: email.trim()
            }));
            setEditingEmail(false);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="min-h-full bg-maomao-night p-3 text-[#f2ead8] sm:p-5 lg:p-8">
            <div className="mx-auto max-w-2xl rounded-xl border border-maomao-dark-border bg-maomao-forest p-6 shadow-lg">
                {/* HEADER */}
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
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {/* MAOMAO */}
                            <button
                                className="rounded-lg border border-[#344d3b] bg-[#263b2b] px-3 py-3 text-left transition hover:border-[#7fa36a] hover:bg-[#344d3b] cursor-pointer"
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
                                className="rounded-lg border border-[#344d3b] bg-[#263b2b] px-3 py-3 text-left transition hover:border-[#9b7edb] hover:bg-[#344d3b] cursor-pointer"
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
                            <span className="text-sm text-[#829b7d] mr-2">
                                Username
                            </span>
                            {!editingUsername ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-[#e8dcc2]">
                                        {user?.username}
                                    </span>

                                    <button
                                        onClick={() => {
                                            setUsername(user?.username || "");
                                            setEditingUsername(true);
                                        }}
                                        className="rounded-md border border-[#49634d] px-3 py-1.5 text-xs text-[#b6c8a5] transition hover:border-[#7fa36a] hover:text-[#f5e8c8] cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full rounded-md border border-[#49634d] bg-[#263b2b] p-1 text-sm text-[#e8dcc2] outline-none focus:border-[#7fa36a]"
                                        maxLength={50}
                                    />

                                    <button
                                        onClick={handleUsernameUpdate}
                                        disabled={savingUsername}
                                        className="rounded-md bg-[#7fa36a] px-3 py-1.5 text-xs font-semibold text-[#142018] transition hover:bg-[#91b87a] disabled:opacity-50 cursor-pointer"
                                    >
                                        {savingUsername ? "Saving..." : "Save"}
                                    </button>

                                    <button
                                        onClick={() => {
                                            setUsername(user?.username || "");
                                            setEditingUsername(false);
                                        }}
                                        disabled={savingUsername}
                                        className="rounded-md border border-[#49634d] px-3 py-1.5 text-xs text-[#b6c8a5] transition hover:text-[#f5e8c8] cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* EMAIL */}
                        <div className="flex items-center justify-between rounded-lg bg-[#1d3024] px-4 py-3">
                            <span className="mr-2 text-sm text-[#829b7d]">
                                Email
                            </span>

                            {!editingEmail ? (
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`truncate text-sm 
                                            ${user?.email
                                                ? "text-[#e8dcc2]"
                                                : "text-[#526557]"
                                            }`}
                                    >
                                        {user?.email || "No Email"}
                                    </span>

                                    <button
                                        onClick={() => {
                                            setEmail(user?.email || "");
                                            setEditingEmail(true);
                                        }}
                                        className="rounded-md border border-[#49634d] px-3 py-1.5 text-xs text-[#b6c8a5] transition hover:border-[#7fa36a] hover:text-[#f5e8c8] cursor-pointer"
                                    >
                                        Edit
                                    </button>

                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full rounded-md border border-[#49634d] bg-[#263b2b] p-1 text-sm text-[#e8dcc2] outline-none placeholder:text-[#526557] focus:border-[#7fa36a]"
                                    />

                                    <button
                                        onClick={handleEmailUpdate}
                                        disabled={savingEmail}
                                        className="rounded-md bg-[#7fa36a] px-3 py-1.5 text-xs font-semibold text-[#142018] transition hover:bg-[#91b87a] disabled:opacity-50"
                                    >
                                        {savingEmail ? "Saving..." : "Save"}
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEmail(user?.email || "");
                                            setEditingEmail(false);
                                        }}
                                        disabled={savingEmail}
                                        className="rounded-md border border-[#49634d] px-3 py-1.5 text-xs text-[#b6c8a5] transition hover:text-[#f5e8c8] cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                        </div>
                        {/* PASSWORD */}
                        <div className="rounded-lg bg-[#1d3024] px-4 py-3">
                            {!editingPassword ? (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm text-[#829b7d]">
                                            Password
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => setEditingPassword(true)}
                                        className="rounded-md border border-[#49634d] px-3 py-1.5 text-xs text-[#b6c8a5] transition hover:border-[#7fa36a] hover:text-[#f5e8c8] cursor-pointer"
                                    >
                                        Change
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {/* CURRENT PASSWORD */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-[#829b7d]">
                                            Current Password
                                        </label>

                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className="rounded-md border border-[#49634d] bg-[#263b2b] px-3 py-2 text-sm text-[#e8dcc2] outline-none placeholder:text-[#526557] focus:border-[#7fa36a]"
                                        />
                                    </div>
                                    {/* NEW PASSWORD */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-[#829b7d]">
                                            New Password
                                        </label>

                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="rounded-md border border-[#49634d] bg-[#263b2b] px-3 py-2 text-sm text-[#e8dcc2] outline-none placeholder:text-[#526557] focus:border-[#7fa36a]"
                                        />
                                    </div>
                                    {/* CONFIRM PASSWORD */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-[#829b7d]">
                                            Re-enter New Password
                                        </label>

                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="rounded-md border border-[#49634d] bg-[#263b2b] px-3 py-2 text-sm text-[#e8dcc2] outline-none placeholder:text-[#526557] focus:border-[#7fa36a]"
                                        />
                                        {confirmPassword &&
                                            newPassword !== confirmPassword && (
                                                <p className="text-xs text-red-400">
                                                    Passwords do not match
                                                </p>
                                            )}
                                    </div>
                                    {/* BUTTONS */}
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                setOldPassword("");
                                                setNewPassword("");
                                                setConfirmPassword("");
                                                setEditingPassword(false);
                                            }}
                                            disabled={savingPassword}
                                            className="rounded-md border border-[#49634d] px-3 py-1.5 text-xs text-[#b6c8a5] transition hover:text-[#f5e8c8] cursor-pointer"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={handlePasswordUpdate}
                                            disabled={
                                                savingPassword ||
                                                !oldPassword ||
                                                !newPassword ||
                                                !confirmPassword ||
                                                newPassword !== confirmPassword
                                            }
                                            className="rounded-md bg-[#7fa36a] px-3 py-1.5 text-xs font-semibold text-[#142018] transition hover:bg-[#91b87a] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                        >
                                            {savingPassword ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </div>
                            )}
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

                    <div className="flex flex-col gap-2 ">
                        {/* LOG OUT */}
                        <button
                            onClick={handleLogout}
                            className="rounded-lg border border-[#49634d] px-4 py-2 text-sm font-semibold text-[#b6c8a5] transition hover:border-[#7fa36a] hover:bg-[#263b2b] hover:text-[#f5e8c8] cursor-pointer"
                        >
                            Log out
                        </button>
                        {/* DELETE */}
                        {!deletingAccount ? (
                            <button
                                onClick={() => setDeletingAccount(true)}
                                className="rounded-lg bg-red-600/70 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 cursor-pointer"
                            >
                                Delete Account
                            </button>
                        ) : (
                            <div className="w-full rounded-lg border border-red-900/50 bg-red-950/60 p-4">
                                <p className="mb-3 text-sm text-red-300">
                                    Enter your password to permanently delete your account.
                                </p>

                                <input
                                    type="password"
                                    placeholder="Current password"
                                    autoFocus
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    className={`mb-3 w-full rounded-md border border-red-900/50  px-3 py-2 text-sm text-[#e8dcc2] outline-none focus:border-red-500 ${deletingAccount ? "bg-red-900/20" : "bg-[#1d3024]"}`}
                                />

                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setDeletePassword("");
                                            setDeletingAccount(false);
                                        }}
                                        disabled={deleting}
                                        className="rounded-md border border-[#49634d] px-3 py-1.5 text-xs text-[#b6c8a5] cursor-pointer"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={deleting || !deletePassword}
                                        className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50 cursor-pointer"
                                    >
                                        {deleting ? "Deleting..." : "Permanently Delete"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;