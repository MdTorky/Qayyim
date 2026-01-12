import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import PageTransition from "@/components/animations/PageTransition";
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ShoppingCart, TrendingUp, DollarSign, Calendar, ArrowUpRight, Box } from "lucide-react";
import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Charting
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        recentOrders: [],
        chartData: []
    });
    const [loading, setLoading] = useState(true);

    // Mock chart data fallback not needed if API works, but good for type safety 
    // chartData is now in stats


    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/orders/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // navItems are now handled in AdminLayout

    return (
        <PageTransition>
            <AdminLayout>
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                        <div className="flex items-center gap-2 text-gray-500 mt-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/admin/products">
                            <Button className="bg-black text-white hover:bg-gray-800">
                                <Package className="w-4 h-4 mr-2" />
                                Manage Products
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {loading ? '...' : stats.totalRevenue.toLocaleString()}
                                <span className="text-sm font-normal text-muted-foreground ml-1">EGP</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">+20.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
                            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? '...' : stats.totalOrders}</div>
                            <p className="text-xs text-muted-foreground mt-1">+180.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
                            <Box className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? '...' : stats.totalProducts}</div>
                            <p className="text-xs text-muted-foreground mt-1">+12 new products</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                            <Users className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? '...' : stats.totalUsers}</div>
                            <p className="text-xs text-muted-foreground mt-1">+19% from last month</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-8 md:grid-cols-7">
                    {/* Chart Section */}
                    <Card className="col-span-4 p-1">
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                            <CardDescription>
                                Weekly revenue overview
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.chartData && stats.chartData.length > 0 ? stats.chartData : []}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value: number) => `EGP ${value}`}
                                        />
                                        <Tooltip
                                            contentStyle={{ background: '#333', border: 'none', borderRadius: '8px', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#000000"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorTotal)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Orders */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Recent Orders</CardTitle>
                                <Link to="/admin/orders">
                                    <Button variant="ghost" size="sm" className="gap-1">
                                        View All <ArrowUpRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                            <CardDescription>
                                Latest transaction history
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-4 text-sm text-muted-foreground">Loading orders...</div>
                                ) : stats.recentOrders && stats.recentOrders.length > 0 ? (
                                    stats.recentOrders.map((order: any) => (
                                        <div key={order._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <ShoppingCart className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <div className="grid gap-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        Order #{order._id.substring(order._id.length - 6)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold">{order.totalPrice} EGP</p>
                                                <Badge variant={order.isPaid ? "secondary" : "outline"} className={`mt-1 text-xs ${order.isPaid ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'text-yellow-600 border-yellow-200'}`}>
                                                    {order.isPaid ? "Paid" : "Pending"}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-sm text-muted-foreground">No recent orders</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AdminLayout>
        </PageTransition>
    );
};

export default AdminDashboardPage;
