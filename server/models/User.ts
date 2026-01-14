import mongoose, { Schema, model, Document } from "mongoose";

// ... (IUserSettings and IUser interfaces remain the same) ...
interface IUserSettings {
    aiSuggestionsEnabled: boolean;
    darkMode: boolean;
}

export interface IUser extends Document {
    googleId?: string;
    name: string;
    email: string;
    password?: string; // For local auth (hashed)
    authProvider: "google" | "local"; // Authentication method
    avatarUrl?: string;
    companyName?: string;
    role: "user" | "admin";
    settings: IUserSettings;
    subscriptionStatus?: "active" | "inactive";
    subscriptionTier?: "monthly" | "yearly";
    subscriptionEndsAt?: Date;
    invoiceCredits?: number;
}


// ---------------------------------------------
// 🧩 User Schema
// ---------------------------------------------
const UserSchema = new Schema<IUser>(
    {
        // -----------------------------------------------------------------
        // ❗ FIX 1 (Part 1): Override Mongoose's default ObjectId
        // We are defining _id as a String to store the Google ID.
        // -----------------------------------------------------------------
        _id: { type: String, required: true },

        googleId: { type: String },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String }, // Hashed password for local auth
        authProvider: {
            type: String,
            enum: ["google", "local"],
            default: "google",
        },
        avatarUrl: { type: String },
        companyName: { type: String },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        settings: {
            aiSuggestionsEnabled: { type: Boolean, default: true },
            darkMode: { type: Boolean, default: false },
        },
        subscriptionStatus: {
            type: String,
            enum: ["active", "inactive"],
            default: "inactive",
        },
        subscriptionTier: {
            type: String,
            // -----------------------------------------------------------------
            // ❗ FIX 2: Added "free" to the list of allowed enum values
            // -----------------------------------------------------------------
            enum: ["free", "monthly", "yearly"],
        },
        subscriptionEndsAt: {
            type: Date,
        },
        invoiceCredits: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true, // adds createdAt, updatedAt automatically
        // -----------------------------------------------------------------
        // ❗ FIX 1 (Part 2): Tell Mongoose not to create its *own* _id
        // -----------------------------------------------------------------
        _id: false
    }
);

// ---------------------------------------------
// ✅ SAFE MODEL EXPORT (Single Named Export ONLY)
// ---------------------------------------------
export const User =
    (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

// ❌ REMOVE THE LINE: export default User;

