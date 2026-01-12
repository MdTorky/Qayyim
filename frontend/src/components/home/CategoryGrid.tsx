import { Link } from 'react-router-dom';

const categories = [
    {
        name: 'Men',
        link: '/products?category=men',
        image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600',
    },
    {
        name: 'Women',
        link: '/products?category=women',
        image: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=600',
    },
    {
        name: 'Accessories',
        link: '/products?category=accessories',
        image: 'https://images.unsplash.com/photo-1523293188086-b4329060bd49?auto=format&fit=crop&q=80&w=600',
    },
];

const CategoryGrid = () => {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center font-cairo">Shop by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <Link key={cat.name} to={cat.link} className="group relative h-80 overflow-hidden rounded-lg">
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity group-hover:bg-black/50">
                                <h3 className="text-2xl font-bold text-white uppercase tracking-wider border-b-2 border-transparent group-hover:border-white transition-all">
                                    {cat.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
