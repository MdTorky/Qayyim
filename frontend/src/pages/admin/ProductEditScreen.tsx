import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, X, Plus, ArrowLeft, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

const ProductEditScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);

    // Images
    const [images, setImages] = useState<string[]>([]);
    const [imageInput, setImageInput] = useState('');

    // Dropdowns
    const [category, setCategory] = useState('Hoodies');
    const [productType, setProductType] = useState('Physical');
    const [gender, setGender] = useState("Men");

    // Variants
    const [sizes, setSizes] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);

    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Options
    const categoryOptions = ['Hoodies', 'Pants', 'Shirts'];
    const genderOptions = ['Men', 'Women', 'Kids'];
    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const colorOptions = [
        'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple',
        'Pink', 'Grey', 'Brown', 'Beige', 'Orange', 'Navy', 'Teal',
        'Maroon', 'Olive', 'Silver', 'Gold'
    ];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setName(data.name);
                setPrice(data.price);
                const initialImages = data.image ? (Array.isArray(data.image) ? data.image : [data.image]) : [];
                setImages(initialImages.filter((img: string) => img !== '/images/sample.jpg'));
                setCategory(data.category);
                setProductType(data.productType || 'Physical');
                const validGenders = ['Men', 'Women', 'Kids'];
                setGender(validGenders.includes(data.gender) ? data.gender : 'Men');
                setSizes(data.sizes || []);
                setColors(data.colors || []);
                setCountInStock(data.countInStock);
                setIsFeatured(data.isFeatured || false);
                setDescription(data.description);
            } catch (error) {
                console.error('Error fetching product details');
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch product details"
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, toast]);

    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        // const newImages: string[] = [];

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append('image', file);
                const { data } = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                return data;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            setImages(prev => [...prev, ...uploadedUrls]);

            toast({
                title: "Success",
                description: `${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded successfully`
            });
        } catch (error) {
            console.error('Error uploading images');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to upload one or more images"
            });
        } finally {
            setUploading(false);
            // Reset the input value so the same files can be selected again if needed (though unlikely)
            e.target.value = '';
        }
    };

    const addImageUrlHandler = () => {
        if (imageInput.trim()) {
            setImages([...images, imageInput.trim()]);
            setImageInput('');
        }
    };

    const removeImageHandler = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const toggleSelection = (list: string[], setList: (l: string[]) => void, item: string) => {
        if (list.includes(item)) {
            setList(list.filter((i) => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/products/${id}`, {
                name,
                price,
                image: images,
                category,
                productType,
                gender,
                countInStock,
                sizes,
                colors,
                isFeatured,
                description,
            });
            toast({
                title: "Success",
                description: "Product updated successfully"
            });
            navigate('/admin/products');
        } catch (error) {
            console.error('Error updating product');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update product"
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <AdminLayout>
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto pb-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate('/admin/products')}
                            className="bg-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {name ? `Edit "${name}"` : 'Edit Product'}
                            </h1>
                            <p className="text-muted-foreground text-sm">Update product information and settings</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/admin/products')}
                        >
                            Discard
                        </Button>
                        <Button
                            onClick={submitHandler}
                            disabled={saving}
                            className="bg-black hover:bg-gray-800 text-white min-w-[120px]"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Info Card */}
                        <Card className="border-0 shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle>Product Information</CardTitle>
                                <CardDescription>Basic details about the product</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Essential Cotton T-Shirt"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe your product..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="min-h-[160px] bg-gray-50 border-gray-200 focus:bg-white transition-colors resize-y"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Media Card */}
                        <Card className="border-0 shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle>Media</CardTitle>
                                <CardDescription>Manage product images</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Image Grid */}
                                {images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        {images.map((img, index) => (
                                            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border bg-gray-50">
                                                <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full"
                                                        onClick={() => removeImageHandler(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Area */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            multiple
                                            onChange={uploadFileHandler}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                        />
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
                                            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
                                        </div>
                                        <p className="font-semibold text-sm">Click to upload image</p>
                                        <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF</p>
                                    </div>

                                    <div className="border border-gray-200 rounded-xl p-6 flex flex-col justify-center space-y-3">
                                        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Add from URL</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="https://"
                                                value={imageInput}
                                                onChange={(e) => setImageInput(e.target.value)}
                                                className="bg-gray-50 border-gray-200"
                                            />
                                            <Button size="icon" variant="secondary" onClick={addImageUrlHandler}>
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Variants Card */}
                        <Card className="border-0 shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle>Variants</CardTitle>
                                <CardDescription>Select available sizes and colors</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label className="mb-3 block">Sizes</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {sizeOptions.map(opt => (
                                            <div
                                                key={opt}
                                                onClick={() => toggleSelection(sizes, setSizes, opt)}
                                                className={cn(
                                                    "cursor-pointer px-4 py-2 rounded-lg border text-sm font-medium transition-all select-none",
                                                    sizes.includes(opt)
                                                        ? "bg-black text-white border-black shadow-sm"
                                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                                )}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label className="mb-3 block">Colors</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {colorOptions.map(opt => (
                                            <div
                                                key={opt}
                                                onClick={() => toggleSelection(colors, setColors, opt)}
                                                className={cn(
                                                    "cursor-pointer px-3 py-2 rounded-lg border flex items-center gap-2 text-sm font-medium transition-all select-none",
                                                    colors.includes(opt)
                                                        ? "bg-gray-50 border-black ring-1 ring-black"
                                                        : "bg-white border-gray-200 hover:border-gray-300"
                                                )}
                                            >
                                                <span
                                                    className="w-3 h-3 rounded-full border border-gray-100 shadow-sm"
                                                    style={{ backgroundColor: opt.toLowerCase() }}
                                                />
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Organization & Status */}
                    <div className="space-y-8">
                        {/* Status Card */}
                        <Card className="border-0 shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Featured Product</Label>
                                        <p className="text-xs text-muted-foreground">Show on home page</p>
                                    </div>
                                    <Switch
                                        checked={isFeatured}
                                        onCheckedChange={setIsFeatured}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Inventory Count</Label>
                                    <Input
                                        type="number"
                                        value={countInStock}
                                        onChange={(e) => setCountInStock(Number(e.target.value))}
                                        className="bg-gray-50 border-gray-200"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing Card */}
                        <Card className="border-0 shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle>Pricing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Base Price</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-serif">EGP</span>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(Number(e.target.value))}
                                            className="pl-12 bg-gray-50 border-gray-200"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Organization Card */}
                        <Card className="border-0 shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle>Organization</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="bg-gray-50 border-gray-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoryOptions.map(opt => (
                                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Gender</Label>
                                    <Select value={gender} onValueChange={setGender}>
                                        <SelectTrigger className="bg-gray-50 border-gray-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {genderOptions.map(opt => (
                                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* <div className="space-y-2">
                                    <Label>Product Type</Label>
                                    <Input
                                        value={productType}
                                        onChange={(e) => setProductType(e.target.value)}
                                        className="bg-gray-50 border-gray-200"
                                    />
                                </div> */}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ProductEditScreen;
