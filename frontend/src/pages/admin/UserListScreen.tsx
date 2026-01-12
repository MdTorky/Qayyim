import { useEffect, useState } from 'react';
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
import { Trash2, UserCog } from 'lucide-react';

interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    isAdmin: boolean;
}

const UserListScreen = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/users');
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const deleteHandler = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
            } catch (error) {
                console.error('Error deleting user');
            }
        }
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground mt-2">
                    Manage system users and permissions
                </p>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading users...</div>
            ) : (
                <div className="rounded-md border bg-white shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell className="font-mono text-xs">{user._id.substring(0, 10)}...</TableCell>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell><a href={`mailto:${user.email}`} className="hover:underline text-blue-600">{user.email}</a></TableCell>
                                    <TableCell>{user.phone || '-'}</TableCell>
                                    <TableCell>
                                        {user.isAdmin ? (
                                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200">
                                                <UserCog className="w-3 h-3 mr-1" /> Admin
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">User</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {!user.isAdmin && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteHandler(user._id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
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

export default UserListScreen;
