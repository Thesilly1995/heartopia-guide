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
const GOLDEN_RIDGE = 'Ode to Golden Ridge';

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

  // --- Fashion (Ode to Golden Ridge): Golden Ridge Set clothing (afbeeldingen volgen nog) ---
  { slug: 'golden-ridge-canvas-overalls', name: 'Golden Ridge Overalls (Autumn Canvas)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 3, currency: 'hearts', currencyCost: 170 },
  { slug: 'golden-ridge-canvas-hat', name: 'Golden Ridge Hat (Autumn Canvas)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 65 },
  { slug: 'golden-ridge-canvas-boots', name: 'Golden Ridge Boots (Autumn Canvas)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 65 },
  { slug: 'golden-ridge-secret-dress', name: 'Golden Ridge Dress (Autumn Secret)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 3, currency: 'hearts', currencyCost: 170 },
  { slug: 'golden-ridge-secret-hood', name: 'Golden Ridge Hood (Autumn Secret)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 65 },
  { slug: 'golden-ridge-secret-boots', name: 'Golden Ridge Boots (Autumn Secret)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 65 },

  // --- Fashion (Ode to Golden Ridge): face decorations & pet accessories ---
  { slug: 'blush-face', name: 'Blush Face', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 5 },
  { slug: 'flower-crown-face', name: 'Flower Crown Face', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 5 },
  { slug: 'pet-pointed-hat', name: 'Pet Pointed Hat', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 50 },
  { slug: 'pet-hood', name: 'Pet Hood', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 50 },
  { slug: 'pet-satchel-left', name: 'Pet Satchel (Left)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 50 },
  { slug: 'pet-satchel-right', name: 'Pet Satchel (Right)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 50 },

  // --- Fashion (Ode to Golden Ridge): Sunlit Courtyard furniture ---
  { slug: 'golden-ridge-scarecrow', name: 'Scarecrow', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'market-stall', name: 'Market Stall', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'wooden-rocking-chair', name: 'Wooden Rocking Chair', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'bunting-garland-lights', name: 'Bunting Garland Lights', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'stars', currencyCost: 30 },
  { slug: 'chalkboard-menu-sign', name: 'Chalkboard Menu Sign', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 14800 },
  { slug: 'tomato-basket-bowl', name: 'Tomato Basket Bowl', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 14800 },
  { slug: 'wheelbarrow-produce', name: 'Wheelbarrow of Produce', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 14800 },
  { slug: 'corn-pile-golden', name: 'Golden Corn Pile', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 14800 },
  { slug: 'checkered-picnic-table', name: 'Checkered Picnic Table', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 14800 },
  { slug: 'drink-stand-table', name: 'Drink Stand Table', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 15100 },
  { slug: 'ladder-shelf-jars', name: 'Ladder Shelf with Jars', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 15100 },
  { slug: 'golden-sparkle-cloud', name: 'Golden Sparkle Cloud', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 14800 },

  // --- Fashion (Ode to Golden Ridge): Bountiful Farm furniture ---
  { slug: 'golden-autumn-tree', name: 'Golden Autumn Tree', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 380 },
  { slug: 'red-mailbox-post', name: 'Red Mailbox Post', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 55 },
  { slug: 'wood-platform-bench', name: 'Wood Platform Bench', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 55 },
  { slug: 'orange-autumn-tree-ridge', name: 'Orange Autumn Tree', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 55 },
  { slug: 'bare-tree-pole', name: 'Bare Tree Pole', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 28 },
  { slug: 'wall-lantern-post', name: 'Wall Lantern Post', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 28 },
  { slug: 'red-barn-wall', name: 'Red Barn Wall', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 28 },
  { slug: 'white-door-panel', name: 'White Door Panel', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 28 },
  { slug: 'wood-fence-gate', name: 'Wood Fence Gate', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 28 },
  { slug: 'red-roof-birdhouse', name: 'Red Roof Birdhouse', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 28 },
  { slug: 'golden-wheat-pile', name: 'Golden Wheat Pile', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 28 },
  { slug: 'dark-brown-roof-panel', name: 'Dark Brown Roof Panel', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 28 },
  { slug: 'green-hedge-bush', name: 'Green Hedge Bush', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 28 },
  { slug: 'cream-lattice-window', name: 'Cream Lattice Window', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 28 },
  { slug: 'red-lamppost-weathervane', name: 'Red Lamppost with Weathervane', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'stars', currencyCost: 55 },
  { slug: 'thatched-roof-arch', name: 'Thatched Roof Arch', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 28 },
  { slug: 'white-lattice-fence', name: 'White Lattice Fence', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 28 },
  { slug: 'orange-lattice-fence', name: 'Orange Lattice Fence', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'stars', currencyCost: 24 },
  { slug: 'dark-roof-slope-panel', name: 'Dark Roof Slope Panel', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 28 },
  { slug: 'cream-window-panel', name: 'Cream Window Panel', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 28 },
  { slug: 'cream-fence-panel', name: 'Cream Fence Panel', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 28 },
  { slug: 'straw-mat-bale', name: 'Straw Mat Bale', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'stars', currencyCost: 24 },

  // --- Fashion (Ode to Golden Ridge): other souvenirs ---
  { slug: 'red-toy-truck', name: 'Red Toy Truck', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 60 },
  { slug: 'pink-stone-oven', name: 'Pink Stone Oven', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'stars', currencyCost: 2 },
  { slug: 'red-wreath-ring', name: 'Red Wreath Ring', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 70 },
  { slug: 'spotted-mushroom', name: 'Spotted Mushroom', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 70 },
  { slug: 'autumn-flower-wreath', name: 'Autumn Flower Wreath', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 70 },

  // --- Fashion (Ode to Golden Ridge): tomato pet companions ---
  { slug: 'tomato-pet-red', name: 'Tomato Pet (Red)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 2400 },
  { slug: 'tomato-pet-green', name: 'Tomato Pet (Green)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 2400 },
  { slug: 'tomato-pet-orange', name: 'Tomato Pet (Orange)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 2400 },
  { slug: 'tomato-pet-yellow', name: 'Tomato Pet (Yellow)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 2400 },
  { slug: 'tomato-pet-purple', name: 'Tomato Pet (Purple)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 2400 },
  { slug: 'tomato-pet-brown', name: 'Tomato Pet (Brown)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 2400 },
  { slug: 'tomato-pet-pale-yellow', name: 'Tomato Pet (Pale Yellow)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 2400 },
  { slug: 'tomato-pet-pink', name: 'Tomato Pet (Pink)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 2400 },
  { slug: 'tomato-pet-light-green', name: 'Tomato Pet (Light Green)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 2400 },

  // --- Fashion (Ode to Golden Ridge): tractors ---
  { slug: 'tractor-pink', name: 'Tractor (Pink)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 4000 },
  { slug: 'tractor-red', name: 'Tractor (Red)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 4000 },
  { slug: 'tractor-green', name: 'Tractor (Green)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 4000 },
  { slug: 'tractor-blue', name: 'Tractor (Blue)', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 4000 },

  // --- Fashion (Ode to Golden Ridge): items + actions ---
  { slug: 'building-material-pack', name: 'Building Material', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 155 },
  { slug: 'instrument-pack', name: 'Instrument', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 40 },
  { slug: 'clothing-material-pack', name: 'Clothing Material', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 2, currency: 'hearts', currencyCost: 65 },
  { slug: 'golden-ridge-dance-pose-1', name: 'Dance Pose 1', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'hearts', currencyCost: 10 },
  { slug: 'golden-ridge-dance-pose-2', name: 'Dance Pose 2', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 18000 },
  { slug: 'golden-ridge-dance-pose-3', name: 'Dance Pose 3', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 18000 },
  { slug: 'golden-ridge-dance-pose-4', name: 'Dance Pose 4', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 18000 },
  { slug: 'golden-ridge-dance-pose-5', name: 'Dance Pose 5', category: 'fashion', catalog: GOLDEN_RIDGE, ticketCost: 1, currency: 'coins', currencyCost: 18000 },
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
