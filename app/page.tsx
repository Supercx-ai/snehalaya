import { getProductsPage, getColorFilterValues, getFabricFilterValues, getCollection } from "@/lib/shopify";
import Products from "@/components/Products";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import InstagramFeed from "@/components/InstagramFeed";
import BrandAmbassador from "@/components/BrandAmbassador";
import ColourPicker from "@/components/ColourPicker";
import SareeFinder from "@/components/SareeFinder";
import Hero from "@/components/Hero";
import ShopByWeave from "@/components/ShopByWeave";
import ShopByOccasion from "@/components/ShopByOccasion";
import NewArrivals from "@/components/NewArrivals";
import SearchByImagePromo from "@/components/SearchByImagePromo";
import PromoBanner from "@/components/PromoBanner";
import KanjivaramEdit from "@/components/KanjivaramEdit";
import TrendingPicks from "@/components/TrendingPicks";
import MaharaniPromo from "@/components/MaharaniPromo";
import LiveShoppingPromo from "@/components/LiveShoppingPromo";
import ShopTheLook from "@/components/ShopTheLook";
import WornAndLoved from "@/components/WornAndLoved";

export const revalidate = 600; // ISR: rebuild at most every 10 min; webhook busts it sooner

export default async function Home() {
  // One round-trip each, in parallel.
  const [firstPage, colours, fabrics, newArrivals, trending, snehasPicks] = await Promise.all([
    getProductsPage(12),
    getColorFilterValues(),
    getFabricFilterValues(),
    getCollection("new-arrivals", { first: 10, sortKey: "CREATED", reverse: true }),
    getCollection("new-arrivals", { first: 8, sortKey: "BEST_SELLING" }),
    getCollection("maharani-exclusive", { first: 8 }),
  ]);
  const newArrivalProducts = newArrivals?.products.nodes ?? [];
  // Show 2 different products in the promo card when the catalogue is large enough;
  // otherwise fall back to reusing the first 2 rather than rendering an empty gap.
  const promoProducts = newArrivalProducts.length > 8 ? newArrivalProducts.slice(8, 10) : newArrivalProducts.slice(0, 2);

  return (
    <main>
      <Hero />
      <ShopByWeave />
      <ShopByOccasion />
      <SareeFinder fabrics={fabrics} colours={colours} />
      <NewArrivals products={newArrivalProducts.slice(0, 8)} />
      <SearchByImagePromo products={promoProducts} />
      <PromoBanner />
      <KanjivaramEdit />
      <TrendingPicks trending={trending?.products.nodes ?? []} snehasPicks={snehasPicks?.products.nodes ?? []} />
      <MaharaniPromo />
      <LiveShoppingPromo />
      <ShopTheLook />
      <InstagramFeed />
      <WornAndLoved />

      {colours.length > 0 && (
        <section style={{ marginBottom: "3rem" }}>
          <h2>Shop by colour</h2>
          <ColourPicker colours={colours} />
        </section>
      )}

      <BrandAmbassador />

      <Products initial={firstPage.nodes} cursor={firstPage.pageInfo.endCursor} hasNext={firstPage.pageInfo.hasNextPage} />

      <WhatsAppCTA />
    </main>
  );
}
