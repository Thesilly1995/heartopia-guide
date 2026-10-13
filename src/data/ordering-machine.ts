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
  // --- Clothing: Grimkin Season (prijzen nog niet aangeleverd) ---
  { slug: 'batzy-hood', name: 'Batzy Hood', category: 'clothing', catalog: GRIMKIN_SEASON, ticketCost: 3 },
  { slug: 'batzy-top', name: 'Batzy Top', category: 'clothing', catalog: GRIMKIN_SEASON, ticketCost: 3 },
  { slug: 'batzy-shoes', name: 'Batzy Shoes', category: 'clothing', catalog: GRIMKIN_SEASON, ticketCost: 2 },
  { slug: 'pumpkin-hood', name: 'Pumpkin Hood', category: 'clothing', catalog: GRIMKIN_SEASON, ticketCost: 3 },
  { slug: 'pumpkin-top', name: 'Pumpkin Top', category: 'clothing', catalog: GRIMKIN_SEASON, ticketCost: 3 },
  { slug: 'pumpkin-shoes', name: 'Pumpkin Shoes', category: 'clothing', catalog: GRIMKIN_SEASON, ticketCost: 2 },

  // --- Fashion: Grimkin Season ---
  { slug: 'bandage-face', name: 'Bandage Face', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2 },
  { slug: 'cracked-face', name: 'Cracked Face', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2 },
  { slug: 'grimkin-pet', name: 'Grimkin Companion', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 310 },
  { slug: 'ghost-charm', name: 'Ghost Charm', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 1, currency: 'hearts', currencyCost: 8 },
  { slug: 'floral-guitar', name: 'Floral Guitar', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 80 },
  { slug: 'cheer-pose-emote', name: 'Cheer Pose', category: 'fashion', catalog: GRIMKIN_SEASON, ticketCost: 1, currency: 'hearts', currencyCost: 20 },

  // --- Furniture: Grimkin Season ---
  { slug: 'ghost-plush', name: 'Ghost Plush', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 100 },
  { slug: 'slime-cat-bed', name: 'Slime Cat Bed', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 110 },
  { slug: 'venus-flytrap-pot', name: 'Venus Flytrap Pot', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 70 },
  { slug: 'bat-moon', name: 'Bat Moon', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 80 },
  { slug: 'leaf-pile', name: 'Leaf Pile', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 90 },
  { slug: 'jack-o-lantern-glow', name: "Jack-o'-Lantern (Glow)", category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 130 },
  { slug: 'pumpkin-tree', name: 'Pumpkin Tree', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 100 },
  { slug: 'ghost-lantern', name: 'Ghost Lantern', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 70 },
  { slug: 'white-ghost-plush', name: 'White Ghost Plush', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 100 },
  { slug: 'black-cat-purple-collar', name: 'Black Cat (Purple Collar)', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 80 },
  { slug: 'pumpkin-candle-pile', name: 'Pumpkin Candle Pile', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 100 },
  { slug: 'candle-stand', name: 'Candle Stand', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 70 },
  { slug: 'pumpkin-bat-bunting', name: 'Pumpkin Bat Bunting', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 70 },
  { slug: 'vine-pumpkin', name: 'Vine Pumpkin', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 80 },
  { slug: 'ghost-pumpkin-flag-scene', name: 'Ghost & Pumpkin Flag Scene', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 70 },
  { slug: 'hay-bale', name: 'Hay Bale', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 70 },
  { slug: 'pumpkin-scarecrow-floor', name: 'Pumpkin Scarecrow Floor', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'black-cat-floor', name: 'Black Cat Floor', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'ghost-mirror-floor', name: 'Ghost Mirror Floor', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'cat-fence-pair', name: 'Cat Fence (Pair)', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'spiderweb-floor', name: 'Spiderweb Floor', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'roof-tile-floor', name: 'Roof Tile Floor', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'pumpkin-mirror-floor', name: 'Pumpkin Mirror Floor', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'jack-o-lantern-glow-floor', name: "Jack-o'-Lantern Floor", category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'cat-paw-fence', name: 'Cat Paw Fence', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 20 },
  { slug: 'pumpkin-stair-floor', name: 'Pumpkin Stair Floor', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'sleeping-cat-fence', name: 'Sleeping Cat Fence', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 20 },
  { slug: 'hay-floor', name: 'Hay Floor', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 25 },
  { slug: 'striped-ghost-floor', name: 'Striped Ghost Floor', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 25 },
  { slug: 'wood-plank-floor-vertical', name: 'Wood Plank Floor (Vertical)', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 50 },
  { slug: 'wood-plank-floor-dark', name: 'Wood Plank Floor (Dark)', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 50 },
  { slug: 'blue-cloud-floor', name: 'Blue Cloud Floor', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 50 },
  { slug: 'maple-leaf-stair-floor', name: 'Maple Leaf Stair Floor', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'red-autumn-tree', name: 'Red Autumn Tree', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'orange-autumn-tree', name: 'Orange Autumn Tree', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'brown-autumn-tree', name: 'Brown Autumn Tree', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'bare-tree-dark', name: 'Bare Tree (Dark)', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'bare-tree-tan', name: 'Bare Tree (Tan)', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'bare-tree-black', name: 'Bare Tree (Black)', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'coat-rack-pumpkin-bag', name: 'Coat Rack with Pumpkin Bag', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 10 },
  { slug: 'pumpkin-portrait-frame', name: 'Pumpkin Portrait Frame', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 10 },
  { slug: 'spiderweb-armchair', name: 'Spiderweb Armchair', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 10 },
  { slug: 'purple-pumpkin-loveseat', name: 'Purple Pumpkin Loveseat', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'cat-face-side-table', name: 'Cat Face Side Table', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 10 },
  { slug: 'orange-coffee-table', name: 'Orange Coffee Table', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 10 },
  { slug: 'witch-hat-pumpkin-lamp', name: 'Witch Hat Pumpkin Lamp', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'black-chandelier', name: 'Black Chandelier', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'ghost-floor-lamp', name: 'Ghost Floor Lamp', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 10 },
  { slug: 'black-pumpkin-cabinet', name: 'Black Pumpkin Cabinet', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'black-cat-silhouette', name: 'Black Cat Silhouette', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 10 },
  { slug: 'harlequin-stocking', name: 'Harlequin Stocking', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'candy-corn-pile', name: 'Candy Corn Pile', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 380 },
  { slug: 'green-pepper-face', name: 'Green Pepper Face', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 140 },
  { slug: 'cream-pepper-face', name: 'Cream Pepper Face', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 140 },
  { slug: 'pink-ghost-door', name: 'Pink Ghost Door', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'pumpkin-arch-door', name: 'Pumpkin Arch Door', category: 'furniture', catalog: GRIMKIN_SEASON, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
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
