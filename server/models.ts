import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Using Replit user ID
  email: { type: String, unique: true, sparse: true },
  firstName: String,
  lastName: String,
  profileImageUrl: String,
  // Razorpay fields for payment integration
  razorpayCustomerId: String,
  razorpaySubscriptionId: String,
  // Subscription status
  subscriptionTier: { type: String, default: 'free', enum: ['free', 'monthly', 'yearly'] },
  subscriptionStatus: { type: String, default: 'inactive', enum: ['active', 'inactive', 'canceled'] },
  subscriptionEndsAt: Date,
  // Credits for pay-per-invoice (in paise for accuracy)
  invoiceCredits: { type: Number, default: 0 },
}, {
  timestamps: true,
});

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User', index: true },
  invoiceNumber: { type: String, required: true },
  theme: { type: String, required: true, default: 'default' },
  // Invoice content
  companyName: { type: String, required: true },
  companyTagline: String,
  logoUrl: String,
  clientName: { type: String, required: true },
  invoiceDate: { type: String, required: true },
  items: { type: mongoose.Schema.Types.Mixed, required: true }, // Array of invoice items
  totalAmount: { type: Number, required: true }, // In paise
  amountPaid: { type: Number, default: 0 },
  tax: { type: String, default: '0%' },
  address: String,
  phone: String,
}, {
  timestamps: true,
});

// Payment Schema
const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User', index: true },
  razorpayPaymentId: String,
  razorpayOrderId: String,
  razorpaySubscriptionId: String,
  amount: { type: Number, required: true }, // In paise
  currency: { type: String, default: 'INR' },
  paymentType: { type: String, required: true, enum: ['invoice', 'subscription_monthly', 'subscription_yearly'] },
  status: { type: String, required: true, enum: ['pending', 'succeeded', 'failed'] },
}, {
  timestamps: true,
});

// Create and export models
// export const User = mongoose.model('User', userSchema);
export const User = mongoose.models.User || mongoose.model("User", userSchema);

export const Invoice = mongoose.model('Invoice', invoiceSchema);
export const Payment = mongoose.model('Payment', paymentSchema);

// Connect to MongoDB
export async function connectDB() {
  try {
    const mongoUrl = process.env.MONGODB_URI || process.env.MONGODB_URL;
    
    if (!mongoUrl) {
      console.warn('MongoDB connection string not provided. Please set MONGODB_URI or MONGODB_URL environment variable.');
      return;
    }

    await mongoose.connect(mongoUrl);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Type exports for TypeScript
export type UserDocument = mongoose.InferSchemaType<typeof userSchema> & { _id: string };
export type InvoiceDocument = mongoose.InferSchemaType<typeof invoiceSchema> & mongoose.Document;
export type PaymentDocument = mongoose.InferSchemaType<typeof paymentSchema> & mongoose.Document;
