import menuJson from './menu.json';

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  image?: string;
  badge?: {
    text: string;
    color: 'red' | 'green' | 'brown' | 'primary';
  };
}

export interface MenuSubcategory {
  name: string;
  items: MenuItem[];
}

export interface MenuCategory {
  id: string;
  title: string;
  subtitle?: string;
  accentColor: 'primary' | 'accent-red' | 'accent-green';
  subcategories?: MenuSubcategory[];
  items?: MenuItem[];
}

export const menuData: MenuCategory[] = menuJson.categories;

export function formatPrice(price: number): string {
  return `$${price.toLocaleString('es-CO')}`;
}
