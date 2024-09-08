import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shopping List",
    short_name: "ShoppingList",
    description: "A simple shopping list application",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/list.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/list.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
