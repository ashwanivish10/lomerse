import mongoose from 'mongoose';

// Client Schema
const clientSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'User', index: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    company: { type: String },
    address: { type: String },
}, {
    timestamps: true,
});

// Create and export model
export const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);

// Type exports for TypeScript
export type ClientDocument = mongoose.InferSchemaType<typeof clientSchema> & mongoose.Document;

// Interface for creating/updating clients
export interface IClient {
    userId: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    address?: string;
}
