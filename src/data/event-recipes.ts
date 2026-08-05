export interface EventRecipeItem {
  name: string;
  ingredients: string[];
  emoji: string;
}

export const EVENT_RECIPES: EventRecipeItem[] = [
  { name: "IJskoud Oceaandrankje", ingredients: ["2x Spirulina Poeder","2x Sterfruit"], emoji: "🍽️" },
  { name: "Tomaten Zeevruchtensoep", ingredients: ["Garnaal","Tomaat","Zeekraal","Tarwe"], emoji: "🍽️" },
  { name: "Schelpparel Taart", ingredients: ["Sint-Jakobsschelp","Tarwe","Melk","Fruit"], emoji: "🍽️" },
  { name: "Gegrilde Inktvis met Vruchtenjam", ingredients: ["Japanse Vliegende Inktvis","Zeedruiven","Wakame","Vruchtenjam"], emoji: "🍽️" },
  { name: "Oceaanfeestmaal", ingredients: ["IJskoud Oceaandrankje","Tomaten Zeevruchtensoep","Schelpparel Taart","Gegrilde Inktvis met Vruchtenjam"], emoji: "🍽️" },
];
