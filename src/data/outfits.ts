import type { Outfit, Gender } from './types'

function o(
  id: string,
  name: string,
  gender: Gender,
  styles: string[],
  itemIds: string[],
  formality: number,
  flashiness: number,
  coverage: number,
): Outfit {
  return { id, name, gender, styles, itemIds, formality, flashiness, coverage }
}

export const outfits: Outfit[] = [
  // ================= FEMININE =================
  // Minimalist
  o('f-min-1', 'Clean Lines Office Set', 'feminine', ['minimalist', 'classic'], ['f-top-02', 'f-bottom-01', 'f-shoes-05', 'f-bag-01', 'f-acc-03'], 4, 1, 4),
  o('f-min-2', 'Weekend Neutral', 'feminine', ['minimalist'], ['f-top-03', 'f-bottom-02', 'f-shoes-02', 'f-acc-05'], 2, 1, 4),
  o('f-min-3', 'Slip Dress Simplicity', 'feminine', ['minimalist', 'romantic'], ['f-dress-06', 'f-outer-04', 'f-shoes-05', 'f-acc-03'], 3, 1, 3),
  o('f-min-4', 'Trench & Trousers', 'feminine', ['minimalist', 'classic'], ['f-outer-01', 'f-top-02', 'f-bottom-01', 'f-shoes-01', 'f-bag-01'], 4, 1, 4),
  // Classic
  o('f-cla-1', 'Pearls & Pleats', 'feminine', ['classic'], ['f-top-02', 'f-bottom-03', 'f-shoes-01', 'f-acc-01', 'f-bag-01'], 4, 1, 4),
  o('f-cla-2', 'Timeless LBD', 'feminine', ['classic', 'glam'], ['f-dress-01', 'f-outer-01', 'f-shoes-01', 'f-acc-01', 'f-bag-02'], 4, 2, 3),
  o('f-cla-3', 'Weekend Classic', 'feminine', ['classic'], ['f-top-06', 'f-bottom-02', 'f-shoes-05', 'f-acc-04'], 2, 1, 3),
  o('f-cla-4', 'Garden Wrap', 'feminine', ['classic', 'romantic'], ['f-dress-02', 'f-outer-04', 'f-shoes-05', 'f-acc-03'], 3, 2, 3),
  // Streetwear
  o('f-str-1', 'Cargo & Graphic', 'feminine', ['streetwear'], ['f-top-05', 'f-bottom-05', 'f-shoes-02', 'f-outer-03', 'f-acc-05'], 1, 2, 3),
  o('f-str-2', 'Denim Moto', 'feminine', ['streetwear', 'edgy'], ['f-top-02', 'f-bottom-02', 'f-shoes-03', 'f-outer-02'], 2, 2, 4),
  o('f-str-3', 'Off-Duty Street', 'feminine', ['streetwear', 'sporty'], ['f-top-05', 'f-bottom-02', 'f-shoes-06', 'f-bag-05'], 1, 2, 3),
  o('f-str-4', 'Edgy LBD Remix', 'feminine', ['streetwear', 'edgy'], ['f-dress-01', 'f-outer-02', 'f-shoes-03', 'f-acc-05'], 2, 3, 3),
  // Romantic
  o('f-rom-1', 'Floral Garden Party', 'feminine', ['romantic', 'boho'], ['f-dress-02', 'f-shoes-07', 'f-bag-03', 'f-acc-04'], 2, 2, 3),
  o('f-rom-2', 'Soft Silk Midi', 'feminine', ['romantic'], ['f-top-01', 'f-bottom-03', 'f-shoes-05', 'f-acc-03'], 3, 2, 3),
  o('f-rom-3', 'Wrap & Waves', 'feminine', ['romantic', 'boho'], ['f-top-06', 'f-bottom-03', 'f-outer-04', 'f-shoes-07'], 2, 1, 4),
  o('f-rom-4', 'Romantic Evening', 'feminine', ['romantic', 'glam'], ['f-dress-06', 'f-outer-05', 'f-shoes-04', 'f-acc-02'], 4, 3, 2),
  // Edgy
  o('f-edg-1', 'All Black Everything', 'feminine', ['edgy', 'minimalist'], ['f-top-03', 'f-bottom-01', 'f-outer-02', 'f-shoes-03'], 3, 2, 4),
  o('f-edg-2', 'LBD Rebel', 'feminine', ['edgy'], ['f-dress-01', 'f-outer-02', 'f-shoes-03', 'f-acc-05'], 2, 3, 3),
  o('f-edg-3', 'Studded Basics', 'feminine', ['edgy', 'streetwear'], ['f-top-05', 'f-bottom-01', 'f-outer-02', 'f-shoes-03'], 2, 3, 3),
  o('f-edg-4', 'Sequin & Leather Clash', 'feminine', ['edgy', 'glam'], ['f-bottom-06', 'f-top-03', 'f-outer-02', 'f-shoes-03', 'f-acc-02'], 2, 4, 2),
  // Boho
  o('f-boh-1', 'Boho Bloom', 'feminine', ['boho'], ['f-dress-02', 'f-bag-03', 'f-shoes-07', 'f-acc-04'], 1, 2, 3),
  o('f-boh-2', 'Earthy Layers', 'feminine', ['boho'], ['f-top-06', 'f-bottom-02', 'f-outer-04', 'f-shoes-07'], 1, 1, 3),
  o('f-boh-3', 'Sunny Wanderer', 'feminine', ['boho'], ['f-dress-05', 'f-bag-03', 'f-shoes-07', 'f-acc-04'], 1, 2, 2),
  o('f-boh-4', 'Free Spirit Midi', 'feminine', ['boho', 'romantic'], ['f-top-01', 'f-bottom-03', 'f-outer-04', 'f-acc-04'], 2, 2, 3),
  // Glam
  o('f-gla-1', 'Full Sequin Glam', 'feminine', ['glam'], ['f-dress-03', 'f-shoes-04', 'f-bag-04', 'f-acc-02'], 4, 5, 2),
  o('f-gla-2', 'Red Carpet Ready', 'feminine', ['glam'], ['f-dress-04', 'f-outer-05', 'f-shoes-04', 'f-acc-02'], 5, 4, 3),
  o('f-gla-3', 'Sequin Top Night', 'feminine', ['glam', 'streetwear'], ['f-top-04', 'f-bottom-01', 'f-shoes-04', 'f-acc-02'], 3, 4, 3),
  o('f-gla-4', 'Classic Glam', 'feminine', ['glam', 'classic'], ['f-dress-01', 'f-outer-05', 'f-shoes-04', 'f-bag-04', 'f-acc-02'], 4, 4, 3),
  // Sporty
  o('f-spo-1', 'Studio to Street', 'feminine', ['sporty'], ['f-top-05', 'f-bottom-04', 'f-shoes-06', 'f-bag-05'], 1, 1, 2),
  o('f-spo-2', 'Everyday Athleisure', 'feminine', ['sporty'], ['f-bottom-04', 'f-top-05', 'f-shoes-06', 'f-acc-05'], 1, 1, 2),
  o('f-spo-3', 'Casual Court Off-Duty', 'feminine', ['sporty', 'streetwear'], ['f-bottom-02', 'f-top-05', 'f-shoes-06', 'f-bag-05'], 1, 1, 3),
  o('f-spo-4', 'Post-Workout Brunch', 'feminine', ['sporty'], ['f-bottom-04', 'f-outer-04', 'f-shoes-06', 'f-bag-05'], 1, 1, 2),

  // ================= MASCULINE =================
  // Minimalist
  o('m-min-1', 'Everyday Minimal', 'masculine', ['minimalist'], ['m-top-02', 'm-bottom-02', 'm-shoes-02', 'm-acc-04'], 1, 1, 4),
  o('m-min-2', 'Clean Office Look', 'masculine', ['minimalist', 'classic'], ['m-top-01', 'm-bottom-01', 'm-shoes-01', 'm-acc-03'], 4, 1, 4),
  o('m-min-3', 'Neutral Layers', 'masculine', ['minimalist'], ['m-top-03', 'm-bottom-02', 'm-shoes-02', 'm-acc-03'], 2, 1, 4),
  o('m-min-4', 'Overcoat Essentials', 'masculine', ['minimalist', 'classic'], ['m-outer-01', 'm-top-01', 'm-bottom-01', 'm-shoes-01'], 4, 1, 5),
  // Classic
  o('m-cla-1', 'Boardroom Navy', 'masculine', ['classic'], ['m-suit-01', 'm-acc-01', 'm-shoes-01', 'm-acc-03'], 5, 1, 4),
  o('m-cla-2', 'Timeless Tailoring', 'masculine', ['classic'], ['m-top-01', 'm-bottom-01', 'm-outer-01', 'm-shoes-01', 'm-acc-05'], 4, 1, 4),
  o('m-cla-3', 'Smart Casual Classic', 'masculine', ['classic', 'minimalist'], ['m-top-03', 'm-bottom-01', 'm-shoes-01', 'm-acc-05'], 3, 1, 4),
  o('m-cla-4', 'Linen Suit Summer', 'masculine', ['classic', 'boho'], ['m-suit-03', 'm-top-05', 'm-shoes-05'], 3, 2, 4),
  // Streetwear
  o('m-str-1', 'Cargo Hoodie Fit', 'masculine', ['streetwear'], ['m-top-04', 'm-bottom-05', 'm-shoes-02', 'm-outer-04'], 1, 2, 3),
  o('m-str-2', 'Denim on Denim', 'masculine', ['streetwear', 'classic'], ['m-top-02', 'm-bottom-02', 'm-outer-03', 'm-shoes-03'], 1, 2, 4),
  o('m-str-3', 'Off-Duty Athletic Street', 'masculine', ['streetwear', 'sporty'], ['m-top-04', 'm-bottom-04', 'm-shoes-04', 'm-acc-06'], 1, 2, 3),
  o('m-str-4', 'Leather & Denim', 'masculine', ['streetwear', 'edgy'], ['m-outer-02', 'm-top-02', 'm-bottom-02', 'm-shoes-03'], 2, 3, 3),
  // Romantic (soft/relaxed)
  o('m-rom-1', 'Linen Ease', 'masculine', ['romantic', 'boho'], ['m-top-05', 'm-bottom-03', 'm-shoes-05'], 1, 1, 3),
  o('m-rom-2', 'Soft Layered Look', 'masculine', ['romantic'], ['m-top-05', 'm-bottom-02', 'm-outer-05', 'm-shoes-03'], 2, 1, 4),
  o('m-rom-3', 'Relaxed Linen Suit', 'masculine', ['romantic', 'classic'], ['m-suit-03', 'm-shoes-05'], 3, 2, 4),
  o('m-rom-4', 'Refined Linen', 'masculine', ['romantic', 'classic'], ['m-top-05', 'm-bottom-01', 'm-shoes-01'], 3, 1, 4),
  // Edgy
  o('m-edg-1', 'Leather & Denim Edge', 'masculine', ['edgy'], ['m-outer-02', 'm-top-02', 'm-bottom-02', 'm-shoes-03', 'm-acc-04'], 2, 3, 3),
  o('m-edg-2', 'Dark Academia Edge', 'masculine', ['edgy', 'classic'], ['m-top-03', 'm-bottom-02', 'm-outer-02', 'm-shoes-03'], 3, 2, 4),
  o('m-edg-3', 'Statement Print Edge', 'masculine', ['edgy', 'glam'], ['m-top-06', 'm-bottom-02', 'm-outer-02', 'm-shoes-03'], 2, 4, 3),
  o('m-edg-4', 'Full Edge', 'masculine', ['edgy', 'streetwear'], ['m-top-02', 'm-bottom-05', 'm-outer-02', 'm-shoes-03', 'm-acc-02'], 2, 4, 3),
  // Boho
  o('m-boh-1', 'Coastal Wanderer', 'masculine', ['boho'], ['m-top-05', 'm-bottom-03', 'm-shoes-05', 'm-bag-03'], 1, 1, 3),
  o('m-boh-2', 'Earthy Layer', 'masculine', ['boho', 'edgy'], ['m-outer-05', 'm-top-02', 'm-bottom-02', 'm-shoes-03'], 1, 1, 4),
  o('m-boh-3', 'Relaxed Traveler', 'masculine', ['boho'], ['m-top-05', 'm-bottom-02', 'm-bag-03', 'm-acc-06'], 1, 1, 4),
  o('m-boh-4', 'Weekend Wanderer', 'masculine', ['boho'], ['m-top-03', 'm-bottom-03', 'm-shoes-05'], 1, 1, 3),
  // Glam
  o('m-gla-1', 'Black Tie Essential', 'masculine', ['glam', 'classic'], ['m-suit-02', 'm-acc-01', 'm-shoes-01'], 5, 3, 4),
  o('m-gla-2', 'Statement Night Out', 'masculine', ['glam'], ['m-top-06', 'm-bottom-01', 'm-shoes-06', 'm-acc-02'], 3, 5, 3),
  o('m-gla-3', 'Glam Tux Remix', 'masculine', ['glam'], ['m-suit-02', 'm-shoes-06', 'm-acc-02'], 5, 4, 4),
  o('m-gla-4', 'Loafers & Gold', 'masculine', ['glam', 'classic'], ['m-top-01', 'm-bottom-01', 'm-shoes-06', 'm-acc-02'], 3, 4, 4),
  // Sporty
  o('m-spo-1', 'Track Day', 'masculine', ['sporty'], ['m-top-04', 'm-bottom-04', 'm-shoes-04', 'm-bag-02'], 1, 1, 3),
  o('m-spo-2', 'Everyday Athletic', 'masculine', ['sporty'], ['m-top-02', 'm-bottom-04', 'm-shoes-04', 'm-acc-06'], 1, 1, 3),
  o('m-spo-3', 'Bomber Sport', 'masculine', ['sporty', 'streetwear'], ['m-outer-04', 'm-top-02', 'm-bottom-04', 'm-shoes-04'], 1, 2, 3),
  o('m-spo-4', 'Hoodie & Denim', 'masculine', ['sporty', 'streetwear'], ['m-top-04', 'm-bottom-02', 'm-shoes-04'], 1, 1, 3),
]

export const outfitById = (id: string) => outfits.find((f) => f.id === id)
