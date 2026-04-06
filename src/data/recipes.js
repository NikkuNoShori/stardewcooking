// Static recipe data — the source of truth for all cooking recipes.
// User progress (checked/unchecked) is synced to Supabase separately.

// Each recipe: [name, [ingredients], harvestSeason, itemType, recipeSource, objectId, energy, health, buffs, buffDuration, sellPrice, sourceDetail]
// Index:        0     1              2              3         4             5         6       7       8      9             10         11
export const RECIPES_STATIC = [
  ["Fried Egg",["Egg"],"Any","Animal","Starter","194",50,22,"","","35g","Default Recipe"],
  ["Omelet",["Egg","Milk"],"Any","Animal","QoS Y1 Spring","195",100,45,"","","125g","Queen of Sauce, Spring 28, Year 1"],
  ["Salad",["Leek","Dandelion","Vinegar"],"Spring","Foraging","Friendship","196",113,50,"","","110g","Emily 3 Hearts"],
  ["Cheese Cauliflower",["Cauliflower","Cheese"],"Spring","Farming","Friendship","197",138,62,"","","300g","Pam 3 Hearts"],
  ["Baked Fish",["Sunfish","Bream","Wheat Flour"],"Spring","Fishing","QoS Y1 Summer","198",75,33,"","","100g","Queen of Sauce, Summer 7, Year 1"],
  ["Parsnip Soup",["Parsnip","Milk","Vinegar"],"Spring","Farming","Friendship","199",85,38,"","","120g","Caroline 3 Hearts"],
  ["Vegetable Medley",["Tomato","Beet"],"Fall","Farming","Friendship","200",165,74,"","","120g","Caroline 7 Hearts"],
  ["Complete Breakfast",["Fried Egg","Milk","Hashbrowns","Pancakes"],"Any","Mixed","QoS Y2 Spring","201",200,90,"Farming +2, Max Energy +50","7m","350g","Queen of Sauce, Spring 21, Year 2"],
  ["Fried Calamari",["Squid","Wheat Flour","Oil"],"Winter","Fishing","Friendship","202",80,36,"","","150g","Jodi 3 Hearts"],
  ["Strange Bun",["Wheat Flour","Periwinkle","Void Mayonnaise"],"Any","Mixed","Friendship","203",100,45,"","","225g","Shane 7 Hearts"],
  ["Lucky Lunch",["Sea Cucumber","Tortilla","Blue Jazz"],"Spring","Mixed","QoS Y2 Spring","204",100,45,"Luck +3","11m 11s","250g","Queen of Sauce, Spring 28, Year 2"],
  ["Fried Mushroom",["Common Mushroom","Morel","Oil"],"Spring","Foraging","Friendship","205",135,60,"Attack +2","7m","200g","Demetrius 3 Hearts"],
  ["Pizza",["Wheat Flour","Tomato","Cheese"],"Summer","Mixed","QoS Y2 Spring","206",150,67,"","","300g","Queen of Sauce, Spring 7, Year 2"],
  ["Bean Hotpot",["Green Bean x2"],"Spring","Farming","Friendship","207",125,56,"Max Energy +30, Magnetism +32","7m","100g","Clint 7 Hearts"],
  ["Glazed Yams",["Yam","Sugar"],"Fall","Farming","QoS Y1 Fall","208",200,90,"","","200g","Queen of Sauce, Fall 21, Year 1"],
  ["Carp Surprise",["Carp x4"],"Any","Fishing","QoS Y2 Summer","209",90,40,"","","150g","Queen of Sauce, Summer 7, Year 2"],
  ["Hashbrowns",["Potato","Oil"],"Spring","Farming","QoS Y2 Spring","210",90,40,"Farming +1","5m 35s","120g","Queen of Sauce, Spring 14, Year 2"],
  ["Pancakes",["Wheat Flour","Egg"],"Any","Mixed","QoS Y1 Summer","211",90,40,"Foraging +2","11m 11s","80g","Queen of Sauce, Summer 14, Year 1"],
  ["Salmon Dinner",["Salmon","Amaranth","Kale"],"Fall","Fishing","Friendship","212",125,56,"","","300g","Gus 3 Hearts"],
  ["Fish Taco",["Tuna","Tortilla","Red Cabbage","Mayonnaise"],"Summer","Fishing","Friendship","213",165,74,"Fishing +2","7m","500g","Linus 7 Hearts"],
  ["Crispy Bass",["Largemouth Bass","Wheat Flour","Oil"],"Any","Fishing","Friendship","214",90,40,"Magnetism +64","7m","150g","Kent 3 Hearts"],
  ["Pepper Poppers",["Hot Pepper","Cheese"],"Summer","Farming","Friendship","215",130,58,"Farming +2, Speed +1","7m","200g","Shane 3 Hearts"],
  ["Bread",["Wheat Flour"],"Any","Store-Bought","QoS Y1 Summer","216",50,22,"","","60g","Queen of Sauce, Summer 28, Year 1"],
  ["Tom Kha Soup",["Coconut","Shrimp","Common Mushroom"],"Any","Mixed","Friendship","218",175,78,"Farming +2, Max Energy +30","7m","250g","Sandy 7 Hearts"],
  ["Trout Soup",["Rainbow Trout","Green Algae"],"Summer","Fishing","QoS Y1 Fall","219",100,45,"Fishing +1","4m 39s","100g","Queen of Sauce, Fall 14, Year 1"],
  ["Chocolate Cake",["Wheat Flour","Sugar","Egg"],"Any","Mixed","QoS Y1 Winter","220",150,67,"","","200g","Queen of Sauce, Winter 14, Year 1"],
  ["Pink Cake",["Melon","Wheat Flour","Sugar","Egg"],"Summer","Farming","QoS Y2 Summer","221",250,112,"","","480g","Queen of Sauce, Summer 21, Year 2"],
  ["Rhubarb Pie",["Rhubarb","Wheat Flour","Sugar"],"Spring","Farming","Friendship","222",215,96,"","","400g","Marnie 7 Hearts"],
  ["Cookie",["Wheat Flour","Sugar","Egg"],"Any","Mixed","Friendship","223",90,40,"","","140g","Evelyn 4 Hearts"],
  ["Spaghetti",["Wheat Flour","Tomato"],"Summer","Farming","Friendship","224",75,33,"","","120g","Lewis 3 Hearts"],
  ["Fried Eel",["Eel","Oil"],"Spring","Fishing","Friendship","225",75,33,"Luck +1","7m","120g","George 3 Hearts"],
  ["Spicy Eel",["Eel","Hot Pepper"],"Summer","Fishing","Friendship","226",115,51,"Luck +1, Speed +1","7m","175g","George 7 Hearts"],
  ["Sashimi",["Any Fish"],"Any","Fishing","Friendship","227",75,33,"","","75g","Linus 3 Hearts"],
  ["Maki Roll",["Any Fish","Seaweed","Rice"],"Any","Fishing","QoS Y1 Summer","228",100,45,"","","220g","Queen of Sauce, Summer 21, Year 1"],
  ["Tortilla",["Corn"],"Summer","Farming","QoS Y1 Fall","229",50,22,"","","50g","Queen of Sauce, Fall 7, Year 1"],
  ["Red Plate",["Red Cabbage","Radish"],"Summer","Farming","Friendship","230",240,108,"Max Energy +50","3m 30s","400g","Emily 7 Hearts"],
  ["Eggplant Parmesan",["Eggplant","Tomato"],"Summer","Farming","Friendship","231",175,78,"Mining +1, Defense +3","4m 39s","200g","Lewis 7 Hearts"],
  ["Rice Pudding",["Milk","Sugar","Rice"],"Any","Animal","Friendship","232",115,51,"","","260g","Evelyn 7 Hearts"],
  ["Ice Cream",["Milk","Sugar"],"Any","Animal","Friendship","233",100,45,"","","120g","Jodi 7 Hearts"],
  ["Blueberry Tart",["Blueberry","Wheat Flour","Sugar","Egg"],"Summer","Farming","Friendship","234",125,56,"","","150g","Pierre 3 Hearts"],
  ["Autumn's Bounty",["Yam","Pumpkin"],"Fall","Farming","Friendship","235",220,99,"Foraging +2, Defense +2","7m 41s","350g","Demetrius 7 Hearts"],
  ["Pumpkin Soup",["Pumpkin","Milk"],"Fall","Farming","Friendship","236",200,90,"Defense +2, Luck +2","7m 41s","300g","Robin 7 Hearts"],
  ["Super Meal",["Bok Choy","Cranberries","Artichoke"],"Fall","Farming","Friendship","237",160,72,"Max Energy +40, Speed +1","3m 30s","220g","Kent 7 Hearts"],
  ["Cranberry Sauce",["Cranberries","Sugar"],"Fall","Farming","Friendship","238",125,56,"Mining +2","3m 30s","120g","Gus 7 Hearts"],
  ["Stuffing",["Bread","Cranberries","Hazelnut"],"Fall","Mixed","Friendship","239",170,76,"Defense +2","5m 35s","165g","Pam 7 Hearts"],
  ["Farmer's Lunch",["Omelet","Parsnip"],"Spring","Mixed","Skill","240",200,90,"Farming +3","5m 35s","150g","Farming Level 3"],
  ["Survival Burger",["Bread","Cave Carrot","Eggplant"],"Fall","Mixed","Skill","241",125,56,"Foraging +3","5m 35s","180g","Foraging Level 2"],
  ["Dish O' The Sea",["Sardine x2","Hashbrowns"],"Any","Fishing","Skill","242",150,67,"Fishing +3","5m 35s","220g","Fishing Level 3"],
  ["Miner's Treat",["Cave Carrot x2","Sugar","Milk"],"Any","Foraging","Skill","243",125,56,"Mining +3, Magnetism +32","5m 35s","200g","Mining Level 7"],
  ["Roots Platter",["Cave Carrot","Winter Root"],"Winter","Foraging","Skill","244",125,56,"Attack +3","5m 35s","100g","Combat Level 3"],
  ["Triple Shot Espresso",["Coffee x3"],"Any","Artisan","Shop","253",8,3,"Speed +1","4m 12s","450g","Stardrop Saloon, 5,000g"],
  ["Seafoam Pudding",["Flounder","Midnight Carp","Squid Ink"],"Fall","Fishing","Skill","265",175,78,"Fishing +4","3m 30s","300g","Fishing Level 9"],
  ["Algae Soup",["Green Algae x4"],"Any","Fishing","Friendship","456",75,33,"","","100g","Clint 3 Hearts"],
  ["Pale Broth",["White Algae x2"],"Any","Fishing","Friendship","457",125,56,"","","150g","Marnie 3 Hearts"],
  ["Plum Pudding",["Wild Plum x2","Wheat Flour","Sugar"],"Fall","Foraging","QoS Y1 Winter","604",175,78,"","","260g","Queen of Sauce, Winter 7, Year 1"],
  ["Artichoke Dip",["Artichoke","Milk"],"Fall","Farming","QoS Y1 Fall","605",100,45,"","","210g","Queen of Sauce, Fall 28, Year 1"],
  ["Stir Fry",["Cave Carrot","Common Mushroom","Kale","Oil"],"Any","Mixed","QoS Y1 Spring","606",200,90,"","","335g","Queen of Sauce, Spring 7, Year 1"],
  ["Roasted Hazelnuts",["Hazelnut x3"],"Fall","Foraging","QoS Y2 Summer","607",175,78,"","","270g","Queen of Sauce, Summer 28, Year 2"],
  ["Pumpkin Pie",["Pumpkin","Wheat Flour","Milk","Sugar"],"Fall","Farming","QoS Y1 Winter","608",225,101,"","","385g","Queen of Sauce, Winter 21, Year 1"],
  ["Radish Salad",["Oil","Vinegar","Radish"],"Summer","Farming","QoS Y1 Spring","609",200,90,"","","300g","Queen of Sauce, Spring 21, Year 1"],
  ["Fruit Salad",["Blueberry","Melon","Apricot"],"Summer","Farming","QoS Y2 Fall","610",263,118,"","","450g","Queen of Sauce, Fall 7, Year 2"],
  ["Blackberry Cobbler",["Blackberry x2","Sugar","Wheat Flour"],"Fall","Foraging","QoS Y2 Fall","611",175,78,"","","260g","Queen of Sauce, Fall 14, Year 2"],
  ["Cranberry Candy",["Cranberries","Apple","Sugar"],"Fall","Farming","QoS Y1 Winter","612",125,56,"","","175g","Queen of Sauce, Winter 28, Year 1"],
  ["Bruschetta",["Bread","Oil","Tomato"],"Summer","Mixed","QoS Y2 Winter","618",113,50,"","","210g","Queen of Sauce, Winter 21, Year 2"],
  ["Coleslaw",["Red Cabbage","Vinegar","Mayonnaise"],"Summer","Farming","QoS Y1 Spring","648",213,95,"","","345g","Queen of Sauce, Spring 14, Year 1"],
  ["Fiddlehead Risotto",["Oil","Fiddlehead Fern","Garlic"],"Summer","Foraging","QoS Y2 Fall","649",225,101,"","","350g","Queen of Sauce, Fall 28, Year 2"],
  ["Poppyseed Muffin",["Poppy","Wheat Flour","Sugar"],"Summer","Farming","QoS Y2 Winter","651",150,67,"","","250g","Queen of Sauce, Winter 7, Year 2"],
  ["Chowder",["Clam","Milk"],"Any","Crab Pot","Friendship","727",225,101,"Fishing +1","16m 47s","135g","Willy 3 Hearts"],
  ["Fish Stew",["Crayfish","Mussel","Periwinkle","Tomato"],"Summer","Crab Pot","Friendship","728",225,101,"Fishing +3","16m 47s","175g","Willy 7 Hearts"],
  ["Escargot",["Snail","Garlic"],"Any","Crab Pot","Friendship","729",225,101,"Fishing +2","16m 47s","125g","Willy 5 Hearts"],
  ["Lobster Bisque",["Lobster","Milk"],"Any","Crab Pot","QoS Y2 Winter","730",225,101,"Fishing +3, Max Energy +50","16m 47s","205g","Queen of Sauce, Winter 14, Year 2"],
  ["Maple Bar",["Maple Syrup","Sugar","Wheat Flour"],"Any","Artisan","QoS Y2 Summer","731",225,101,"Farming +1, Fishing +1, Mining +1","16m 47s","300g","Queen of Sauce, Summer 14, Year 2"],
  ["Crab Cakes",["Crab","Wheat Flour","Egg","Oil"],"Any","Crab Pot","QoS Y2 Fall","732",225,101,"Speed +1, Defense +1","16m 47s","275g","Queen of Sauce, Fall 21, Year 2"],
  ["Shrimp Cocktail",["Tomato","Shrimp","Wild Horseradish"],"Spring","Crab Pot","QoS Y2 Winter","733",225,101,"Fishing +1, Luck +1","10m 2s","160g","Queen of Sauce, Winter 28, Year 2"],
  ["Ginger Ale",["Ginger x3","Sugar"],"Island","Island","Shop","903",63,28,"Luck +1","5m","200g","Island Trader, 1,000g"],
  ["Banana Pudding",["Banana","Milk","Sugar"],"Island","Island","Shop","904",125,56,"Mining +1, Luck +1, Defense +1","5m 1s","260g","Island Trader, 30 Bone Fragments"],
  ["Mango Sticky Rice",["Mango","Coconut","Rice"],"Island","Island","Friendship","905",113,50,"Defense +3","5m 1s","250g","Leo 7 Hearts"],
  ["Poi",["Taro Root x4"],"Island","Island","Friendship","906",75,33,"","","400g","Leo 3 Hearts"],
  ["Tropical Curry",["Coconut","Pineapple","Hot Pepper"],"Island","Island","Shop","907",150,67,"Foraging +4","5m 1s","500g","Island Trader, 2,000g"],
  ["Squid Ink Ravioli",["Squid Ink","Wheat Flour","Tomato"],"Summer","Monster Drop","Skill","921",125,56,"Mining +1, Debuff Immunity","4m 39s","150g","Combat Level 9"],
  ["Moss Soup",["Moss x20"],"Any","Foraging","Skill","MossSoup",70,31,"","","100g","Foraging Level 3"],
];

