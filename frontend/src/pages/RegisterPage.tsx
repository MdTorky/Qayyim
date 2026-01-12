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
import { Loader2, ArrowRight, UserPlus } from "lucide-react";

const RegisterPage: React.FC = () => {
    const { t, language } = useLanguage();
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const redirect = location.search ? location.search.split('=')[1] : '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: t.common.error,
                description: language === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match",
            });
            return;
        }

        setLoading(true);

        try {
            const { data } = await api.post('/users', { name, email, password, phone });
            login(data);
            toast({
                title: t.common.success,
                description: language === "ar" ? "تم إنشاء الحساب بنجاح" : "Account created successfully",
            });
            navigate(redirect);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || (language === "ar" ? "حدث خطأ أثناء التسجيل" : "Registration failed");
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
                <div className="hidden lg:block relative bg-black order-last lg:order-first">
                    <img
                        src="https://images.unsplash.com/photo-1549488344-c73885ebbc52?q=80&w=1587&auto=format&fit=crop"
                        alt="Join us"
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
                                {language === "ar" ? "انضم إلينا اليوم" : "Join the Community."}
                            </h2>
                            <p className="text-lg text-gray-300 max-w-md">
                                {language === "ar"
                                    ? "أنشئ حسابك وابدأ تجربة تسوق فريدة"
                                    : "Create your account and start your unique shopping journey."}
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
                                    {t.auth.createAccount}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {language === "ar"
                                        ? "أدخل بياناتك لإنشاء حساب جديد"
                                        : "Enter your details to create a new account"}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">{t.checkout.name}</Label>
                                        <Input
                                            id="name"
                                            placeholder="Your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="h-11 px-4 transition-all focus:ring-2 focus:ring-black focus:ring-offset-2"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">{t.auth.email}</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="h-11 px-4 transition-all focus:ring-2 focus:ring-black focus:ring-offset-2"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">{language === "ar" ? "رقم الهاتف" : "Phone"}</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="01xxxxxxxxx"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                            className="h-11 px-4 transition-all focus:ring-2 focus:ring-black focus:ring-offset-2"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">{t.auth.password}</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="h-11 px-4 transition-all focus:ring-2 focus:ring-black focus:ring-offset-2"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword" className="truncate text-xs sm:text-sm">{t.auth.confirmPassword}</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                className="h-11 px-4 transition-all focus:ring-2 focus:ring-black focus:ring-offset-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-11 brand-button-accent hover:bg-gray-800 text-white mt-6 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            {t.auth.createAccount}
                                            <UserPlus className="w-4 h-4 ml-1" />
                                        </span>
                                    )}
                                </Button>
                            </form>

                            <div className="relative mt-8">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-muted-foreground">
                                        {language === "ar" ? "هل لديك حساب بالفعل؟" : "Already have an account?"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 text-center text-sm">
                                <Link to="/login">
                                    <Button variant="outline" className="w-full h-11">
                                        {t.auth.login}
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default RegisterPage;
