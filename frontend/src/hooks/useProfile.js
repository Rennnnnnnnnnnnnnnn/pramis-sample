import { useState } from "react";
import api from "../services/api";


export const useProfile = () => {
    const [savingUsername, setSavingUsername] = useState(false);
    const [savingEmail, setSavingEmail] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const updateUsername = async (username) => {
        if (!username.trim()) {
            throw new Error("Username is required.");
        }

        try {
            setSavingUsername(true);
            await api.put("/api/account/updateUsername", {
                username: username.trim()
            });

            return true;

        } catch (error) {
            console.error("Update username error:", error);

            throw new Error(
                error.response?.data?.error ||
                "Failed to update username."
            );

        } finally {
            setSavingUsername(false);
        }
    };

    const updateEmail = async (email) => {
        try {
            setSavingEmail(true);
            await api.put("/api/account/updateEmail", {
                email: email.trim()
            });

            return true;
        } catch (error) {
            console.error("Update email error:", error);

            throw new Error(
                error.response?.data?.error ||
                "Failed to update email."
            );

        } finally {
            setSavingEmail(false);
        }
    };

    const updatePassword = async (oldPassword, newPassword) => {
        try {
            setSavingPassword(true);

            await api.put("/api/account/updatePassword", {
                oldPassword,
                newPassword
            });

            return true;

        } catch (error) {
            console.error("Update password error:", error);

            throw new Error(
                error.response?.data?.error ||
                "Failed to update password."
            );

        } finally {
            setSavingPassword(false);
        }
    };

    const deleteAccount = async (password) => {
        if (!password) {
            throw new Error("Password is required.");
        }

        try {
            await api.delete("/api/account/deleteAccount", {
                data: {
                    password
                }
            });
            return true;
        } catch (error) {
            console.error("Delete account error:", error);

            throw new Error(
                error.response?.data?.error ||
                "Failed to delete account."
            );
        }
    };

    return {
        updateUsername,
        updateEmail,
        updatePassword,
        savingUsername,
        savingEmail,
        savingPassword,
        deleteAccount,
    };
};