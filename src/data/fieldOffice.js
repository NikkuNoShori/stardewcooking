// Ginger Island Field Office — 11 fossil donations
export const FIELD_OFFICE_SURVEYS = [
  {
    name: "Snake Skeleton",
    reward: "3 Golden Walnuts",
    items: ["Snake Vertebrae", "Snake Vertebrae", "Snake Skull"],
  },
  {
    name: "Large Animal",
    reward: "6 Golden Walnuts + Ostrich Incubator recipe",
    items: ["Fossilized Leg", "Fossilized Ribs", "Fossilized Skull", "Fossilized Spine", "Fossilized Tail"],
  },
  {
    name: "Mummified Creatures",
    reward: "3 Golden Walnuts",
    items: ["Mummified Frog", "Mummified Bat", "Mummified Lizard"],
  },
];

export const FIELD_OFFICE_ITEMS = [
  { name: "Snake Vertebrae", source: "Dig Site bone nodes", tip: "You need 3 total for the full snake skeleton", survey: "Snake Skeleton", count: 2 },
  { name: "Snake Skull", source: "Dig Site bone nodes", tip: "Rarer drop from bone nodes", survey: "Snake Skeleton", count: 1 },
  { name: "Mummified Frog", source: "Dig Site artifact spots", tip: "Also a rare drop from Tiger Slimes", survey: "Mummified Creatures", count: 1 },
  { name: "Mummified Bat", source: "Volcano Dungeon", tip: "Drops from enemies in the Volcano", survey: "Mummified Creatures", count: 1 },
  { name: "Mummified Lizard", source: "Dig Site bone nodes", tip: "Rare — keep mining bone nodes", survey: "Mummified Creatures", count: 1 },
  { name: "Fossilized Leg", source: "Dig Site bone nodes", tip: "Part of the Large Animal skeleton", survey: "Large Animal", count: 1 },
  { name: "Fossilized Ribs", source: "Dig Site bone nodes", tip: "Part of the Large Animal skeleton", survey: "Large Animal", count: 1 },
  { name: "Fossilized Skull", source: "Dig Site bone nodes", tip: "Part of the Large Animal skeleton", survey: "Large Animal", count: 1 },
  { name: "Fossilized Spine", source: "Dig Site bone nodes", tip: "Part of the Large Animal skeleton", survey: "Large Animal", count: 1 },
  { name: "Fossilized Tail", source: "Dig Site bone nodes", tip: "Also from fishing treasure on the island", survey: "Large Animal", count: 1 },
];
