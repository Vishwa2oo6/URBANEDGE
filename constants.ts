
import { Product, Category, User, FAQItem } from './types';

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Jackets', imageUrl: 'https://picsum.photos/seed/men-jackets-category/600/800' },
  { id: 2, name: 'Sneakers', imageUrl: 'https://picsum.photos/seed/men-sneakers-category/600/800' },
  { id: 3, name: 'T-Shirts', imageUrl: 'https://picsum.photos/seed/men-tshirts-category/600/800' },
  { id: 4, name: 'Shirts', imageUrl: 'https://picsum.photos/seed/men-shirts-category/600/800' },
  { id: 5, name: 'Accessories', imageUrl: 'https://picsum.photos/seed/men-accessories-category/600/800' },
  { id: 6, name: 'Shoes', imageUrl: 'https://picsum.photos/seed/men-shoes-category/600/800' },
  { id: 7, name: 'Jeans', imageUrl: 'https://picsum.photos/seed/men-jeans-category/600/800' },
];

export const PRODUCTS: Product[] = [
  // Sneakers
  {
    id: 1,
    name: 'Tech Runner Sneakers',
    category: 'Sneakers',
    price: 2499,
    imageUrl: 'https://picsum.photos/seed/tech-runner-sneakers/500/700',
    description: "Designed for men who demand both style and comfort. These sneakers feature a lightweight mesh upper and a responsive sole for all-day wear.",
    fabric: "80% Polyester, 20% Elastane",
    fit: "Regular",
    care: ["Wipe clean with a damp cloth.", "Do not machine wash."]
  },
  {
    id: 6,
    name: 'High-Top Canvas',
    category: 'Sneakers',
    price: 1999,
    imageUrl: 'https://picsum.photos/seed/high-top-canvas/500/700',
    description: "A modern take on a classic silhouette. These high-top sneakers are built with durable canvas and a cushioned footbed for everyday comfort.",
    fabric: "100% Cotton Canvas",
    fit: "Regular",
    care: ["Spot clean only."]
  },
  {
    id: 12,
    name: 'Retro Runner Sneakers',
    category: 'Sneakers',
    price: 1799,
    imageUrl: 'https://picsum.photos/seed/retro-runners/500/700',
    description: "Inspired by vintage running shoes, this pair combines suede and nylon for a retro look with modern comfort and durability.",
    fabric: "Suede, Nylon, Rubber Sole",
    fit: "Regular",
    care: ["Spot clean with a damp cloth."]
  },
  {
    id: 13,
    name: 'Classic White Sneakers',
    category: 'Sneakers',
    price: 1599,
    imageUrl: 'https://picsum.photos/seed/classic-white-sneakers/500/700',
    description: "An absolute wardrobe staple. These minimalist white sneakers are crafted from faux leather for a clean, versatile look that pairs with anything.",
    fabric: "Polyurethane Upper, Rubber Sole",
    fit: "Regular",
    care: ["Wipe clean with a damp cloth."]
  },
  // Jackets
  {
    id: 2,
    name: 'Urban Explorer Jacket',
    category: 'Jackets',
    price: 2999,
    imageUrl: 'https://picsum.photos/seed/urban-explorer-jacket/500/700',
    description: "A versatile jacket crafted for the modern explorer. Water-resistant fabric and multiple pockets make it perfect for any urban adventure.",
    fabric: "100% Nylon Shell, 100% Polyester Lining",
    fit: "Regular",
    care: ["Machine wash cold.", "Tumble dry low."]
  },
  {
    id: 5,
    name: 'Leather Biker Jacket',
    category: 'Jackets',
    price: 3999,
    imageUrl: 'https://picsum.photos/seed/leather-biker-jacket/500/700',
    description: "Crafted from genuine leather, this biker jacket is an icon of rebellious style. Features asymmetrical zips and a belted waist.",
    fabric: "100% Genuine Leather",
    fit: "Slim",
    care: ["Professional leather clean only."]
  },
  {
    id: 8,
    name: 'Tailored Wool Blazer',
    category: 'Jackets',
    price: 3499,
    imageUrl: 'https://picsum.photos/seed/wool-blazer-man/500/700',
    description: "Sharpen your look with this impeccably tailored wool blazer. A single-breasted design with notched lapels for a classic, polished finish.",
    fabric: "90% Wool, 10% Polyamide",
    fit: "Slim",
    care: ["Dry clean only."]
  },
  {
    id: 11,
    name: 'Distressed Denim Jacket',
    category: 'Jackets',
    price: 2299,
    imageUrl: 'https://picsum.photos/seed/distressed-denim-jacket/500/700',
    description: "A timeless classic with a modern edge. This denim jacket features subtle distressing for a lived-in feel from the very first wear.",
    fabric: "100% Cotton Denim",
    fit: "Regular",
    care: ["Machine wash cold, inside out.", "Hang to dry."]
  },
  {
    id: 14,
    name: 'Essential Bomber Jacket',
    category: 'Jackets',
    price: 2199,
    imageUrl: 'https://picsum.photos/seed/bomber-jacket-olive/500/700',
    description: "A lightweight bomber jacket that's perfect for layering. Features a ribbed collar, cuffs, and hem for a classic fit.",
    fabric: "100% Polyester",
    fit: "Regular",
    care: ["Machine wash cold.", "Tumble dry low."]
  },
  // Shirts
  {
    id: 3,
    name: 'Classic Oxford Shirt',
    category: 'Shirts',
    price: 1199,
    imageUrl: 'https://picsum.photos/seed/oxford-shirt-blue/500/700',
    description: "The timeless Oxford shirt, reimagined. Made from premium cotton with a modern slim fit, it’s a wardrobe essential that elevates any look.",
    fabric: "100% Premium Cotton",
    fit: "Slim",
    care: ["Machine wash warm.", "Iron on medium heat."]
  },
  {
    id: 15,
    name: 'Flannel Checkered Shirt',
    category: 'Shirts',
    price: 1499,
    imageUrl: 'https://picsum.photos/seed/flannel-checkered-shirt/500/700',
    description: "Soft, durable, and effortlessly cool. This flannel shirt features a classic checkered pattern, perfect for a rugged, layered look.",
    fabric: "100% Cotton Flannel",
    fit: "Regular",
    care: ["Machine wash cold.", "Tumble dry medium."]
  },
  {
    id: 16,
    name: 'Linen Casual Shirt',
    category: 'Shirts',
    price: 1399,
    imageUrl: 'https://picsum.photos/seed/linen-casual-shirt/500/700',
    description: "Stay cool and comfortable in this breathable linen shirt. The relaxed fit makes it ideal for warm weather and casual occasions.",
    fabric: "55% Linen, 45% Cotton",
    fit: "Relaxed",
    care: ["Machine wash cold.", "Hang to dry."]
  },
  // T-Shirts
  {
    id: 4,
    name: 'Graphic T-Shirt',
    category: 'T-Shirts',
    price: 799,
    imageUrl: 'https://picsum.photos/seed/graphic-tshirt-black/500/700',
    description: "Make a statement with our signature graphic t-shirt. The relaxed fit and soft cotton provide ultimate comfort and style.",
    fabric: "100% Cotton",
    fit: "Regular",
    care: ["Machine wash cold with like colors.", "Hang to dry."]
  },
  {
    id: 17,
    name: 'Striped Crew Neck Tee',
    category: 'T-Shirts',
    price: 699,
    imageUrl: 'https://picsum.photos/seed/striped-crew-neck/500/700',
    description: "A timeless staple, this striped t-shirt adds a touch of nautical charm to any outfit. Made from soft, breathable cotton.",
    fabric: "100% Cotton",
    fit: "Regular",
    care: ["Machine wash cold.", "Tumble dry low."]
  },
  {
    id: 18,
    name: 'Henley Neck T-Shirt',
    category: 'T-Shirts',
    price: 899,
    imageUrl: 'https://picsum.photos/seed/henley-neck-tshirt/500/700',
    description: "A stylish alternative to the classic crew neck. This long-sleeve Henley is made from a soft waffle-knit fabric for added texture and warmth.",
    fabric: "95% Cotton, 5% Spandex",
    fit: "Slim",
    care: ["Machine wash cold.", "Tumble dry low."]
  },
  // Jeans
  {
    id: 7,
    name: 'Slim Fit Jeans',
    category: 'Jeans',
    price: 1899,
    imageUrl: 'https://picsum.photos/seed/slim-fit-jeans-blue/500/700',
    description: "Function meets fashion. These slim fit jeans offer a modern silhouette, crafted from a durable cotton denim with a hint of stretch.",
    fabric: "98% Cotton, 2% Spandex",
    fit: "Slim",
    care: ["Machine wash cold.", "Tumble dry low."]
  },
  {
    id: 19,
    name: 'Relaxed Fit Jeans',
    category: 'Jeans',
    price: 1799,
    imageUrl: 'https://picsum.photos/seed/relaxed-fit-jeans/500/700',
    description: "For a more comfortable, casual look. These relaxed fit jeans provide extra room through the seat and thigh, without sacrificing style.",
    fabric: "100% Cotton Denim",
    fit: "Relaxed",
    care: ["Machine wash cold.", "Tumble dry low."]
  },
  {
    id: 20,
    name: 'Black Skinny Jeans',
    category: 'Jeans',
    price: 1999,
    imageUrl: 'https://picsum.photos/seed/black-skinny-jeans/500/700',
    description: "A modern essential for any wardrobe. Our skinny jeans are crafted with high-stretch denim for a sharp, clean look and all-day comfort.",
    fabric: "97% Cotton, 3% Elastane",
    fit: "Skinny",
    care: ["Machine wash cold, inside out.", "Hang to dry."]
  },
  // Accessories
  {
    id: 9,
    name: 'Minimalist Leather Watch',
    category: 'Accessories',
    price: 2199,
    imageUrl: 'https://picsum.photos/seed/minimalist-watch/500/700',
    description: "Elegance in simplicity. This watch features a clean, numberless dial and a genuine leather strap for a sophisticated, modern aesthetic.",
    fabric: "Stainless Steel, Genuine Leather",
    fit: "Adjustable",
    care: ["Avoid contact with water.", "Wipe with a soft cloth."]
  },
  {
    id: 21,
    name: 'Canvas Backpack',
    category: 'Accessories',
    price: 1599,
    imageUrl: 'https://picsum.photos/seed/canvas-backpack/500/700',
    description: "Durable and stylish, this canvas backpack is perfect for daily commutes or weekend trips. Features a padded laptop sleeve and multiple pockets.",
    fabric: "100% Cotton Canvas, Leather Accents",
    fit: "N/A",
    care: ["Spot clean only."]
  },
  {
    id: 22,
    name: 'Aviator Sunglasses',
    category: 'Accessories',
    price: 999,
    imageUrl: 'https://picsum.photos/seed/aviator-sunglasses/500/700',
    description: "A timeless design that never goes out of style. These aviator sunglasses feature a lightweight metal frame and polarized lenses for UV protection.",
    fabric: "Metal Alloy, Polycarbonate Lenses",
    fit: "N/A",
    care: ["Clean with lens cloth.", "Store in case."]
  },
  // Shoes
  {
    id: 10,
    name: 'Suede Chelsea Boots',
    category: 'Shoes',
    price: 2799,
    imageUrl: 'https://picsum.photos/seed/suede-chelsea-boots/500/700',
    description: "The perfect blend of casual and formal. Our Chelsea boots are made from rich suede with elasticated side panels for a comfortable, slip-on style.",
    fabric: "100% Suede Upper",
    fit: "Regular",
    care: ["Use a suede brush and protector spray."]
  },
  {
    id: 23,
    name: 'Leather Loafers',
    category: 'Shoes',
    price: 2599,
    imageUrl: 'https://picsum.photos/seed/leather-loafers/500/700',
    description: "Effortlessly sophisticated, these leather loafers are perfect for smart-casual occasions. Features a classic penny-slot detail and comfortable sole.",
    fabric: "100% Genuine Leather Upper",
    fit: "Regular",
    care: ["Use leather conditioner.", "Wipe clean."]
  },
];

export const USER: User = {
    name: "Alex Mercer",
    email: "alex.mercer@example.com",
    memberSince: "June 2023",
};

export const FAQS: FAQItem[] = [
  {
    question: "What is your shipping policy?",
    answer: "We offer free standard shipping on all orders above ₹999. For orders below this amount, a flat rate of ₹50 applies. Express shipping is also available at an additional cost. Standard shipping typically takes 3-5 business days within India."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order has shipped, you will receive an email with a tracking number and a link to our 'Order Tracking' page. You can enter your order ID on that page to see the latest updates on your delivery."
  },
  {
    question: "What is your return policy?",
    answer: "We offer 7-Day Easy Returns. Items must be in their original condition, unworn, and with all tags attached. To initiate a return, please visit our 'Returns' page or contact our support team."
  },
  {
    question: "How do I know what size to order?",
    answer: "Each product page includes a detailed 'Fit' description (e.g., Slim, Regular, Oversized). We recommend comparing these details to a similar item you already own to find the perfect size."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard), UPI, and Cash on Delivery (COD). All transactions are secure and encrypted."
  }
];
