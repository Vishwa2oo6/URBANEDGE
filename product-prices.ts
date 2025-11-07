// This file serves as a single source of truth for all product prices.
// To update a price, simply change the value associated with the product ID.

export const PRODUCT_PRICES: { [key: number]: number } = {
  // Sneakers
  1: 2499, // Tech Runner Sneakers
  6: 1999, // High-Top Canvas
  12: 1799, // Retro Runner Sneakers
  13: 1599, // Classic White Sneakers
  
  // Jackets
  2: 2999, // Urban Explorer Jacket
  5: 3999, // Leather Biker Jacket
  8: 3499, // Tailored Wool Blazer
  11: 2299, // Distressed Denim Jacket
  14: 2199, // Essential Bomber Jacket
  
  // Shirts
  3: 1199, // Classic Oxford Shirt
  15: 1499, // Flannel Checkered Shirt
  16: 1399, // Linen Casual Shirt
  
  // T-Shirts
  4: 799, // Graphic T-Shirt
  17: 699, // Striped Crew Neck Tee
  18: 899, // Henley Neck T-Shirt
  24: 1099, // Polo T-Shirt
  
  // Jeans
  7: 1899, // Slim Fit Jeans
  19: 1799, // Relaxed Fit Jeans
  20: 1999, // Black Skinny Jeans
  
  // Accessories
  9: 2199, // Minimalist Leather Watch
  21: 1599, // Canvas Backpack
  22: 999, // Aviator Sunglasses
  26: 699, // Knit Beanie Hat
  
  // Shoes
  10: 2799, // Suede Chelsea Boots
  23: 2599, // Leather Loafers
  25: 3199, // Leather Derby Shoes
};