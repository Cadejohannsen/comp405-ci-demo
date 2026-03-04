import axios from "axios";
import * as cheerio from "cheerio";

export interface ScrapedListing {
  title: string;
  price: number;
  mileage: number;
  year: number;
  make: string;
  model: string;
  bodyType: string;
  dealerName: string;
  dealerLocation: string;
  url: string;
  imageUrl?: string;
}

export async function scrapeCarListings(
  url: string
): Promise<ScrapedListing[]> {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(html);
    const listings: ScrapedListing[] = [];

    $(".vehicle-card, .listing-row, [data-qa='vehicle-card']").each(
      (_, element) => {
        const el = $(element);
        const title =
          el.find(".vehicle-title, .listing-title, h2").first().text().trim() ||
          "";
        const priceText =
          el
            .find(".vehicle-price, .listing-price, .price")
            .first()
            .text()
            .trim() || "0";
        const price = parseInt(priceText.replace(/[^0-9]/g, "")) || 0;
        const mileageText =
          el.find(".mileage, .listing-mileage").first().text().trim() || "0";
        const mileage = parseInt(mileageText.replace(/[^0-9]/g, "")) || 0;
        const imageUrl =
          el.find("img").first().attr("src") ||
          el.find("img").first().attr("data-src") ||
          undefined;
        const link =
          el.find("a").first().attr("href") ||
          el.closest("a").attr("href") ||
          "";

        if (title && price > 0) {
          const parts = title.split(" ");
          const year = parseInt(parts[0]) || new Date().getFullYear();
          const make = parts[1] || "Unknown";
          const model = parts.slice(2).join(" ") || "Unknown";

          listings.push({
            title,
            price,
            mileage,
            year,
            make,
            model,
            bodyType: "Sedan",
            dealerName: "Unknown Dealer",
            dealerLocation: "Unknown",
            url: link.startsWith("http") ? link : `${url}${link}`,
            imageUrl,
          });
        }
      }
    );

    return listings;
  } catch (error) {
    console.error("Scraping error:", error);
    return [];
  }
}
