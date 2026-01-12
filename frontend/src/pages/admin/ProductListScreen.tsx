import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Product {
    image: any;
    _id: string;
    name: string;
    price: number;
    category: string;
    countInStock: number;
}

const ProductListScreen = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [loadingDelete]);

    const deleteHandler = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setLoadingDelete(true);
            try {
                await api.delete(`/products/${id}`);
            } catch (error) {
                console.error('Error deleting product');
            } finally {
                setLoadingDelete(false);
            }
        }
    };

    const createProductHandler = async () => {
        setLoadingCreate(true);
        try {
            const { data } = await api.post('/products');
            navigate(`/admin/product/${data._id}/edit`);
        } catch (error) {
            console.error('Error creating product');
        } finally {
            setLoadingCreate(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your product catalog
                    </p>
                </div>
                <Button
                    onClick={createProductHandler}
                    disabled={loadingCreate}
                    className="bg-black text-white hover:bg-gray-800"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    {loadingCreate ? 'Creating...' : 'Add Product'}
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading products...</div>
            ) : (
                <div className="rounded-md border bg-white shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product._id}>
                                    {/* <TableCell className="font-mono text-xs">{product.image.substring(order_id_length_check => order_id_length_check ? 20 : 0)}...</TableCell> */}
                                    <TableCell className="font-mono text-xs"><img src={product.image[0]} alt="" className='w-20 h-20 object-cover' /></TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.price} EGP</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{product.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className={product.countInStock === 0 ? "text-red-500 font-medium" : ""}>
                                            {product.countInStock}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/admin/product/${product._id}/edit`}>
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="w-4 h-4 text-gray-500" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteHandler(product._id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
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

export default ProductListScreen;
