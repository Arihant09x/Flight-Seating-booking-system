import type { Meal } from '../types/booking';

export const meals: Meal[] = [
  {
    id: 'veg',
    name: 'Gourmet Vegetarian Platter',
    description: 'Fresh seasonal greens, paneer tikka wrap, artisan bun and fruit medley.',
    category: 'veg',
    price: 0,
    icon: 'salad',
  },
  {
    id: 'south-indian',
    name: 'Traditional South Indian Breakfast',
    description: 'Steamed rice idlis, medu vada, spiced sambar and fresh coconut dip.',
    category: 'veg',
    price: 150,
    icon: 'soup',
  },
  {
    id: 'non-veg',
    name: 'Herb Grilled Chicken Deluxe',
    description: 'Tender chicken breast, charred asparagus, rosemary potatoes and dinner roll.',
    category: 'non-veg',
    price: 200,
    icon: 'utensils',
  },
  {
    id: 'vegan',
    name: 'Organic Quinoa & Avocado Bowl',
    description: 'Roasted chickpeas, hass avocado, toasted sesame and cold-pressed citrus dressing.',
    category: 'vegan',
    price: 150,
    icon: 'leaf',
  },
  {
    id: 'jain',
    name: 'Satvik Jain Thali',
    description: 'Pure Jain preparation without root vegetables, fresh cottage cheese and parathas.',
    category: 'jain',
    price: 150,
    icon: 'sprout',
  },
];
