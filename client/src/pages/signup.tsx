import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Mail, Lock, Eye, EyeOff, User, ArrowLeft, Sparkles, Shield, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import fileIcon from "@/attached_assets/file.png";

// Google Icon component
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="24px"
        height="24px"
    >
        <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        />
        <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        />
        <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,36.494,44,30.861,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        />
    </svg>
);

export default function SignUp() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            toast({
                title: "Account created!",
                description: "Welcome to Lomerse. Redirecting to dashboard...",
            });

            // Redirect to dashboard after successful registration
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);

        } catch (error: any) {
            setErrors({ form: error.message });
            toast({
                title: "Registration failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Google Sign Up
    const handleGoogleSignUp = () => {
        window.location.href = '/auth/google';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-chart-2/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-center relative z-10">
                {/* Left Side - Branding & Features (Hidden on mobile) */}
                <div className="hidden lg:flex flex-col flex-1 space-y-8 pr-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img src={fileIcon} alt="Lomerse" className="w-12 h-12 rounded-xl" />
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                                Lomerse
                            </h1>
                        </div>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Join thousands of professionals creating stunning invoices in minutes.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 transition-all hover:shadow-md hover:border-primary/20">
                            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center shrink-0">
                                <Sparkles className="w-5 h-5 text-chart-3" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">13+ Professional Templates</h3>
                                <p className="text-sm text-muted-foreground">Choose from a variety of stunning designs</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 transition-all hover:shadow-md hover:border-primary/20">
                            <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center shrink-0">
                                <Zap className="w-5 h-5 text-chart-2" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Instant PDF Export</h3>
                                <p className="text-sm text-muted-foreground">Download and share invoices instantly</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 transition-all hover:shadow-md hover:border-primary/20">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Free to Start</h3>
                                <p className="text-sm text-muted-foreground">Create your account and start invoicing today</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Sign Up Card */}
                <Card className="w-full max-w-md backdrop-blur-sm bg-card/80 border-border/50 shadow-2xl" data-testid="card-signup">
                    <CardHeader className="space-y-4 text-center pb-2">
                        {/* Mobile Logo */}
                        <div className="lg:hidden mx-auto">
                            <div className="flex items-center justify-center gap-2">
                                <img src={fileIcon} alt="Lomerse" className="w-10 h-10 rounded-xl" />
                                <span className="text-xl font-bold">Lomerse</span>
                            </div>
                        </div>

                        <div>
                            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                            <CardDescription className="mt-2">
                                Sign up to start creating beautiful invoices
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Google Sign Up Button */}
                        <Button
                            onClick={handleGoogleSignUp}
                            variant="outline"
                            className="w-full h-12 text-base font-medium border-2 hover:bg-muted/50 transition-all duration-200"
                            size="lg"
                            data-testid="button-google-signup"
                        >
                            <GoogleIcon className="w-5 h-5 mr-3" />
                            Continue with Google
                        </Button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-3 text-muted-foreground">Or register with email</span>
                            </div>
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Form Error */}
                            {errors.form && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                    {errors.form}
                                </div>
                            )}

                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={`pl-10 h-11 border-border/80 focus:border-primary transition-colors ${errors.name ? 'border-destructive' : ''}`}
                                        data-testid="input-name"
                                    />
                                </div>
                                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`pl-10 h-11 border-border/80 focus:border-primary transition-colors ${errors.email ? 'border-destructive' : ''}`}
                                        data-testid="input-email"
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Minimum 6 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`pl-10 pr-10 h-11 border-border/80 focus:border-primary transition-colors ${errors.password ? 'border-destructive' : ''}`}
                                        data-testid="input-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`pl-10 pr-10 h-11 border-border/80 focus:border-primary transition-colors ${errors.confirmPassword ? 'border-destructive' : ''}`}
                                        data-testid="input-confirm-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
                                size="lg"
                                disabled={isLoading}
                                data-testid="button-signup"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                        Creating account...
                                    </div>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>

                        {/* Sign In Link */}
                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <a
                                href="/signin"
                                className="text-primary hover:underline font-semibold"
                            >
                                Sign in
                            </a>
                        </p>

                        {/* Back Button */}
                        <button
                            onClick={() => setLocation('/signin')}
                            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sign In
                        </button>

                        {/* Terms */}
                        <p className="text-center text-xs text-muted-foreground px-4">
                            By creating an account, you agree to our{" "}
                            <a href="#" className="underline hover:text-foreground">Terms of Service</a>
                            {" "}and{" "}
                            <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
