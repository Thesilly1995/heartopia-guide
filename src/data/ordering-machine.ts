import { useMemo } from 'react';

export type OrderingMachineCategory = 'furniture' | 'clothing' | 'fashion';
export type OrderingMachineCurrency = 'hearts' | 'coins' | 'stars';

export interface OrderingMachineItem {
  slug: string;
  name: string;
  category: OrderingMachineCategory;
  catalog: string;
  ticketCost: number;
  /** Ontbreekt zolang de prijs nog niet is aangeleverd. */
  currency?: OrderingMachineCurrency;
  currencyCost?: number;
}

const GRIMKIN_SEASON = 'Grimkin Season';

/** Bron: eigen screenshots van de Ordering Machine + fan-gemaakte prijzenlijst-infographic ("奇灵夜返场手册+全新价格"). */
const ITEMS: OrderingMachineItem[] = [
  // --- Fashion (Grimkin Season): clothing set pieces ---
  { slug: 'batzy-hood', name: 'Batzy Hood', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 3, currency: 'hearts', currencyCost: 210 },
  { slug: 'batzy-top', name: 'Batzy Top', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 3, currency: 'hearts', currencyCost: 340 },
  { slug: 'batzy-shoes', name: 'Batzy Shoes', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 140 },
  { slug: 'pumpkin-hood', name: 'Pumpkin Hood', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 3, currency: 'hearts', currencyCost: 210 },
  { slug: 'pumpkin-top', name: 'Pumpkin Top', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 3, currency: 'hearts', currencyCost: 340 },
  { slug: 'pumpkin-shoes', name: 'Pumpkin Shoes', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 140 },

  // --- Fashion (Grimkin Season): face decorations & companion accessories ---
  { slug: 'bandage-face', name: 'Bandage Face', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 10 },
  { slug: 'cracked-face', name: 'Cracked Face', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 10 },
  { slug: 'grimkin-pet', name: 'Grimkin Companion', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 310 },
  { slug: 'ghost-charm', name: 'Ghost Charm', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 1, currency: 'hearts', currencyCost: 8 },
  { slug: 'floral-guitar', name: 'Floral Guitar', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 80 },
  { slug: 'cheer-pose-emote', name: 'Cheer Pose', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 1, currency: 'hearts', currencyCost: 20 },

  // --- Fashion (Grimkin Season): furniture & decor pieces ---
  { slug: 'ghost-plush', name: 'Ghost Plush', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 100 },
  { slug: 'slime-cat-bed', name: 'Slime Cat Bed', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 110 },
  { slug: 'venus-flytrap-pot', name: 'Venus Flytrap Pot', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 70 },
  { slug: 'bat-moon', name: 'Bat Moon', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 80 },
  { slug: 'leaf-pile', name: 'Leaf Pile', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 90 },
  { slug: 'jack-o-lantern-glow', name: "Jack-o'-Lantern (Glow)", category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 130 },
  { slug: 'pumpkin-tree', name: 'Pumpkin Tree', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 100 },
  { slug: 'ghost-lantern', name: 'Ghost Lantern', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 70 },
  { slug: 'white-ghost-plush', name: 'White Ghost Plush', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 100 },
  { slug: 'black-cat-purple-collar', name: 'Black Cat (Purple Collar)', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 80 },
  { slug: 'pumpkin-candle-pile', name: 'Pumpkin Candle Pile', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 100 },
  { slug: 'candle-stand', name: 'Candle Stand', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 70 },
  { slug: 'pumpkin-bat-bunting', name: 'Pumpkin Bat Bunting', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 70 },
  { slug: 'vine-pumpkin', name: 'Vine Pumpkin', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 80 },
  { slug: 'ghost-pumpkin-flag-scene', name: 'Ghost & Pumpkin Flag Scene', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 70 },
  { slug: 'hay-bale', name: 'Hay Bale', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 70 },
  { slug: 'pumpkin-scarecrow-floor', name: 'Pumpkin Scarecrow Floor', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'black-cat-floor', name: 'Black Cat Floor', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'ghost-mirror-floor', name: 'Ghost Mirror Floor', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'cat-fence-pair', name: 'Cat Fence (Pair)', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'spiderweb-floor', name: 'Spiderweb Floor', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'roof-tile-floor', name: 'Roof Tile Floor', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'pumpkin-mirror-floor', name: 'Pumpkin Mirror Floor', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'jack-o-lantern-glow-floor', name: "Jack-o'-Lantern Floor", category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'cat-paw-fence', name: 'Cat Paw Fence', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 20 },
  { slug: 'pumpkin-stair-floor', name: 'Pumpkin Stair Floor', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'sleeping-cat-fence', name: 'Sleeping Cat Fence', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 20 },
  { slug: 'hay-floor', name: 'Hay Floor', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 25 },
  { slug: 'striped-ghost-floor', name: 'Striped Ghost Floor', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 25 },
  { slug: 'wood-plank-floor-vertical', name: 'Wood Plank Floor (Vertical)', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 50 },
  { slug: 'wood-plank-floor-dark', name: 'Wood Plank Floor (Dark)', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 50 },
  { slug: 'blue-cloud-floor', name: 'Blue Cloud Floor', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 50 },
  { slug: 'maple-leaf-stair-floor', name: 'Maple Leaf Stair Floor', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'red-autumn-tree', name: 'Red Autumn Tree', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'orange-autumn-tree', name: 'Orange Autumn Tree', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'brown-autumn-tree', name: 'Brown Autumn Tree', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'bare-tree-dark', name: 'Bare Tree (Dark)', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'bare-tree-tan', name: 'Bare Tree (Tan)', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'bare-tree-black', name: 'Bare Tree (Black)', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'coat-rack-pumpkin-bag', name: 'Coat Rack with Pumpkin Bag', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 10 },
  { slug: 'pumpkin-portrait-frame', name: 'Pumpkin Portrait Frame', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 10 },
  { slug: 'spiderweb-armchair', name: 'Spiderweb Armchair', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 10 },
  { slug: 'purple-pumpkin-loveseat', name: 'Purple Pumpkin Loveseat', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'cat-face-side-table', name: 'Cat Face Side Table', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 10 },
  { slug: 'orange-coffee-table', name: 'Orange Coffee Table', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 10 },
  { slug: 'witch-hat-pumpkin-lamp', name: 'Witch Hat Pumpkin Lamp', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'black-chandelier', name: 'Black Chandelier', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'ghost-floor-lamp', name: 'Ghost Floor Lamp', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 10 },
  { slug: 'black-pumpkin-cabinet', name: 'Black Pumpkin Cabinet', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'black-cat-silhouette', name: 'Black Cat Silhouette', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 10 },
  { slug: 'harlequin-stocking', name: 'Harlequin Stocking', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'candy-corn-pile', name: 'Candy Corn Pile', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 380 },
  { slug: 'green-pepper-face', name: 'Green Pepper Face', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 140 },
  { slug: 'cream-pepper-face', name: 'Cream Pepper Face', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 140 },
  { slug: 'pink-ghost-door', name: 'Pink Ghost Door', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'pumpkin-arch-door', name: 'Pumpkin Arch Door', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
];

export function useOrderingMachineItems(category: OrderingMachineCategory): OrderingMachineItem[] {
  return useMemo(() => ITEMS.filter((item) => item.category === category), [category]);
}

export function useOrderingMachineCatalogs(category: OrderingMachineCategory): string[] {
  return useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const item of ITEMS) {
      if (item.category !== category) continue;
      if (seen.has(item.catalog)) continue;
      seen.add(item.catalog);
      result.push(item.catalog);
    }
    return result;
  }, [category]);
}
