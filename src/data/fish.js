export const FISH = [
  // ============ REGULAR FISH ============
  { name: "Smallmouth Bass", location: "River", season: ["Spring", "Fall"], time: "Any", weather: "Any", difficulty: 28, price: 50, category: "Regular" },
  { name: "Sunfish", location: "River", season: ["Spring", "Summer"], time: "6am-7pm", weather: "Sunny", difficulty: 30, price: 30, category: "Regular" },
  { name: "Catfish", location: "River/Secret Woods", season: ["Spring", "Fall"], time: "6am-12am", weather: "Rain", difficulty: 75, price: 200, category: "Regular" },
  { name: "Shad", location: "River", season: ["Summer", "Fall", "Winter"], time: "9am-2am", weather: "Rain", difficulty: 45, price: 60, category: "Regular" },
  { name: "Tiger Trout", location: "River", season: ["Fall", "Winter"], time: "6am-7pm", weather: "Any", difficulty: 60, price: 150, category: "Regular" },
  { name: "Largemouth Bass", location: "Mountain Lake", season: ["Any"], time: "6am-7pm", weather: "Any", difficulty: 50, price: 100, category: "Regular" },
  { name: "Carp", location: "Mountain Lake/Secret Woods/Sewers", season: ["Any"], time: "Any", weather: "Any", difficulty: 15, price: 30, category: "Regular" },
  { name: "Bullhead", location: "Mountain Lake", season: ["Any"], time: "Any", weather: "Any", difficulty: 46, price: 75, category: "Regular" },
  { name: "Sturgeon", location: "Mountain Lake", season: ["Summer", "Winter"], time: "6am-7pm", weather: "Any", difficulty: 78, price: 200, category: "Regular" },
  { name: "Sardine", location: "Ocean", season: ["Spring", "Fall", "Winter"], time: "6am-7pm", weather: "Any", difficulty: 30, price: 40, category: "Regular" },
  { name: "Tuna", location: "Ocean", season: ["Summer", "Winter"], time: "6am-7pm", weather: "Any", difficulty: 70, price: 100, category: "Regular" },
  { name: "Red Snapper", location: "Ocean", season: ["Summer", "Fall", "Winter"], time: "6am-7pm", weather: "Rain", difficulty: 40, price: 50, category: "Regular" },
  { name: "Tilapia", location: "Ocean", season: ["Summer", "Fall"], time: "6am-2pm", weather: "Any", difficulty: 50, price: 75, category: "Regular" },
  { name: "Walleye", location: "River/Mountain Lake/Forest Pond", season: ["Fall"], time: "12pm-2am", weather: "Rain", difficulty: 45, price: 105, category: "Regular" },
  { name: "Bream", location: "River", season: ["Any"], time: "6pm-2am", weather: "Any", difficulty: 35, price: 45, category: "Regular" },
  { name: "Eel", location: "Ocean", season: ["Spring", "Fall"], time: "4pm-2am", weather: "Rain", difficulty: 70, price: 85, category: "Regular" },
  { name: "Pufferfish", location: "Ocean", season: ["Summer"], time: "12pm-4pm", weather: "Sunny", difficulty: 80, price: 200, category: "Regular" },
  { name: "Woodskip", location: "Secret Woods/Forest Farm", season: ["Any"], time: "Any", weather: "Any", difficulty: 50, price: 75, category: "Regular" },
  { name: "Rainbow Trout", location: "River", season: ["Summer"], time: "6am-7pm", weather: "Sunny", difficulty: 45, price: 65, category: "Regular" },
  { name: "Salmon", location: "River", season: ["Fall"], time: "6am-7pm", weather: "Any", difficulty: 50, price: 75, category: "Regular" },
  { name: "Pike", location: "River/Forest Pond", season: ["Summer", "Winter"], time: "Any", weather: "Any", difficulty: 60, price: 100, category: "Regular" },
  { name: "Albacore", location: "Ocean", season: ["Fall", "Winter"], time: "6am-11am & 6pm-2am", weather: "Any", difficulty: 60, price: 75, category: "Regular" },
  { name: "Halibut", location: "Ocean", season: ["Spring", "Summer", "Winter"], time: "6am-11am & 7pm-2am", weather: "Any", difficulty: 50, price: 80, category: "Regular" },
  { name: "Lingcod", location: "River/Mountain Lake", season: ["Winter"], time: "Any", weather: "Any", difficulty: 85, price: 120, category: "Regular" },
  { name: "Midnight Carp", location: "Mountain Lake/Forest Pond", season: ["Fall", "Winter"], time: "10pm-2am", weather: "Any", difficulty: 55, price: 150, category: "Regular" },
  { name: "Red Mullet", location: "Ocean", season: ["Summer", "Winter"], time: "6am-7pm", weather: "Any", difficulty: 55, price: 75, category: "Regular" },
  { name: "Squid", location: "Ocean", season: ["Winter"], time: "6pm-2am", weather: "Any", difficulty: 75, price: 80, category: "Regular" },
  { name: "Sea Cucumber", location: "Ocean", season: ["Fall", "Winter"], time: "6am-7pm", weather: "Any", difficulty: 40, price: 75, category: "Regular" },
  { name: "Super Cucumber", location: "Ocean", season: ["Summer", "Fall"], time: "6pm-2am", weather: "Any", difficulty: 80, price: 250, category: "Regular" },
  { name: "Octopus", location: "Ocean", season: ["Summer"], time: "6am-1pm", weather: "Any", difficulty: 95, price: 150, category: "Regular" },
  { name: "Sandfish", location: "Desert", season: ["Any"], time: "6am-8pm", weather: "Any", difficulty: 65, price: 75, category: "Regular" },
  { name: "Scorpion Carp", location: "Desert", season: ["Any"], time: "6am-8pm", weather: "Any", difficulty: 90, price: 150, category: "Regular" },
  { name: "Flounder", location: "Ocean", season: ["Spring", "Summer"], time: "6am-8pm", weather: "Any", difficulty: 50, price: 100, category: "Regular" },
  { name: "Dorado", location: "Forest River", season: ["Summer"], time: "6am-7pm", weather: "Any", difficulty: 78, price: 100, category: "Regular" },
  { name: "Perch", location: "River", season: ["Winter"], time: "Any", weather: "Any", difficulty: 35, price: 55, category: "Regular" },
  { name: "Chub", location: "River/Mountain Lake", season: ["Any"], time: "Any", weather: "Any", difficulty: 35, price: 50, category: "Regular" },
  { name: "Goby", location: "Forest River", season: ["Any"], time: "Any", weather: "Any", difficulty: 50, price: 150, category: "Regular" },

  // ============ MINES FISH ============
  { name: "Ghostfish", location: "Mines (Floor 20/60)", season: ["Any"], time: "Any", weather: "Any", difficulty: 50, price: 45, category: "Mines" },
  { name: "Stonefish", location: "Mines (Floor 20)", season: ["Any"], time: "Any", weather: "Any", difficulty: 65, price: 300, category: "Mines" },
  { name: "Ice Pip", location: "Mines (Floor 60)", season: ["Any"], time: "Any", weather: "Any", difficulty: 85, price: 500, category: "Mines" },
  { name: "Lava Eel", location: "Mines (Floor 100)", season: ["Any"], time: "Any", weather: "Any", difficulty: 90, price: 700, category: "Mines" },

  // ============ CRAB POT FISH ============
  // Freshwater
  { name: "Crayfish", location: "Freshwater Crab Pot", season: ["Any"], time: "Any", weather: "Any", difficulty: 0, price: 75, category: "Crab Pot" },
  { name: "Snail", location: "Freshwater Crab Pot", season: ["Any"], time: "Any", weather: "Any", difficulty: 0, price: 65, category: "Crab Pot" },
  { name: "Periwinkle", location: "Freshwater Crab Pot", season: ["Any"], time: "Any", weather: "Any", difficulty: 0, price: 20, category: "Crab Pot" },
  // Saltwater
  { name: "Lobster", location: "Saltwater Crab Pot", season: ["Any"], time: "Any", weather: "Any", difficulty: 0, price: 120, category: "Crab Pot" },
  { name: "Crab", location: "Saltwater Crab Pot", season: ["Any"], time: "Any", weather: "Any", difficulty: 0, price: 100, category: "Crab Pot" },
  { name: "Cockle", location: "Saltwater Crab Pot", season: ["Any"], time: "Any", weather: "Any", difficulty: 0, price: 50, category: "Crab Pot" },
  { name: "Mussel", location: "Saltwater Crab Pot", season: ["Any"], time: "Any", weather: "Any", difficulty: 0, price: 30, category: "Crab Pot" },
  { name: "Shrimp", location: "Saltwater Crab Pot", season: ["Any"], time: "Any", weather: "Any", difficulty: 0, price: 60, category: "Crab Pot" },
  { name: "Oyster", location: "Saltwater Crab Pot", season: ["Any"], time: "Any", weather: "Any", difficulty: 0, price: 40, category: "Crab Pot" },
  { name: "Clam", location: "Saltwater Crab Pot", season: ["Any"], time: "Any", weather: "Any", difficulty: 0, price: 50, category: "Crab Pot" },

  // ============ LEGENDARY FISH ============
  { name: "Legend", location: "Mountain Lake", season: ["Spring"], time: "Any", weather: "Rain", difficulty: 110, price: 5000, category: "Legendary", note: "Fishing Level 10 required" },
  { name: "Crimsonfish", location: "East Pier", season: ["Summer"], time: "Any", weather: "Any", difficulty: 95, price: 1500, category: "Legendary", note: "Fishing Level 5 required" },
  { name: "Angler", location: "Town River", season: ["Fall"], time: "Any", weather: "Any", difficulty: 85, price: 900, category: "Legendary", note: "Fishing Level 3 required" },
  { name: "Glacierfish", location: "Cindersap Forest", season: ["Winter"], time: "Any", weather: "Any", difficulty: 100, price: 1000, category: "Legendary", note: "Fishing Level 6 required" },
  { name: "Mutant Carp", location: "Sewers", season: ["Any"], time: "Any", weather: "Any", difficulty: 80, price: 1000, category: "Legendary" },

  // ============ NIGHT MARKET FISH ============
  { name: "Midnight Squid", location: "Submarine", season: ["Winter"], time: "5pm-11pm", weather: "Any", difficulty: 55, price: 100, category: "Night Market" },
  { name: "Spook Fish", location: "Submarine", season: ["Winter"], time: "5pm-11pm", weather: "Any", difficulty: 60, price: 220, category: "Night Market" },
  { name: "Blobfish", location: "Submarine", season: ["Winter"], time: "5pm-11pm", weather: "Any", difficulty: 75, price: 500, category: "Night Market" },

  // ============ GINGER ISLAND FISH ============
  { name: "Lionfish", location: "Ginger Island Ocean", season: ["Any"], time: "Any", weather: "Any", difficulty: 50, price: 100, category: "Ginger Island" },
  { name: "Blue Discus", location: "Ginger Island River", season: ["Any"], time: "Any", weather: "Any", difficulty: 60, price: 120, category: "Ginger Island" },
  { name: "Stingray", location: "Pirate Cove", season: ["Any"], time: "Any", weather: "Any", difficulty: 80, price: 180, category: "Ginger Island" },

  // ============ OTHER ============
  { name: "Seaweed", location: "Ocean", season: ["Any"], time: "Any", weather: "Any", difficulty: 0, price: 20, category: "Other" },
  { name: "Green Algae", location: "River/Lake", season: ["Any"], time: "Any", weather: "Any", difficulty: 0, price: 15, category: "Other" },
  { name: "White Algae", location: "Mines", season: ["Any"], time: "Any", weather: "Any", difficulty: 0, price: 25, category: "Other" },
  { name: "Sea Jelly", location: "Ocean", season: ["Any"], time: "Any", weather: "Any", difficulty: 0, price: 100, category: "Other" },
  { name: "River Jelly", location: "River", season: ["Any"], time: "Any", weather: "Any", difficulty: 0, price: 70, category: "Other" },
  { name: "Cave Jelly", location: "Mines", season: ["Any"], time: "Any", weather: "Any", difficulty: 0, price: 150, category: "Other" },
];

export const FISH_CATEGORIES = ["Regular", "Mines", "Crab Pot", "Legendary", "Night Market", "Ginger Island", "Other"];
