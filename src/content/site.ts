// Every text of the page lives here, in English. The brand, the shops and the reviews are sample content.
import type { ImageMetadata } from "astro";
import cone from "@/assets/hero/cone.png";
import iceCream from "@/assets/menu/ice-cream.png";
import iceCoffee from "@/assets/menu/ice-coffee.png";
import milkshake from "@/assets/menu/milkshake.png";
import farm from "@/assets/story/farm.png";
import avatar1 from "@/assets/reviews/avatar-1.png";
import avatar2 from "@/assets/reviews/avatar-2.png";
import avatar3 from "@/assets/reviews/avatar-3.png";
import berryPopsicles from "@/assets/gallery/berry-popsicles.png";
import blueberryCones from "@/assets/gallery/blueberry-cones.png";
import freakshake from "@/assets/gallery/freakshake.png";
import fruitBowl from "@/assets/gallery/fruit-bowl.png";
import icedChocolate from "@/assets/gallery/iced-chocolate.png";
import matchaPopsicles from "@/assets/gallery/matcha-popsicles.png";
import pinkCone from "@/assets/gallery/pink-cone.png";
import puppy from "@/assets/gallery/puppy.png";
import smile from "@/assets/gallery/smile.png";
import streetCone from "@/assets/gallery/street-cone.png";

export interface Link {
  label: string;
  href: string;
}

export interface Flavour {
  id: string;
  name: string;
  note: string;
  /** Section background while this scoop is the current one. */
  colour: string;
}

export interface MenuItem {
  id: string;
  name: string;
  lead: string;
  details: string[];
  price: string;
  colour: string;
  image: ImageMetadata;
  alt: string;
}