// Convert DB row to the array format used throughout the app
export function dbRowToRecipe(row) {
  const ings = typeof row.ingredients === 'string' ? JSON.parse(row.ingredients) : row.ingredients;
  return [
    row.name, ings, row.season, row.item_type, row.source,
    row.object_id, row.energy, row.health, row.buffs,
    row.buff_duration, row.sell_price, row.source_detail || ''
  ];
}


// Sort orderings
export const SEASON_ORDER = { Spring: 0, Summer: 1, Fall: 2, Winter: 3, Any: 4, Island: 6 };
export const TYPE_ORDER = { Farming: 0, Fishing: 1, "Crab Pot": 2, Foraging: 3, Animal: 4, Artisan: 5, "Store-Bought": 6, "Monster Drop": 7, Island: 8, Mixed: 9 };
export const SOURCE_ORDER = { Starter: 0, "QoS Y1 Spring": 1, "QoS Y1 Summer": 2, "QoS Y1 Fall": 3, "QoS Y1 Winter": 4, "QoS Y2 Spring": 5, "QoS Y2 Summer": 6, "QoS Y2 Fall": 7, "QoS Y2 Winter": 8, Friendship: 9, Skill: 10, Shop: 11 };

export const SOURCE_LABELS = {
  "Starter": "Default Recipe",
  "QoS Y1 Spring": "Queen of Sauce — Yr 1 Spring",
  "QoS Y1 Summer": "Queen of Sauce — Yr 1 Summer",
  "QoS Y1 Fall": "Queen of Sauce — Yr 1 Fall",
  "QoS Y1 Winter": "Queen of Sauce — Yr 1 Winter",
  "QoS Y2 Spring": "Queen of Sauce — Yr 2 Spring",
  "QoS Y2 Summer": "Queen of Sauce — Yr 2 Summer",
  "QoS Y2 Fall": "Queen of Sauce — Yr 2 Fall",
  "QoS Y2 Winter": "Queen of Sauce — Yr 2 Winter",
  "Friendship": "Villager Friendship",
  "Skill": "Skill Level Up",
  "Shop": "Purchased from Shop",
};

export function seasonLabel(s) {
  return s === 'Any' ? 'Any Season' : s === 'Island' ? 'Ginger Island' : s;
}

export function parseIngredient(raw) {
  const m = raw.match(/^(.+?)\s*x(\d+)$/);
  return m ? { name: m[1], qty: parseInt(m[2]) } : { name: raw, qty: 1 };
}
