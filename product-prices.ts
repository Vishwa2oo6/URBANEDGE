
// This file serves as a single source of truth for all product prices.
// To update a price, simply change the value associated with the product ID.

export const PRODUCT_PRICES: { [key: number]: number } = {
  // Sneakers (Previously ~2000-2500, now 799-999)
  1: 999, // Tech Runner Sneakers
  6: 899, // High-Top Canvas
  12: 799, // Retro Runner Sneakers
  13: 799, // Classic White Sneakers
  
  // Jackets (Previously ~2500-4000, now 999-1499)
  2: 1299, // Urban Explorer Jacket
  5: 1999, // Leather Biker Jacket
  8: 1799, // Tailored Wool Blazer
  11: 1099, // Distressed Denim Jacket
  14: 999, // Essential Bomber Jacket
  
  // Shirts (Previously ~1200-1500, now 599-699)
  3: 599, // Classic Oxford Shirt
  15: 699, // Flannel Checkered Shirt
  16: 699, // Linen Casual Shirt
  
  // T-Shirts (Previously ~800-1100, now 299-499)
  4: 299, // Graphic T-Shirt
  17: 299, // Striped Crew Neck Tee
  18: 399, // Henley Neck T-Shirt
  24: 499, // Polo T-Shirt
  
  // Jeans (Previously ~1800-2000, now 899-999)
  7: 899, // Slim Fit Jeans
  19: 899, // Relaxed Fit Jeans
  20: 999, // Black Skinny Jeans
  
  // Accessories (Previously ~1000-2200, now 199-999)
  9: 999, // Minimalist Leather Watch
  21: 799, // Canvas Backpack
  22: 399, // Aviator Sunglasses
  26: 199, // Knit Beanie Hat
  
  // Shoes (Previously ~2600-3200, now 1199-1499)
  10: 1399, // Suede Chelsea Boots
  23: 1199, // Leather Loafers
  25: 1499, // Leather Derby Shoes
};
