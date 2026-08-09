import type { ClothingItem } from './types'

// Sample catalog for demo purposes. Prices, SKUs, and stock are illustrative,
// not live inventory. "Shop" links open a web search for the item at the
// listed retailer rather than a specific (and possibly stale) product page.
export const items: ClothingItem[] = [
  // ---------- FEMININE ----------
  { id: 'f-top-01', name: 'Silk Cami Blouse', category: 'top', brand: 'Reformation', retailer: 'Reformation', sku: 'REF-1042-IVY', price: 128, color: '#f3ead9', colorName: 'Ivory', tags: ['minimalist', 'romantic', 'glam', 'silk', 'blouse'] },
  { id: 'f-top-02', name: 'Crisp Cotton Button-Down', category: 'top', brand: 'Everlane', retailer: 'Everlane', sku: 'EVR-2210-WHT', price: 68, color: '#ffffff', colorName: 'White', tags: ['minimalist', 'classic', 'office', 'shirt'] },
  { id: 'f-top-03', name: 'Ribbed Turtleneck', category: 'top', brand: 'COS', retailer: 'COS', sku: 'COS-3387-BLK', price: 59, color: '#1a1a1a', colorName: 'Black', tags: ['minimalist', 'classic', 'edgy', 'sweater'] },
  { id: 'f-top-04', name: 'Sequin Tank', category: 'top', brand: 'Free People', retailer: 'Free People', sku: 'FP-5521-SLV', price: 88, color: '#c7cdd6', colorName: 'Silver', tags: ['glam', 'night-out', 'sequin', 'flashy'] },
  { id: 'f-top-05', name: 'Oversized Graphic Tee', category: 'top', brand: 'Brandy Melville', retailer: 'Brandy Melville', sku: 'BM-0093-WHT', price: 32, color: '#f5f5f5', colorName: 'White', tags: ['streetwear', 'casual', 'tee'] },
  { id: 'f-top-06', name: 'Linen Wrap Top', category: 'top', brand: 'Reformation', retailer: 'Reformation', sku: 'REF-1188-SGE', price: 98, color: '#a3ad8e', colorName: 'Sage', tags: ['boho', 'romantic', 'linen'] },

  { id: 'f-bottom-01', name: 'Tailored Trousers', category: 'bottom', brand: 'Massimo Dutti', retailer: 'Massimo Dutti', sku: 'MD-6602-BLK', price: 119, color: '#1a1a1a', colorName: 'Black', tags: ['minimalist', 'classic', 'office', 'trousers'] },
  { id: 'f-bottom-02', name: 'Wide-Leg Jeans', category: 'bottom', brand: "Levi's", retailer: "Levi's", sku: 'LEV-7714-MID', price: 98, color: '#6f8faf', colorName: 'Mid-Wash Blue', tags: ['streetwear', 'classic', 'casual', 'denim', 'jeans'] },
  { id: 'f-bottom-03', name: 'Pleated Midi Skirt', category: 'bottom', brand: '& Other Stories', retailer: '& Other Stories', sku: 'AOS-4471-CML', price: 89, color: '#c3a074', colorName: 'Camel', tags: ['romantic', 'classic', 'skirt'] },
  { id: 'f-bottom-04', name: 'High-Waist Bike Shorts', category: 'bottom', brand: 'Nike', retailer: 'Nike', sku: 'NKE-3305-BLK', price: 45, color: '#1a1a1a', colorName: 'Black', tags: ['sporty', 'gym', 'shorts'] },
  { id: 'f-bottom-05', name: 'Cargo Pants', category: 'bottom', brand: 'Zara', retailer: 'Zara', sku: 'ZR-8820-OLV', price: 59, color: '#6b7052', colorName: 'Olive', tags: ['streetwear', 'cargo'] },
  { id: 'f-bottom-06', name: 'Sequin Mini Skirt', category: 'bottom', brand: 'ASOS', retailer: 'ASOS', sku: 'ASO-9921-GLD', price: 55, color: '#d4af37', colorName: 'Gold', tags: ['glam', 'night-out', 'sequin', 'flashy'] },

  { id: 'f-dress-01', name: 'Little Black Dress', category: 'dress', brand: 'Reformation', retailer: 'Reformation', sku: 'REF-2201-BLK', price: 158, color: '#1a1a1a', colorName: 'Black', tags: ['classic', 'glam', 'date-night', 'wedding-guest', 'dress'] },
  { id: 'f-dress-02', name: 'Floral Wrap Dress', category: 'dress', brand: 'Free People', retailer: 'Free People', sku: 'FP-3348-FLR', price: 128, color: '#c76b7a', colorName: 'Floral Print', tags: ['romantic', 'boho', 'wedding-guest', 'dress'] },
  { id: 'f-dress-03', name: 'Sequin Cocktail Dress', category: 'dress', brand: 'ASOS', retailer: 'ASOS', sku: 'ASO-4102-GLD', price: 95, color: '#d4af37', colorName: 'Gold', tags: ['glam', 'night-out', 'gala', 'sequin', 'flashy', 'dress'] },
  { id: 'f-dress-04', name: 'Column Evening Gown', category: 'dress', brand: 'BHLDN', retailer: 'BHLDN', sku: 'BHL-0071-NVY', price: 320, color: '#1e2a4a', colorName: 'Navy', tags: ['glam', 'gala', 'formal', 'dress'] },
  { id: 'f-dress-05', name: 'Cotton Sundress', category: 'dress', brand: 'Mango', retailer: 'Mango', sku: 'MNG-6690-YLW', price: 65, color: '#e8c94a', colorName: 'Yellow', tags: ['boho', 'beach', 'casual', 'dress'] },
  { id: 'f-dress-06', name: 'Silk Slip Dress', category: 'dress', brand: 'Reformation', retailer: 'Reformation', sku: 'REF-1975-CHM', price: 178, color: '#e8cdb0', colorName: 'Champagne', tags: ['minimalist', 'romantic', 'date-night', 'dress'] },

  { id: 'f-outer-01', name: 'Wool Trench Coat', category: 'outerwear', brand: 'Massimo Dutti', retailer: 'Massimo Dutti', sku: 'MD-1123-CML', price: 249, color: '#c3a074', colorName: 'Camel', tags: ['classic', 'minimalist', 'office', 'coat'] },
  { id: 'f-outer-02', name: 'Leather Moto Jacket', category: 'outerwear', brand: 'AllSaints', retailer: 'AllSaints', sku: 'ALS-2298-BLK', price: 398, color: '#1a1a1a', colorName: 'Black', tags: ['edgy', 'streetwear', 'jacket', 'leather jacket'] },
  { id: 'f-outer-03', name: 'Cropped Denim Jacket', category: 'outerwear', brand: "Levi's", retailer: "Levi's", sku: 'LEV-4471-LBL', price: 78, color: '#7a9ac4', colorName: 'Light Blue', tags: ['streetwear', 'casual', 'jacket', 'denim jacket'] },
  { id: 'f-outer-04', name: 'Chunky Knit Cardigan', category: 'outerwear', brand: 'Uniqlo', retailer: 'Uniqlo', sku: 'UNQ-8845-GRY', price: 49, color: '#8a8a8a', colorName: 'Grey', tags: ['minimalist', 'boho', 'casual', 'cardigan'] },
  { id: 'f-outer-05', name: 'Faux Fur Stole', category: 'outerwear', brand: 'ASOS', retailer: 'ASOS', sku: 'ASO-7712-BLK', price: 72, color: '#2b2b2b', colorName: 'Black', tags: ['glam', 'gala', 'stole', 'flashy'] },

  { id: 'f-shoes-01', name: 'Pointed-Toe Pumps', category: 'shoes', brand: 'Sam Edelman', retailer: 'Sam Edelman', sku: 'SE-3321-NUD', price: 130, color: '#d9b99b', colorName: 'Nude', tags: ['classic', 'office', 'interview', 'heels'] },
  { id: 'f-shoes-02', name: 'White Leather Sneakers', category: 'shoes', brand: 'Adidas', retailer: 'Adidas', sku: 'ADI-1002-WHT', price: 100, color: '#f5f5f5', colorName: 'White', tags: ['minimalist', 'streetwear', 'casual', 'sneakers'] },
  { id: 'f-shoes-03', name: 'Leather Ankle Boots', category: 'shoes', brand: 'Dr. Martens', retailer: 'Dr. Martens', sku: 'DRM-5567-BLK', price: 170, color: '#1a1a1a', colorName: 'Black', tags: ['edgy', 'streetwear', 'boots'] },
  { id: 'f-shoes-04', name: 'Strappy Heeled Sandals', category: 'shoes', brand: 'Steve Madden', retailer: 'Steve Madden', sku: 'SM-9903-GLD', price: 90, color: '#d4af37', colorName: 'Gold', tags: ['glam', 'night-out', 'gala', 'flashy', 'heels'] },
  { id: 'f-shoes-05', name: 'Ballet Flats', category: 'shoes', brand: 'Aldo', retailer: 'Aldo', sku: 'ALD-2214-BLK', price: 75, color: '#1a1a1a', colorName: 'Black', tags: ['classic', 'minimalist', 'office', 'flats'] },
  { id: 'f-shoes-06', name: 'Running Shoes', category: 'shoes', brand: 'Nike', retailer: 'Nike', sku: 'NKE-6671-PNK', price: 110, color: '#e88fa8', colorName: 'Black / Pink', tags: ['sporty', 'gym', 'sneakers'] },
  { id: 'f-shoes-07', name: 'Espadrille Sandals', category: 'shoes', brand: 'Mango', retailer: 'Mango', sku: 'MNG-3390-TAN', price: 55, color: '#c9a876', colorName: 'Tan', tags: ['boho', 'beach', 'sandals'] },

  { id: 'f-bag-01', name: 'Structured Leather Tote', category: 'bag', brand: 'Coach', retailer: 'Coach', sku: 'COA-1187-BLK', price: 350, color: '#1a1a1a', colorName: 'Black', tags: ['classic', 'office', 'minimalist', 'tote'] },
  { id: 'f-bag-02', name: 'Mini Crossbody Bag', category: 'bag', brand: 'Kate Spade', retailer: 'Kate Spade', sku: 'KS-2245-RED', price: 198, color: '#a4222c', colorName: 'Red', tags: ['classic', 'date-night', 'crossbody'] },
  { id: 'f-bag-03', name: 'Straw Beach Bag', category: 'bag', brand: 'Mango', retailer: 'Mango', sku: 'MNG-5581-NAT', price: 40, color: '#d9c49a', colorName: 'Natural', tags: ['boho', 'beach', 'straw bag'] },
  { id: 'f-bag-04', name: 'Sequin Clutch', category: 'bag', brand: 'ASOS', retailer: 'ASOS', sku: 'ASO-6673-SLV', price: 48, color: '#c7cdd6', colorName: 'Silver', tags: ['glam', 'night-out', 'gala', 'flashy', 'clutch'] },
  { id: 'f-bag-05', name: 'Gym Duffel', category: 'bag', brand: 'Nike', retailer: 'Nike', sku: 'NKE-9012-BLK', price: 60, color: '#1a1a1a', colorName: 'Black', tags: ['sporty', 'gym', 'duffel'] },

  { id: 'f-acc-01', name: 'Pearl Stud Earrings', category: 'accessory', brand: 'Mejuri', retailer: 'Mejuri', sku: 'MEJ-1123-PRL', price: 68, color: '#f2efe6', colorName: 'Pearl', tags: ['classic', 'wedding-guest', 'interview', 'earrings'] },
  { id: 'f-acc-02', name: 'Statement Chandelier Earrings', category: 'accessory', brand: 'BaubleBar', retailer: 'BaubleBar', sku: 'BB-4478-GLD', price: 38, color: '#d4af37', colorName: 'Gold', tags: ['glam', 'night-out', 'flashy', 'earrings'] },
  { id: 'f-acc-03', name: 'Delicate Gold Necklace', category: 'accessory', brand: 'Mejuri', retailer: 'Mejuri', sku: 'MEJ-2290-GLD', price: 85, color: '#d4af37', colorName: 'Gold', tags: ['minimalist', 'classic', 'necklace'] },
  { id: 'f-acc-04', name: 'Printed Silk Scarf', category: 'accessory', brand: 'Zara', retailer: 'Zara', sku: 'ZR-3345-PRT', price: 26, color: '#b5533c', colorName: 'Printed', tags: ['boho', 'classic', 'scarf'] },
  { id: 'f-acc-05', name: 'Black Sunglasses', category: 'accessory', brand: 'Ray-Ban', retailer: 'Ray-Ban', sku: 'RB-5512-BLK', price: 163, color: '#1a1a1a', colorName: 'Black', tags: ['minimalist', 'streetwear', 'sunglasses'] },
  { id: 'f-acc-06', name: 'Slim Watch', category: 'accessory', brand: 'Fossil', retailer: 'Fossil', sku: 'FOS-8871-SLV', price: 95, color: '#c7cdd6', colorName: 'Silver', tags: ['classic', 'office', 'watch'] },

  // ---------- MASCULINE ----------
  { id: 'm-top-01', name: 'Oxford Button-Down', category: 'top', brand: 'J.Crew', retailer: 'J.Crew', sku: 'JC-1145-LBL', price: 78, color: '#a9c1de', colorName: 'Light Blue', tags: ['classic', 'office', 'interview', 'shirt'] },
  { id: 'm-top-02', name: 'Crewneck Tee', category: 'top', brand: 'Uniqlo', retailer: 'Uniqlo', sku: 'UNQ-2201-WHT', price: 15, color: '#ffffff', colorName: 'White', tags: ['minimalist', 'casual', 'streetwear', 'tee'] },
  { id: 'm-top-03', name: 'Merino Wool Sweater', category: 'top', brand: 'COS', retailer: 'COS', sku: 'COS-4471-NVY', price: 99, color: '#1e2a4a', colorName: 'Navy', tags: ['classic', 'minimalist', 'sweater'] },
  { id: 'm-top-04', name: 'Graphic Hoodie', category: 'top', brand: 'Nike', retailer: 'Nike', sku: 'NKE-3387-BLK', price: 65, color: '#1a1a1a', colorName: 'Black', tags: ['streetwear', 'sporty', 'hoodie'] },
  { id: 'm-top-05', name: 'Linen Shirt', category: 'top', brand: 'Banana Republic', retailer: 'Banana Republic', sku: 'BR-5521-WHT', price: 89, color: '#f5f2e9', colorName: 'White', tags: ['boho', 'beach', 'linen', 'shirt'] },
  { id: 'm-top-06', name: 'Metallic Printed Shirt', category: 'top', brand: 'AllSaints', retailer: 'AllSaints', sku: 'ALS-6602-BLK', price: 110, color: '#3a3a3a', colorName: 'Black Print', tags: ['glam', 'night-out', 'flashy', 'shirt'] },

  { id: 'm-bottom-01', name: 'Wool Dress Trousers', category: 'bottom', brand: 'Ralph Lauren', retailer: 'Ralph Lauren', sku: 'RL-7712-CHR', price: 148, color: '#4a4a4a', colorName: 'Charcoal', tags: ['classic', 'office', 'interview', 'trousers'] },
  { id: 'm-bottom-02', name: 'Slim Denim Jeans', category: 'bottom', brand: "Levi's", retailer: "Levi's", sku: 'LEV-3391-DRK', price: 78, color: '#33475b', colorName: 'Dark Wash', tags: ['classic', 'streetwear', 'casual', 'denim', 'jeans'] },
  { id: 'm-bottom-03', name: 'Chino Shorts', category: 'bottom', brand: 'J.Crew', retailer: 'J.Crew', sku: 'JC-9902-KHK', price: 58, color: '#c3a876', colorName: 'Khaki', tags: ['classic', 'casual', 'beach', 'shorts'] },
  { id: 'm-bottom-04', name: 'Track Pants', category: 'bottom', brand: 'Adidas', retailer: 'Adidas', sku: 'ADI-4471-BLK', price: 60, color: '#1a1a1a', colorName: 'Black', tags: ['sporty', 'gym', 'streetwear', 'track pants'] },
  { id: 'm-bottom-05', name: 'Cargo Pants', category: 'bottom', brand: 'Zara', retailer: 'Zara', sku: 'ZR-2298-OLV', price: 65, color: '#6b7052', colorName: 'Olive', tags: ['streetwear', 'cargo'] },

  { id: 'm-suit-01', name: 'Two-Piece Wool Suit', category: 'outerwear', brand: 'Ralph Lauren', retailer: 'Ralph Lauren', sku: 'RL-1102-NVY', price: 495, color: '#1e2a4a', colorName: 'Navy', tags: ['classic', 'office', 'interview', 'wedding-guest', 'formal', 'suit'] },
  { id: 'm-suit-02', name: 'Tuxedo Jacket & Trousers', category: 'outerwear', brand: 'Hugo Boss', retailer: 'Hugo Boss', sku: 'HB-2247-BLK', price: 650, color: '#0d0d0d', colorName: 'Black', tags: ['glam', 'gala', 'formal', 'tuxedo'] },
  { id: 'm-suit-03', name: 'Linen Suit', category: 'outerwear', brand: 'Banana Republic', retailer: 'Banana Republic', sku: 'BR-3390-TAN', price: 298, color: '#c9a876', colorName: 'Tan', tags: ['classic', 'boho', 'wedding-guest', 'beach', 'suit'] },

  { id: 'm-outer-01', name: 'Wool Overcoat', category: 'outerwear', brand: 'Massimo Dutti', retailer: 'Massimo Dutti', sku: 'MD-2298-CHR', price: 279, color: '#4a4a4a', colorName: 'Charcoal', tags: ['classic', 'office', 'coat'] },
  { id: 'm-outer-02', name: 'Leather Jacket', category: 'outerwear', brand: 'AllSaints', retailer: 'AllSaints', sku: 'ALS-3345-BLK', price: 448, color: '#1a1a1a', colorName: 'Black', tags: ['edgy', 'streetwear', 'jacket', 'leather jacket'] },
  { id: 'm-outer-03', name: 'Denim Jacket', category: 'outerwear', brand: "Levi's", retailer: "Levi's", sku: 'LEV-5567-LBL', price: 88, color: '#7a9ac4', colorName: 'Light Blue', tags: ['streetwear', 'casual', 'jacket', 'denim jacket'] },
  { id: 'm-outer-04', name: 'Bomber Jacket', category: 'outerwear', brand: 'Nike', retailer: 'Nike', sku: 'NKE-6698-BLK', price: 110, color: '#1a1a1a', colorName: 'Black', tags: ['streetwear', 'sporty', 'jacket'] },
  { id: 'm-outer-05', name: 'Shawl Cardigan', category: 'outerwear', brand: 'Uniqlo', retailer: 'Uniqlo', sku: 'UNQ-7712-GRY', price: 59, color: '#8a8a8a', colorName: 'Grey', tags: ['minimalist', 'boho', 'cardigan'] },

  { id: 'm-shoes-01', name: 'Oxford Dress Shoes', category: 'shoes', brand: 'Allen Edmonds', retailer: 'Allen Edmonds', sku: 'AE-1123-BLK', price: 295, color: '#1a1a1a', colorName: 'Black', tags: ['classic', 'office', 'interview', 'formal', 'dress shoes'] },
  { id: 'm-shoes-02', name: 'White Leather Sneakers', category: 'shoes', brand: 'Adidas', retailer: 'Adidas', sku: 'ADI-2247-WHT', price: 100, color: '#f5f5f5', colorName: 'White', tags: ['minimalist', 'streetwear', 'casual', 'sneakers'] },
  { id: 'm-shoes-03', name: 'Chelsea Boots', category: 'shoes', brand: 'Dr. Martens', retailer: 'Dr. Martens', sku: 'DRM-4471-BLK', price: 180, color: '#1a1a1a', colorName: 'Black', tags: ['edgy', 'classic', 'boots'] },
  { id: 'm-shoes-04', name: 'Running Shoes', category: 'shoes', brand: 'Nike', retailer: 'Nike', sku: 'NKE-3321-GRY', price: 110, color: '#8a8a8a', colorName: 'Grey', tags: ['sporty', 'gym', 'sneakers'] },
  { id: 'm-shoes-05', name: 'Espadrilles', category: 'shoes', brand: 'Mango', retailer: 'Mango', sku: 'MNG-6690-NVY', price: 50, color: '#1e2a4a', colorName: 'Navy', tags: ['boho', 'beach', 'espadrilles'] },
  { id: 'm-shoes-06', name: 'Velvet Loafers', category: 'shoes', brand: 'Steve Madden', retailer: 'Steve Madden', sku: 'SM-8845-BUR', price: 95, color: '#5c1f2e', colorName: 'Burgundy', tags: ['glam', 'night-out', 'flashy', 'loafers'] },

  { id: 'm-bag-01', name: 'Leather Messenger Bag', category: 'bag', brand: 'Coach', retailer: 'Coach', sku: 'COA-2247-BRN', price: 395, color: '#5a3a24', colorName: 'Brown', tags: ['classic', 'office', 'messenger bag'] },
  { id: 'm-bag-02', name: 'Gym Duffel', category: 'bag', brand: 'Nike', retailer: 'Nike', sku: 'NKE-1187-BLK', price: 60, color: '#1a1a1a', colorName: 'Black', tags: ['sporty', 'gym', 'duffel'] },
  { id: 'm-bag-03', name: 'Canvas Tote', category: 'bag', brand: 'Fjallraven', retailer: 'Fjallraven', sku: 'FJL-3390-GRN', price: 80, color: '#3f5c3f', colorName: 'Green', tags: ['boho', 'casual', 'minimalist', 'tote'] },

  { id: 'm-acc-01', name: 'Silk Tie', category: 'accessory', brand: 'Ralph Lauren', retailer: 'Ralph Lauren', sku: 'RL-4471-NVY', price: 65, color: '#1e2a4a', colorName: 'Navy', tags: ['classic', 'office', 'interview', 'wedding-guest', 'formal', 'tie'] },
  { id: 'm-acc-02', name: 'Statement Chain Necklace', category: 'accessory', brand: 'BaubleBar', retailer: 'BaubleBar', sku: 'BB-5521-GLD', price: 42, color: '#d4af37', colorName: 'Gold', tags: ['glam', 'night-out', 'flashy', 'necklace'] },
  { id: 'm-acc-03', name: 'Classic Leather Watch', category: 'accessory', brand: 'Fossil', retailer: 'Fossil', sku: 'FOS-2298-SLV', price: 115, color: '#c7cdd6', colorName: 'Silver', tags: ['classic', 'office', 'watch'] },
  { id: 'm-acc-04', name: 'Black Sunglasses', category: 'accessory', brand: 'Ray-Ban', retailer: 'Ray-Ban', sku: 'RB-6673-BLK', price: 163, color: '#1a1a1a', colorName: 'Black', tags: ['minimalist', 'streetwear', 'sunglasses'] },
  { id: 'm-acc-05', name: 'Leather Belt', category: 'accessory', brand: 'Coach', retailer: 'Coach', sku: 'COA-3345-BRN', price: 128, color: '#5a3a24', colorName: 'Brown', tags: ['classic', 'office', 'belt'] },
  { id: 'm-acc-06', name: 'Ribbed Beanie', category: 'accessory', brand: 'Uniqlo', retailer: 'Uniqlo', sku: 'UNQ-4471-BLK', price: 15, color: '#1a1a1a', colorName: 'Black', tags: ['streetwear', 'casual', 'beanie'] },
]

export const itemById = (id: string) => items.find((i) => i.id === id)

export function shopUrl(item: ClothingItem): string {
  const query = encodeURIComponent([item.brand, item.name].filter(Boolean).join(' '))
  return `https://www.google.com/search?tbm=shop&q=${query}`
}
