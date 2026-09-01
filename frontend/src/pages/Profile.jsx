import { useEffect, useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

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
        deleteAccount,
        savingUsername,
        savingEmail,
        savingPassword,
    } = useProfile();

    const { theme, switchTheme } = useTheme();
    const [editingUsername, setEditingUsername] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const handlePasswordUpdate = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            console.log("Please fill in all password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            console.log("Passwords do not match.");
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
        <div className="min-h-full bg-app-bg p-3 text-[#f2ead8] sm:p-5 lg:p-8">
            <div className="mx-auto max-w-2xl rounded-xl border border-app-border bg-app-surface p-6 shadow-lg">
                {/* HEADER */}
                <div className="mb-6 text-center mb-5">
                    <h1 className="text-xl font-bold text-app-text">
                        Profile
                    </h1>

                    <p className="mt-1 text-sm text-app-text-muted">
                        Manage your account and preferences
                    </p>
                </div>

                <div className="mt-6">
                    {/* THEME */}
                    <div className="rounded-lg bg-app-card px-4 py-4">
                        <div className="mb-3">
                            <span className="text-sm font-medium text-app-text">
                                Theme
                            </span>

                            <p className="text-xs text-app-text-muted">
                                Choose your preferred visual theme.
                            </p>
                        </div>
                        {/* THEME OPTIONS */}
                        <div className="flex gap-2 ">
                            {/* MAOMAO */}
                            <button
                                onClick={() => switchTheme("maomao")}
                                className={`
                                        rounded-lg w-full border px-3 py-3 text-left transition cursor-pointer
                                        ${theme === "maomao"
                                        ? "border-app-primary bg-app-card"
                                        : "border-app-border bg-app-surface"
                                    }
                                        hover:border-app-primary
                                    `}
                            >
                                <div className="mb-2 flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-full bg-[#7fa36a]" />

                                    <span className="text-sm font-medium text-app-text">
                                        Maomao
                                    </span>
                                </div>

                                <p className="text-xs text-app-text-muted">
                                    Herbal green theme
                                </p>
                            </button>
                            {/* JINSHI */}
                            <button
                                onClick={() => switchTheme("jinshi")}
                                className={`
                                        rounded-lg w-full border px-3 py-3 text-left transition cursor-pointer
                                        ${theme === "jinshi"
                                        ? "border-app-primary bg-app-card"
                                        : "border-app-border bg-app-surface"
                                    }
                                            hover:border-app-primary
                                        `}
                            >
                                <div className="mb-2 flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-full bg-[#9b7edb]" />

                                    <span className="text-sm font-medium text-app-text">
                                        Jinshi
                                    </span>
                                </div>

                                <p className="text-xs text-app-text-muted">
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
                    <h2 className="mb-1 text-sm font-semibold text-app-text">
                        Account Information
                    </h2>

                    <p className="mb-4 text-xs text-app-text-muted">
                        Manage your account details.
                    </p>
                    <div className="space-y-3">
                        {/* USERNAME */}
                        <div className="flex items-center justify-between rounded-lg bg-app-card px-4 py-3">
                            <span className="text-sm text-app-text-muted mr-2">
                                Username
                            </span>
                            {!editingUsername ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-app-text">
                                        {user?.username}
                                    </span>

                                    <button
                                        onClick={() => {
                                            setUsername(user?.username || "");
                                            setEditingUsername(true);
                                        }}
                                        className="rounded-md border border-app-border-light px-3 py-1.5 text-xs text-app-text-muted transition hover:border-app-primary hover:text-app-text cursor-pointer"
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
                                        className="w-full rounded-md border border-app-border-light bg-app-card p-1 text-sm text-app-text outline-none  focus-border-app-focus"
                                        maxLength={50}
                                    />

                                    <button
                                        onClick={handleUsernameUpdate}
                                        disabled={savingUsername}
                                        className="rounded-md bg-app-primary px-3 py-1.5 text-xs font-semibold text-[#142018] transition hover:bg-[#91b87a] disabled:opacity-50 cursor-pointer"
                                    >
                                        {savingUsername ? "Saving..." : "Save"}
                                    </button>

                                    <button
                                        onClick={() => {
                                            setUsername(user?.username || "");
                                            setEditingUsername(false);
                                        }}
                                        disabled={savingUsername}
                                        className="rounded-md border border-app-border-light px-3 py-1.5 text-xs text-app-text-muted transition hover:text-app-text cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* EMAIL */}
                        <div className="flex items-center justify-between rounded-lg bg-app-card px-4 py-3">
                            <span className="mr-2 text-sm text-app-text-muted">
                                Email
                            </span>

                            {!editingEmail ? (
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`truncate text-sm 
                                            ${user?.email
                                                ? "text-app-text"
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
                                        className="rounded-md border border-app-border-light px-3 py-1.5 text-xs text-app-text-muted transition hover:border-app-primary hover:text-app-text cursor-pointer"
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
                                        className="w-full rounded-md border border-app-border-light bg-app-card p-1 text-sm text-app-text outline-none placeholder:text-[#526557] focus-border-app-focus"
                                    />

                                    <button
                                        onClick={handleEmailUpdate}
                                        disabled={savingEmail}
                                        className="rounded-md bg-app-primary px-3 py-1.5 text-xs font-semibold text-[#142018] transition hover:bg-[#91b87a] disabled:opacity-50"
                                    >
                                        {savingEmail ? "Saving..." : "Save"}
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEmail(user?.email || "");
                                            setEditingEmail(false);
                                        }}
                                        disabled={savingEmail}
                                        className="rounded-md border border-app-border-light px-3 py-1.5 text-xs text-app-text-muted transition hover:text-app-text cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                        </div>
                        {/* PASSWORD */}
                        <div className="rounded-lg bg-app-card px-4 py-3">
                            {!editingPassword ? (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm text-app-text-muted">
                                            Password
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => setEditingPassword(true)}
                                        className="rounded-md border border-app-border-light px-3 py-1.5 text-xs text-app-text-muted transition hover:border-app-primary hover:text-app-text cursor-pointer"
                                    >
                                        Change
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {/* CURRENT PASSWORD */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-app-text-muted">
                                            Current Password
                                        </label>

                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className="rounded-md border border-app-border-light bg-app-card px-3 py-2 text-sm text-app-text outline-none placeholder:text-app-text focus-border-app-focus"
                                        />
                                    </div>
                                    {/* NEW PASSWORD */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-app-text-muted">
                                            New Password
                                        </label>

                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="rounded-md border border-app-border-light bg-app-card px-3 py-2 text-sm text-app-text outline-none placeholder:text-app-text focus-border-app-focus"
                                        />
                                    </div>
                                    {/* CONFIRM PASSWORD */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-app-text-muted">
                                            Re-enter New Password
                                        </label>

                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="rounded-md border border-app-border-light bg-app-card px-3 py-2 text-sm text-app-text outline-none placeholder:text-app-text focus-border-app-focus"
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
                                            className="rounded-md border border-app-border-light px-3 py-1.5 text-xs text-app-text-muted transition hover:text-app-text cursor-pointer"
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
                                            className="rounded-md bg-app-primary px-3 py-1.5 text-xs font-semibold text-[#142018] transition hover:bg-[#91b87a] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
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
                <div className="mt-8 border-t border-app-border pt-6">
                    <h2 className="mb-1 text-sm font-semibold text-app-text">
                        Account Actions
                    </h2>

                    <p className="mb-4 text-xs text-app-text-muted">
                        Manage your account session and data.
                    </p>

                    <div className="flex flex-col gap-2 ">
                        {/* LOG OUT */}
                        <button
                            onClick={handleLogout}
                            className="rounded-lg border border-app-border-light px-4 py-2 text-sm font-semibold text-app-text-muted transition hover:border-app-primary hover:bg-app-card hover:text-app-text cursor-pointer"
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
                                    className={`mb-3 w-full rounded-md border border-red-900/50  px-3 py-2 text-sm text-app-text outline-none focus:border-red-500 ${deletingAccount ? "bg-red-900/20" : "bg-app-card"}`}
                                />

                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setDeletePassword("");
                                            setDeletingAccount(false);
                                        }}
                                        disabled={deleting}
                                        className="rounded-md border border-app-border-light px-3 py-1.5 text-xs text-app-text-muted cursor-pointer"
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