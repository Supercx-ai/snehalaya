// ponytail: hours/phone are still placeholders — swap with real showroom details.
// Addresses and photos are real (pulled from the Figma design).
export const STORES = [
  {
    city: "Chennai",
    label: "T. Nagar, Chennai",
    address: "23, Venkatanarayana Rd, T. Nagar, Chennai, Tamil Nadu 600017",
    hours: "Mon - Sun: 10:00 AM - 9:00 PM",
    phone: "+91 00000 00000",
    image: "/figma/stores/chennai.png",
  },
  {
    city: "Coimbatore",
    label: "R.S. Puram, Coimbatore",
    address: "83, East Thiru Venkatasamy Road, RS Puram, Coimbatore 641002",
    hours: "Mon - Sun: 10:00 AM - 8:30 PM",
    phone: "+91 00000 00000",
    image: "/figma/stores/coimbatore.png",
  },
] as const;
