import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import AdminLayout from '@/components/layout/AdminLayout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from 'lucide-react';

interface Order {
    paymentMethod: string;
    _id: string;
    user: {
        name: string;
    };
    createdAt: string;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    orderStatus: string;
}

const OrderListScreen = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders');
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground mt-2">
                    Track and manage customer orders
                </p>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading orders...</div>
            ) : (
                <div className="rounded-md border bg-white shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {/* <TableHead>ID</TableHead> */}
                                <TableHead>User</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Payment Method</TableHead>
                                <TableHead>Delivery</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    {/* <TableCell className="font-mono text-xs">{order._id.substring(0, 10)}...</TableCell> */}
                                    <TableCell>{order.user?.name || 'Deleted User'}</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{order.totalPrice} EGP</TableCell>
                                    <TableCell>
                                        <Badge variant={order.isPaid ? "secondary" : "outline"} className={order.isPaid ? 'bg-green-100 text-green-800' : 'text-yellow-600 border-yellow-200'}>
                                            {order.isPaid ? `Paid` : "Pending"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className='text-center'>{order.paymentMethod === "CashOnDelivery" ? "Cash" : "Online"}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.isDelivered ? "secondary" : "outline"} className={order.isDelivered ? 'bg-green-100 text-green-800' : 'text-yellow-600 border-yellow-200'}>
                                            {order.isDelivered ? `Delivered` : "Pending"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {order.orderStatus}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link to={`/order/${order._id}`}>
                                            <Button variant="ghost" size="sm" className="gap-2">
                                                <Eye className="w-4 h-4" />
                                                Details
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </AdminLayout>
    );
};

export default OrderListScreen;
