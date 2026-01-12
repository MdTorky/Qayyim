export interface Governorate {
    id: string;
    nameAr: string;
    nameEn: string;
    shippingFee: number;
}

export const governates: Governorate[] = [
    { id: 'CAIRO', nameAr: 'القاهرة', nameEn: 'Cairo', shippingFee: 50 },
    { id: 'GIZA', nameAr: 'الجيزة', nameEn: 'Giza', shippingFee: 50 },
    { id: 'ALEXANDRIA', nameAr: 'الإسكندرية', nameEn: 'Alexandria', shippingFee: 60 },
    { id: 'DAKAHLIA', nameAr: 'الدقهلية', nameEn: 'Dakahlia', shippingFee: 70 },
    { id: 'RED_SEA', nameAr: 'البحر الأحمر', nameEn: 'Red Sea', shippingFee: 100 },
    { id: 'BEHEIRA', nameAr: 'البحيرة', nameEn: 'Beheira', shippingFee: 70 },
    { id: 'FAYOUM', nameAr: 'الفيوم', nameEn: 'Fayoum', shippingFee: 75 },
    { id: 'GHARBIYA', nameAr: 'الغربية', nameEn: 'Gharbiya', shippingFee: 70 },
    { id: 'ISMAILIA', nameAr: 'الإسماعيلية', nameEn: 'Ismailia', shippingFee: 75 },
    { id: 'MONUFIA', nameAr: 'المنوفية', nameEn: 'Monufia', shippingFee: 70 },
    { id: 'MINYA', nameAr: 'المنيا', nameEn: 'Minya', shippingFee: 85 },
    { id: 'QALYUBIA', nameAr: 'القليوبية', nameEn: 'Qalyubia', shippingFee: 60 },
    { id: 'NEW_VALLEY', nameAr: 'الوادي الجديد', nameEn: 'New Valley', shippingFee: 120 },
    { id: 'SUEZ', nameAr: 'السويس', nameEn: 'Suez', shippingFee: 75 },
    { id: 'ASWAN', nameAr: 'أسوان', nameEn: 'Aswan', shippingFee: 120 },
    { id: 'ASSIUT', nameAr: 'أسيوط', nameEn: 'Assiut', shippingFee: 90 },
    { id: 'BENI_SUEF', nameAr: 'بني سويف', nameEn: 'Beni Suef', shippingFee: 80 },
    { id: 'PORT_SAID', nameAr: 'بورسعيد', nameEn: 'Port Said', shippingFee: 75 },
    { id: 'DAMIETTA', nameAr: 'دمياط', nameEn: 'Damietta', shippingFee: 70 },
    { id: 'SHARQIA', nameAr: 'الشرقية', nameEn: 'Sharqia', shippingFee: 70 },
    { id: 'SOUTH_SINAI', nameAr: 'جنوب سيناء', nameEn: 'South Sinai', shippingFee: 150 },
    { id: 'KAFR_EL_SHEIKH', nameAr: 'كفر الشيخ', nameEn: 'Kafr El Sheikh', shippingFee: 70 },
    { id: 'MATROUH', nameAr: 'مطروح', nameEn: 'Matrouh', shippingFee: 100 },
    { id: 'LUXOR', nameAr: 'الأقصر', nameEn: 'Luxor', shippingFee: 110 },
    { id: 'QENA', nameAr: 'قنا', nameEn: 'Qena', shippingFee: 100 },
    { id: 'NORTH_SINAI', nameAr: 'شمال سيناء', nameEn: 'North Sinai', shippingFee: 150 },
    { id: 'SOHAG', nameAr: 'سوهاج', nameEn: 'Sohag', shippingFee: 95 },
];

export const getShippingFee = (governorateName: string, subtotal: number): number => {
    // Free shipping threshold (e.g., 2000 EGP)
    const FREE_SHIPPING_THRESHOLD = 2000;
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;

    const gov = governates.find(
        g => g.nameEn.toLowerCase() === governorateName.toLowerCase() || 
             g.nameAr === governorateName
    );
    return gov ? gov.shippingFee : 100; // Default fallback fee
};

export const getGovernorateOptions = (lang: 'en' | 'ar' = 'en') => {
    return governates.map(g => ({
        value: g.nameEn, // Storing English name as value for consistency in backend/frontend logic usually, or ID. Let's use English Name for now as the current address schema likely uses strings.
        label: lang === 'ar' ? g.nameAr : g.nameEn
    }));
};
