// ============================================
// Community Center Bundles — Complete Data
// ============================================
// Each item: [name, qty, quality, seasons[], source, category]
// quality: 0=normal, 1=silver, 2=gold, 3=iridium
// source: how to obtain the item
// category: Farming, Foraging, Fishing, Mining, Animal, Artisan, Cooking, Store, Monster, Other

export const ROOMS = [
  {
    key: 'crafts',
    name: 'Crafts Room',
    color: '#8bc34a',
    icon: 'crafts',
    bundles: [
      {
        name: 'Spring Foraging Bundle',
        slots: 4,
        reward: '30 Spring Seeds',
        items: [
          ['Wild Horseradish', 1, 0, ['Spring'], 'Foraging', 'Foraging'],
          ['Daffodil', 1, 0, ['Spring'], 'Foraging', 'Foraging'],
          ['Leek', 1, 0, ['Spring'], 'Foraging', 'Foraging'],
          ['Dandelion', 1, 0, ['Spring'], 'Foraging', 'Foraging'],
        ],
      },
      {
        name: 'Summer Foraging Bundle',
        slots: 3,
        reward: '30 Summer Seeds',
        items: [
          ['Grape', 1, 0, ['Summer'], 'Foraging', 'Foraging'],
          ['Spice Berry', 1, 0, ['Summer'], 'Foraging', 'Foraging'],
          ['Sweet Pea', 1, 0, ['Summer'], 'Foraging', 'Foraging'],
        ],
      },
      {
        name: 'Fall Foraging Bundle',
        slots: 4,
        reward: '30 Fall Seeds',
        items: [
          ['Common Mushroom', 1, 0, ['Fall'], 'Foraging', 'Foraging'],
          ['Wild Plum', 1, 0, ['Fall'], 'Foraging', 'Foraging'],
          ['Hazelnut', 1, 0, ['Fall'], 'Foraging', 'Foraging'],
          ['Blackberry', 1, 0, ['Fall'], 'Foraging', 'Foraging'],
        ],
      },
      {
        name: 'Winter Foraging Bundle',
        slots: 4,
        reward: '30 Winter Seeds',
        items: [
          ['Winter Root', 1, 0, ['Winter'], 'Foraging', 'Foraging'],
          ['Crystal Fruit', 1, 0, ['Winter'], 'Foraging', 'Foraging'],
          ['Snow Yam', 1, 0, ['Winter'], 'Foraging', 'Foraging'],
          ['Crocus', 1, 0, ['Winter'], 'Foraging', 'Foraging'],
        ],
      },
      {
        name: 'Construction Bundle',
        slots: 3,
        reward: 'Charcoal Kiln',
        items: [
          ['Wood', 99, 0, ['Any'], 'Chopping trees', 'Other'],
          ['Stone', 99, 0, ['Any'], 'Breaking rocks', 'Mining'],
          ['Hardwood', 10, 0, ['Any'], 'Secret Woods / Mahogany trees', 'Other'],
        ],
      },
      {
        name: 'Exotic Foraging Bundle',
        slots: 5,
        pick: 5,
        reward: '5 Autumn\'s Bounty',
        items: [
          ['Coconut', 1, 0, ['Any'], 'Desert / Palm trees', 'Foraging'],
          ['Cactus Fruit', 1, 0, ['Any'], 'Desert', 'Foraging'],
          ['Cave Carrot', 1, 0, ['Any'], 'Mines', 'Mining'],
          ['Red Mushroom', 1, 0, ['Summer', 'Fall'], 'Mines / Farm Cave', 'Foraging'],
          ['Purple Mushroom', 1, 0, ['Any'], 'Mines / Farm Cave', 'Foraging'],
          ['Maple Syrup', 1, 0, ['Any'], 'Tapper on Maple Tree', 'Artisan'],
          ['Oak Resin', 1, 0, ['Any'], 'Tapper on Oak Tree', 'Artisan'],
          ['Pine Tar', 1, 0, ['Any'], 'Tapper on Pine Tree', 'Artisan'],
          ['Morel', 1, 0, ['Spring'], 'Farm Cave / Secret Woods', 'Foraging'],
        ],
      },
    ],
  },
  {
    key: 'pantry',
    name: 'Pantry',
    color: '#ff9800',
    icon: 'pantry',
    bundles: [
      {
        name: 'Spring Crops Bundle',
        slots: 4,
        reward: 'Speed-Gro x20',
        items: [
          ['Parsnip', 1, 0, ['Spring'], 'Farming', 'Farming'],
          ['Green Bean', 1, 0, ['Spring'], 'Farming', 'Farming'],
          ['Cauliflower', 1, 0, ['Spring'], 'Farming', 'Farming'],
          ['Potato', 1, 0, ['Spring'], 'Farming', 'Farming'],
        ],
      },
      {
        name: 'Summer Crops Bundle',
        slots: 4,
        reward: 'Quality Sprinkler',
        items: [
          ['Tomato', 1, 0, ['Summer'], 'Farming', 'Farming'],
          ['Hot Pepper', 1, 0, ['Summer'], 'Farming', 'Farming'],
          ['Blueberry', 1, 0, ['Summer'], 'Farming', 'Farming'],
          ['Melon', 1, 0, ['Summer'], 'Farming', 'Farming'],
        ],
      },
      {
        name: 'Fall Crops Bundle',
        slots: 4,
        reward: 'Bee House',
        items: [
          ['Corn', 1, 0, ['Summer', 'Fall'], 'Farming', 'Farming'],
          ['Eggplant', 1, 0, ['Fall'], 'Farming', 'Farming'],
          ['Pumpkin', 1, 0, ['Fall'], 'Farming', 'Farming'],
          ['Yam', 1, 0, ['Fall'], 'Farming', 'Farming'],
        ],
      },
      {
        name: 'Quality Crops Bundle',
        slots: 3,
        pick: 3,
        reward: 'Preserves Jar',
        items: [
          ['Parsnip', 5, 2, ['Spring'], 'Farming (Gold quality)', 'Farming'],
          ['Melon', 5, 2, ['Summer'], 'Farming (Gold quality)', 'Farming'],
          ['Pumpkin', 5, 2, ['Fall'], 'Farming (Gold quality)', 'Farming'],
          ['Corn', 5, 2, ['Summer', 'Fall'], 'Farming (Gold quality)', 'Farming'],
        ],
      },
      {
        name: 'Animal Bundle',
        slots: 5,
        reward: 'Cheese Press',
        items: [
          ['Large Milk', 1, 0, ['Any'], 'Cow (high friendship)', 'Animal'],
          ['Large Egg (Brown)', 1, 0, ['Any'], 'Chicken (high friendship)', 'Animal'],
          ['Large Goat Milk', 1, 0, ['Any'], 'Goat (high friendship)', 'Animal'],
          ['Wool', 1, 0, ['Any'], 'Sheep / Rabbit', 'Animal'],
          ['Duck Egg', 1, 0, ['Any'], 'Duck', 'Animal'],
        ],
      },
      {
        name: 'Artisan Bundle',
        slots: 6,
        pick: 6,
        reward: 'Keg',
        items: [
          ['Truffle Oil', 1, 0, ['Any'], 'Oil Maker + Truffle', 'Artisan'],
          ['Cloth', 1, 0, ['Any'], 'Loom + Wool', 'Artisan'],
          ['Goat Cheese', 1, 0, ['Any'], 'Cheese Press + Goat Milk', 'Artisan'],
          ['Cheese', 1, 0, ['Any'], 'Cheese Press + Milk', 'Artisan'],
          ['Honey', 1, 0, ['Spring', 'Summer', 'Fall'], 'Bee House', 'Artisan'],
          ['Jelly', 1, 0, ['Any'], 'Preserves Jar + Fruit', 'Artisan'],
          ['Apple', 1, 0, ['Fall'], 'Apple Tree', 'Farming'],
          ['Apricot', 1, 0, ['Spring'], 'Apricot Tree', 'Farming'],
          ['Orange', 1, 0, ['Summer'], 'Orange Tree', 'Farming'],
          ['Peach', 1, 0, ['Summer'], 'Peach Tree', 'Farming'],
          ['Pomegranate', 1, 0, ['Fall'], 'Pomegranate Tree', 'Farming'],
          ['Cherry', 1, 0, ['Spring'], 'Cherry Tree', 'Farming'],
        ],
      },
    ],
  },
  {
    key: 'fish_tank',
    name: 'Fish Tank',
    color: '#29b6f6',
    icon: 'fish',
    bundles: [
      {
        name: 'River Fish Bundle',
        slots: 4,
        reward: 'Bait x30',
        items: [
          ['Sunfish', 1, 0, ['Spring', 'Summer'], 'Fishing (River)', 'Fishing'],
          ['Catfish', 1, 0, ['Spring', 'Fall'], 'Fishing (River, rain)', 'Fishing'],
          ['Shad', 1, 0, ['Summer', 'Fall'], 'Fishing (River, rain)', 'Fishing'],
          ['Tiger Trout', 1, 0, ['Fall', 'Winter'], 'Fishing (River)', 'Fishing'],
        ],
      },
      {
        name: 'Lake Fish Bundle',
        slots: 4,
        reward: 'Dressed Spinner',
        items: [
          ['Largemouth Bass', 1, 0, ['Any'], 'Fishing (Mountain Lake)', 'Fishing'],
          ['Carp', 1, 0, ['Any'], 'Fishing (Mountain Lake / Sewers)', 'Fishing'],
          ['Bullhead', 1, 0, ['Any'], 'Fishing (Mountain Lake)', 'Fishing'],
          ['Sturgeon', 1, 0, ['Summer', 'Winter'], 'Fishing (Mountain Lake)', 'Fishing'],
        ],
      },
      {
        name: 'Ocean Fish Bundle',
        slots: 4,
        reward: 'Warp Totem: Beach x5',
        items: [
          ['Sardine', 1, 0, ['Spring', 'Fall', 'Winter'], 'Fishing (Ocean)', 'Fishing'],
          ['Tuna', 1, 0, ['Summer', 'Winter'], 'Fishing (Ocean)', 'Fishing'],
          ['Red Snapper', 1, 0, ['Summer', 'Fall'], 'Fishing (Ocean, rain)', 'Fishing'],
          ['Tilapia', 1, 0, ['Summer', 'Fall'], 'Fishing (Ocean)', 'Fishing'],
        ],
      },
      {
        name: 'Night Fishing Bundle',
        slots: 3,
        reward: 'Small Glow Ring',
        items: [
          ['Walleye', 1, 0, ['Fall'], 'Fishing (River/Lake, rain, night)', 'Fishing'],
          ['Bream', 1, 0, ['Any'], 'Fishing (River, night)', 'Fishing'],
          ['Eel', 1, 0, ['Spring', 'Fall'], 'Fishing (Ocean, rain, night)', 'Fishing'],
        ],
      },
      {
        name: 'Crab Pot Bundle',
        slots: 5,
        pick: 5,
        reward: 'Crab Pot x3',
        items: [
          ['Lobster', 1, 0, ['Any'], 'Crab Pot (Ocean)', 'Fishing'],
          ['Crayfish', 1, 0, ['Any'], 'Crab Pot (Freshwater)', 'Fishing'],
          ['Crab', 1, 0, ['Any'], 'Crab Pot (Ocean)', 'Fishing'],
          ['Cockle', 1, 0, ['Any'], 'Beach foraging / Crab Pot', 'Fishing'],
          ['Mussel', 1, 0, ['Any'], 'Beach foraging / Crab Pot', 'Fishing'],
          ['Shrimp', 1, 0, ['Any'], 'Crab Pot (Ocean)', 'Fishing'],
          ['Snail', 1, 0, ['Any'], 'Crab Pot (Freshwater)', 'Fishing'],
          ['Periwinkle', 1, 0, ['Any'], 'Crab Pot (Freshwater)', 'Fishing'],
          ['Oyster', 1, 0, ['Any'], 'Beach foraging / Crab Pot', 'Fishing'],
          ['Clam', 1, 0, ['Any'], 'Beach foraging / Crab Pot', 'Fishing'],
        ],
      },
      {
        name: 'Specialty Fish Bundle',
        slots: 4,
        reward: 'Dish O\' The Sea x5',
        items: [
          ['Pufferfish', 1, 0, ['Summer'], 'Fishing (Ocean, sunny, noon)', 'Fishing'],
          ['Ghostfish', 1, 0, ['Any'], 'Fishing (Mines floor 20/60)', 'Fishing'],
          ['Sandfish', 1, 0, ['Any'], 'Fishing (Desert)', 'Fishing'],
          ['Woodskip', 1, 0, ['Any'], 'Fishing (Secret Woods)', 'Fishing'],
        ],
      },
    ],
  },
  {
    key: 'boiler',
    name: 'Boiler Room',
    color: '#ef5350',
    icon: 'boiler',
    bundles: [
      {
        name: 'Blacksmith\'s Bundle',
        slots: 3,
        reward: 'Furnace',
        items: [
          ['Copper Bar', 1, 0, ['Any'], 'Smelting Copper Ore', 'Mining'],
          ['Iron Bar', 1, 0, ['Any'], 'Smelting Iron Ore', 'Mining'],
          ['Gold Bar', 1, 0, ['Any'], 'Smelting Gold Ore', 'Mining'],
        ],
      },
      {
        name: 'Geologist\'s Bundle',
        slots: 4,
        reward: 'Omni Geode x5',
        items: [
          ['Quartz', 1, 0, ['Any'], 'Mining (Mines)', 'Mining'],
          ['Earth Crystal', 1, 0, ['Any'], 'Mining (Mines floors 1-39)', 'Mining'],
          ['Frozen Tear', 1, 0, ['Any'], 'Mining (Mines floors 40-79)', 'Mining'],
          ['Fire Quartz', 1, 0, ['Any'], 'Mining (Mines floors 80-120)', 'Mining'],
        ],
      },
      {
        name: 'Adventurer\'s Bundle',
        slots: 2,
        pick: 2,
        reward: 'Small Magnet Ring',
        items: [
          ['Slime', 99, 0, ['Any'], 'Slimes (Mines)', 'Monster'],
          ['Bat Wing', 10, 0, ['Any'], 'Bats (Mines)', 'Monster'],
          ['Solar Essence', 1, 0, ['Any'], 'Ghosts / Squid Kids (Mines)', 'Monster'],
          ['Void Essence', 1, 0, ['Any'], 'Shadow creatures (Mines)', 'Monster'],
        ],
      },
    ],
  },
  {
    key: 'bulletin',
    name: 'Bulletin Board',
    color: '#ab47bc',
    icon: 'bulletin',
    bundles: [
      {
        name: 'Chef\'s Bundle',
        slots: 6,
        reward: '3 Pink Cake',
        items: [
          ['Maple Syrup', 1, 0, ['Any'], 'Tapper on Maple Tree', 'Artisan'],
          ['Fiddlehead Fern', 1, 0, ['Summer'], 'Secret Woods foraging', 'Foraging'],
          ['Truffle', 1, 0, ['Any'], 'Pig (outdoors)', 'Animal'],
          ['Poppy', 1, 0, ['Summer'], 'Farming', 'Farming'],
          ['Maki Roll', 1, 0, ['Any'], 'Cooking (Fish + Seaweed + Rice)', 'Cooking'],
          ['Fried Egg', 1, 0, ['Any'], 'Cooking (Egg)', 'Cooking'],
        ],
      },
      {
        name: 'Dye Bundle',
        slots: 6,
        reward: 'Seed Maker',
        items: [
          ['Red Mushroom', 1, 0, ['Summer', 'Fall'], 'Mines / Farm Cave', 'Foraging'],
          ['Sea Urchin', 1, 0, ['Any'], 'Beach foraging / Tide Pools', 'Foraging'],
          ['Sunflower', 1, 0, ['Summer', 'Fall'], 'Farming', 'Farming'],
          ['Duck Feather', 1, 0, ['Any'], 'Duck (high friendship)', 'Animal'],
          ['Aquamarine', 1, 0, ['Any'], 'Mining (Geodes)', 'Mining'],
          ['Red Cabbage', 1, 0, ['Summer'], 'Farming (Year 2+)', 'Farming'],
        ],
      },
      {
        name: 'Field Research Bundle',
        slots: 4,
        reward: 'Recycling Machine',
        items: [
          ['Nautilus Shell', 1, 0, ['Winter'], 'Beach foraging', 'Foraging'],
          ['Chub', 1, 0, ['Any'], 'Fishing (Mountain Lake / River)', 'Fishing'],
          ['Frozen Geode', 1, 0, ['Any'], 'Mining (Mines floors 40-79)', 'Mining'],
          ['Purple Mushroom', 1, 0, ['Any'], 'Mines / Farm Cave', 'Foraging'],
        ],
      },
      {
        name: 'Fodder Bundle',
        slots: 3,
        reward: 'Heater',
        items: [
          ['Wheat', 10, 0, ['Summer', 'Fall'], 'Farming', 'Farming'],
          ['Hay', 10, 0, ['Any'], 'Silo / Marnie\'s Ranch', 'Animal'],
          ['Apple', 3, 0, ['Fall'], 'Apple Tree', 'Farming'],
        ],
      },
      {
        name: 'Enchanter\'s Bundle',
        slots: 4,
        reward: '5 Gold Bar',
        items: [
          ['Oak Resin', 1, 0, ['Any'], 'Tapper on Oak Tree', 'Artisan'],
          ['Wine', 1, 0, ['Any'], 'Keg + any Fruit', 'Artisan'],
          ['Rabbit\'s Foot', 1, 0, ['Any'], 'Rabbit (high friendship)', 'Animal'],
          ['Pomegranate', 1, 0, ['Fall'], 'Pomegranate Tree', 'Farming'],
        ],
      },
    ],
  },
  {
    key: 'vault',
    name: 'Vault',
    color: '#fdd835',
    icon: 'vault',
    bundles: [
      {
        name: '2,500g Bundle',
        slots: 1,
        reward: '3 Chocolate Cake',
        items: [
          ['2,500g', 1, 0, ['Any'], 'Gold', 'Store'],
        ],
      },
      {
        name: '5,000g Bundle',
        slots: 1,
        reward: '30 Quality Fertilizer',
        items: [
          ['5,000g', 1, 0, ['Any'], 'Gold', 'Store'],
        ],
      },
      {
        name: '10,000g Bundle',
        slots: 1,
        reward: 'Lightning Rod',
        items: [
          ['10,000g', 1, 0, ['Any'], 'Gold', 'Store'],
        ],
      },
      {
        name: '25,000g Bundle',
        slots: 1,
        reward: 'Crystalarium',
        items: [
          ['25,000g', 1, 0, ['Any'], 'Gold', 'Store'],
        ],
      },
    ],
  },
];

// Flat list of all seasons for filtering
export const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter', 'Any'];

// All source categories for filtering
export const CATEGORIES = ['Farming', 'Foraging', 'Fishing', 'Mining', 'Animal', 'Artisan', 'Cooking', 'Monster', 'Store', 'Other'];

// Quality labels
export const QUALITY_LABELS = ['Normal', 'Silver', 'Gold', 'Iridium'];
export const QUALITY_COLORS = ['#9e9e9e', '#c0c0c0', '#ffd700', '#9c27b0'];
