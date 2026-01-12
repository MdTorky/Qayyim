export interface ColorDetail {
    name: string;
    nameAr: string;
    hex: string;
}

const COLOR_MAP: Record<string, ColorDetail> = {
    'Black': { name: 'Black', nameAr: 'أسود', hex: '#000000' },
    'White': { name: 'White', nameAr: 'أبيض', hex: '#FFFFFF' },
    'Red': { name: 'Red', nameAr: 'أحمر', hex: '#DC2626' },
    'Blue': { name: 'Blue', nameAr: 'أزرق', hex: '#2563EB' },
    'Green': { name: 'Green', nameAr: 'أخضر', hex: '#16A34A' },
    'Yellow': { name: 'Yellow', nameAr: 'أصفر', hex: '#CA8A04' },
    'Purple': { name: 'Purple', nameAr: 'بنفسجي', hex: '#9333EA' },
    'Pink': { name: 'Pink', nameAr: 'وردي', hex: '#EC4899' },
    'Grey': { name: 'Grey', nameAr: 'رمادي', hex: '#6B7280' },
    'Gray': { name: 'Gray', nameAr: 'رمادي', hex: '#6B7280' },
    'Brown': { name: 'Brown', nameAr: 'بني', hex: '#92400E' },
    'Beige': { name: 'Beige', nameAr: 'بيج', hex: '#D2B48C' },
    'Orange': { name: 'Orange', nameAr: 'برتقالي', hex: '#EA580C' },
    'Navy': { name: 'Navy', nameAr: 'كحلي', hex: '#000080' },
    'Teal': { name: 'Teal', nameAr: 'فيروزي', hex: '#008080' },
    'Maroon': { name: 'Maroon', nameAr: 'عنابي', hex: '#800000' },
    'Olive': { name: 'Olive', nameAr: 'زيتوني', hex: '#808000' },
    'Silver': { name: 'Silver', nameAr: 'فضي', hex: '#C0C0C0' },
    'Gold': { name: 'Gold', nameAr: 'ذهبي', hex: '#FFD700' },
};

export const getColorDetails = (colorName: string): ColorDetail => {
    // Case insensitive lookup
    const found = Object.keys(COLOR_MAP).find(key => key.toLowerCase() === colorName.toLowerCase());
    
    if (found) {
        return COLOR_MAP[found];
    }
    
    // Fallback if not found
    return {
        name: colorName,
        nameAr: colorName, // Fallback to same name if no translation
        hex: colorName     // Fallback to name as hex (valid for standard CSS colors)
    };
};
