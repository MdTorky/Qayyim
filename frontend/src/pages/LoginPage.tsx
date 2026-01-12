import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import api from '../utils/api';
import PageTransition from "@/components/animations/PageTransition";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";

const LoginPage: React.FC = () => {
    const { t, language } = useLanguage();
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const redirect = location.search ? location.search.split('=')[1] : '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.post('/users/login', { email, password });
            login(data);
            toast({
                title: t.common.success,
                description: language === "ar" ? "تم تسجيل الدخول بنجاح" : "Logged in successfully",
            });
            navigate(redirect);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || (language === "ar" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Invalid email or password");
            toast({
                variant: "destructive",
                title: t.common.error,
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen grid lg:grid-cols-2">
                {/* Left Side - Visual */}
                <div className="hidden lg:block relative bg-black">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1470&auto=format&fit=crop"
                        alt="Workspace"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-12 text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-4xl font-bold mb-4 leading-tight">
                                {language === "ar" ? "مرحباً بعودتك" : "Welcome Back."}
                            </h2>
                            <p className="text-lg text-gray-300 max-w-md">
                                {language === "ar"
                                    ? "في متجر قيم، كل قطعة تحكي قصة عن الإيمان، والقوة، والغاية"
                                    : "In Qayyim Store, Every piece tells a story — of faith, strength, and purpose."}
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex items-center justify-center p-8 bg-white">
                    <div className="w-full max-w-md space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex flex-col space-y-2 text-center">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {t.auth.login}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {language === "ar"
                                        ? "أدخل بريدك الإلكتروني للدخول"
                                        : "Enter your email to sign in to your account"}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">{t.auth.email}</Label>
                                        <Input
                                            id="email"
                                            placeholder="name@example.com"
                                            type="email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            disabled={loading}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-11 px-4 transition-all focus:ring-2 focus:ring-black focus:ring-offset-2"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        {/* <div className="flex items-center justify-between">
                                            <Label htmlFor="password">{t.auth.password}</Label>
                                            <Link
                                                to="/forgot-password"
                                                className="text-sm font-medium text-muted-foreground hover:text-black hover:underline"
                                            >
                                                {t.auth.forgotPassword}
                                            </Link>
                                        </div> */}
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            disabled={loading}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-11 px-4 transition-all focus:ring-2 focus:ring-black focus:ring-offset-2"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-11 brand-button-accent hover:bg-gray-800 text-white transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            {t.auth.login}
                                            <ArrowRight className="w-4 h-4 ml-1" />
                                        </span>
                                    )}
                                </Button>
                            </form>

                            {/* <div className="relative mt-8">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-muted-foreground">
                                        {language === "ar" ? "أو المتابعة بـ" : "Or continue with"}
                                    </span>
                                </div>
                            </div> */}

                            <div className="mt-6 text-center text-sm">
                                <span className="text-muted-foreground">{t.auth.noAccount}</span>{" "}
                                <Link
                                    to="/register"
                                    className="font-semibold text-black hover:underline"
                                >
                                    {t.auth.signup}
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default LoginPage;
