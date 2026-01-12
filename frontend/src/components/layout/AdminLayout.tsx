import { Link, useLocation } from 'react-router-dom';
import { Package, Users, ShoppingCart, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from 'react';

const AdminLayout = ({ children }: { children: ReactNode }) => {
    const location = useLocation();

    const navItems = [
        { title: "Dashboard", icon: TrendingUp, href: "/admin/dashboard" },
        { title: "Products", icon: Package, href: "/admin/products" },
        { title: "Orders", icon: ShoppingCart, href: "/admin/orders" },
        { title: "Users", icon: Users, href: "/admin/users" },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Sidebar / Navigation Column */}
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Sidebar */}
                    <aside className="hidden lg:block lg:col-span-1 space-y-4">
                        <div className="sticky top-24 space-y-4">
                            <div className="p-4 bg-white rounded-xl shadow-sm border space-y-6">
                                <div className='px-2'>
                                    <h2 className="text-lg font-bold tracking-tight">Admin Portal</h2>
                                    <p className="text-sm text-gray-500">Manage your store</p>
                                </div>
                                <nav className="space-y-1">
                                    {navItems.map((item) => {
                                        const isActive = location.pathname === item.href;
                                        return (
                                            <Link
                                                key={item.title}
                                                to={item.href}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                                    ? "bg-black text-white"
                                                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                                                    }`}
                                            >
                                                <item.icon className="w-4 h-4" />
                                                {item.title}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0">
                                <CardContent className="p-4 space-y-4">
                                    <div className="p-2 bg-white/10 rounded-lg w-fit">
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">Revenue Growth</p>
                                        <p className="text-2xl font-bold">Trend</p>
                                        <p className="text-xs text-gray-400 mt-1">Real-time data</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-4 space-y-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
