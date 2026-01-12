import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Categories from '../components/home/Categories';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const Section = ({ children, delay = 0 }: { children: ReactNode, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
);

const HomePage = () => {
    return (
        <div className="flex flex-col gap-0">
            <Hero />
            <Section delay={0.1}>
                <Categories />
            </Section>
            <Section delay={0.1}>
                <FeaturedProducts />
            </Section>
            {/* <Section delay={0.1}>
                <PromoSection />
            </Section>
            <Section delay={0.1}>
                <NewArrivals />
            </Section> */}
        </div>
    );
};

export default HomePage;