export interface Step {
  title: string;
  text: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface Photo {
  image: ImageMetadata;
  alt: string;
}

export interface Review {
  quote: string;
  name: string;
  city: string;
  avatar: ImageMetadata;
}

export interface Shop {
  kind: string;
  city: string;
  area: string;
  hours: { days: string; time: string }[];
  phone: string;
  email: string;
  /** Search phrase for the map embed, loaded only when the visitor asks for the map. */
  map: string;
}

export const site = {
  name: "Velluto",
  lang: "en",
  title: "Velluto: ice cream made with passion",
  description:
    "Small-batch ice cream, iced coffee and milkshakes made every morning from farm milk and ripe fruit. 16 cafés and 23 food trucks across the US.",
  themeColour: "#fff8f1",
};

export const nav: Link[] = [
  { label: "Flavours", href: "#flavours" },
  { label: "Menu", href: "#menu" },
  { label: "Our story", href: "#story" },
  { label: "Shops", href: "#shops" },
];

export const hero = {
  eyebrow: "Small-batch gelato since 2009",
  title: ["Ice cream", "made with"],
  accent: "passion",
  lead: "Churned every morning from farm milk, ripe fruit and not much else. No powders, no shortcuts, just scoops worth crossing town for.",
  primary: { label: "Taste the flavours", href: "#flavours" },
  secondary: { label: "Find a shop", href: "#shops" },
  image: cone,
  alt: "A waffle cone stacked with five scoops (raspberry, salted caramel, mint, mango and pistachio) under a swirl of fior di latte",
  stats: [
    { value: 16, label: "cafés" },
    { value: 23, label: "food trucks" },
  ],
};

export const flavours = {
  eyebrow: "Five scoops, one cone",
  title: "Build the cone we're famous for",
  lead: "Scroll to stack it, scoop by scoop. Each flavour is churned in batches of twelve litres, so it never sits in the freezer for long.",
  // Bottom to top, in the order they land on the cone (the order of the Blender frame sequence).
  frames: { count: 96, path: "cone/" },
  items: [
    {
      id: "raspberry",
      name: "Raspberry sorbet",
      note: "Picked in Oregon, blended with a squeeze of lime. Dairy-free.",
      colour: "#ffd3dd",
    },
    {
      id: "caramel",
      name: "Salted caramel",
      note: "Sugar cooked to amber, finished with flakes of sea salt.",
      colour: "#f9ddb5",
    },
    {
      id: "mint",
      name: "Fresh mint",
      note: "Garden mint steeped overnight in cream. No green dye.",
      colour: "#cdeedd",
    },
    {
      id: "mango",
      name: "Alphonso mango",
      note: "The sweetest mango there is, at its ripest in May.",
      colour: "#ffd9a6",
    },
    {
      id: "pistachio",
      name: "Sicilian pistachio",
      note: "Bronte pistachios, roasted and ground in the shop.",
      colour: "#e4ebc0",
    },
    {
      id: "cream",
      name: "Fior di latte",
      note: "Just milk, cream and a little sugar: the crown of every cone.",
      colour: "#fff1e2",
    },
  ] satisfies Flavour[],
};

export const menu = {
  eyebrow: "100% natural",
  title: "On the menu",
  items: [
    {
      id: "ice-cream",
      name: "Ice cream",
      lead: "Twenty-four flavours in the counter every day, from the classics to the seasonal ones that sell out by four.",
      details: [
        "One, two or three scoops in a cup or a waffle cone baked in the shop",
        "Six dairy-free sorbets made with fruit and water only",
        "Toppings: roasted nuts, berry coulis, dark chocolate, sea salt",
      ],
      price: "from $4.50",
      colour: "#ffd3dd",
      image: iceCream,
      alt: "A striped paper cup with a scoop of strawberry and a scoop of vanilla ice cream and a wafer",
    },
    {
      id: "ice-coffee",
      name: "Ice coffee",
      lead: "Cold-brewed for eighteen hours, poured over ice and finished with a scoop of fior di latte if you like.",
      details: [
        "Single-origin beans from a roaster two streets away",
        "Oat, almond or whole milk at no extra cost",
        "Affogato: a hot espresso shot over any flavour",
      ],
      price: "from $3.90",
      colour: "#f3dcc0",
      image: iceCoffee,
      alt: "A tall glass of iced coffee over milk, with ice cubes and a brown straw",
    },
    {
      id: "milkshakes",
      name: "Milkshakes",
      lead: "Three scoops blended with cold milk. Go plain, or let us pile on cookies, marshmallows and a chocolate drip.",
      details: [
        "Any flavour from the counter, blended to order",
        "Freakshakes on weekends: cookies, cream and a hazelnut praline on top",
        "Kids' size for anyone under twelve",
      ],
      price: "from $6.20",
      colour: "#dcebc4",
      image: milkshake,
      alt: "A chocolate milkshake topped with whipped cream, a cherry, a cookie and a striped straw",
    },
  ] satisfies MenuItem[],
};

export const story = {
  eyebrow: "Tradition and love",
  title: "How it's made",
  image: farm,
  alt: "A jug of fresh milk in front of a dairy cow on a green pasture",
  steps: [
    {
      title: "Milk from one farm",
      text: "Every morning a truck brings milk from Hillside Farm, ninety minutes away. The cows graze outside from April to October.",
    },
    {
      title: "Fruit at its peak",
      text: "We buy fruit only when it is in season and freeze none of it. That is why the mango is gone in September.",
    },
    {
      title: "Churned slowly",
      text: "Small batch freezers turn the base for twelve minutes, so less air goes in and every scoop is dense and silky.",
    },
    {
      title: "Served the same day",
      text: "What is made in the morning is in the counter by noon. Whatever is left at closing goes into tomorrow's milkshakes.",
    },
  ] satisfies Step[],
};

export const numbers = {
  title: "The numbers behind every scoop",
  items: [
    { value: 721, suffix: "", label: "litres churned on an average day" },
    { value: 16, suffix: " kg", label: "of fresh fruit in every batch of sorbet" },
    { value: 84, suffix: "", label: "flavours we have made since 2009" },
  ] satisfies Stat[],
  ingredients: [
    "Farm milk",
    "Fresh cream",
    "Cane sugar",
    "Ripe fruit",
    "Bronte pistachios",
    "Sea salt",
    "Vanilla pods",
    "Dark chocolate",
    "Garden mint",
    "Cold brew",
  ],
};

export const gallery = {
  eyebrow: "@velluto.gelato on Instagram",
  title: "Scoops in the wild",
  photos: [
    {
      image: blueberryCones,
      alt: "Waffle cones with pastel ice cream, blueberries and edible flowers",
    },
    { image: pinkCone, alt: "A hand holding a cone of strawberry ice cream against a yellow wall" },
    { image: smile, alt: "A smiling woman with a cone of vanilla ice cream" },
    { image: matchaPopsicles, alt: "Matcha ice lollies with dried rose petals in a wooden bowl" },
    { image: puppy, alt: "A small dog licking a raspberry ice-cream cone" },
    { image: freakshake, alt: "A pink freakshake with a doughnut and sprinkles on top" },
    { image: berryPopsicles, alt: "Strawberry ice lollies with raspberries on white marble" },
    { image: streetCone, alt: "A cone of red sorbet held up in a busy shopping street" },
    { image: fruitBowl, alt: "A bowl of ice cream topped with strawberries and blueberries" },
    { image: icedChocolate, alt: "A glass of iced chocolate dusted with cocoa" },
  ] satisfies Photo[],
};

export const reviews = {
  eyebrow: "Kind words",
  title: "People cross town for this",
  items: [
    {
      quote:
        "The pistachio tastes like actual pistachios. I've stopped buying ice cream anywhere else, and my freezer is not happy about it.",
      name: "Emily R.",
      city: "Los Angeles",
      avatar: avatar1,
    },
    {
      quote:
        "We booked the food truck for our wedding. Two hundred guests, zero leftovers and a queue that never got shorter.",
      name: "Sofia M.",
      city: "Chicago",
      avatar: avatar2,
    },
    {
      quote:
        "The staff let you taste everything without rolling their eyes. Came for one scoop, left with a pint of salted caramel.",
      name: "Grace O.",
      city: "New York",
      avatar: avatar3,
    },
  ] satisfies Review[],
};

export const shops = {
  eyebrow: "Come say hi",
  title: "Find a shop",
  lead: "Three of our favourite spots. The other 36 are on the map in every shop, and the trucks post where they park each morning.",
  items: [
    {
      kind: "Café",
      city: "Chicago",
      area: "Wicker Park, Chicago, IL",
      hours: [
        { days: "Monday to Friday", time: "7 am to 10 pm" },
        { days: "Saturday and Sunday", time: "9 am to 11 pm" },
      ],
      phone: "+1 312 555 0142",
      email: "chicago@velluto.example",
      map: "Wicker Park, Chicago, IL",
    },
    {
      kind: "Food truck",
      city: "Los Angeles",
      area: "Venice Beach Boardwalk, CA",
      hours: [
        { days: "Monday to Friday", time: "11 am to 8 pm" },
        { days: "Saturday and Sunday", time: "10 am to 10 pm" },
      ],
      phone: "+1 213 555 0178",
      email: "truck@velluto.example",
      map: "Venice Beach Boardwalk, Los Angeles, CA",
    },
    {
      kind: "Café",
      city: "New York",
      area: "West Village, New York, NY",
      hours: [
        { days: "Monday to Friday", time: "7 am to 11 pm" },
        { days: "Saturday and Sunday", time: "9 am to midnight" },
      ],
      phone: "+1 212 555 0115",
      email: "newyork@velluto.example",
      map: "West Village, New York, NY",
    },
  ] satisfies Shop[],
  franchise: {
    title: "Open a Velluto café in your town",
    text: "We train you in our kitchen for six weeks and deliver the freezers, the recipes and the first hundred litres.",
    cta: {
      label: "Ask about a franchise",
      href: "mailto:franchise@velluto.example?subject=Franchise",
    },
  },
};

export const footer = {
  line: ["Homemade ice cream,", "made with passion"],
  phone: "+1 312 555 0100",
  email: "hello@velluto.example",
  social: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "TikTok", href: "https://www.tiktok.com/" },
    { label: "Facebook", href: "https://www.facebook.com/" },
  ] satisfies Link[],
  note: "Sample content: the brand, the shops and the reviews are made up for this demo.",
};

/** Turns "+1 312 555 0142" into a tel: link. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
