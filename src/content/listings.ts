import type { StaticImageData } from "next/image";

import { listingCopy, type ListingCopy } from "@/content/listing-copy";

import artconnectCover from "@/assets/images/listings/artconnect/cover.webp";
import artconnect01 from "@/assets/images/listings/artconnect/01.webp";
import artconnect02 from "@/assets/images/listings/artconnect/02.webp";
import artconnect03 from "@/assets/images/listings/artconnect/03.webp";
import artconnect04 from "@/assets/images/listings/artconnect/04.webp";
import marketivCover from "@/assets/images/listings/marketiv/cover.webp";
import marketiv01 from "@/assets/images/listings/marketiv/01.webp";
import marketiv02 from "@/assets/images/listings/marketiv/02.webp";
import marketiv03 from "@/assets/images/listings/marketiv/03.webp";
import marketiv04 from "@/assets/images/listings/marketiv/04.webp";
import bookmateCover from "@/assets/images/listings/bookmate/cover.webp";
import bookmate01 from "@/assets/images/listings/bookmate/01.webp";
import bookmate02 from "@/assets/images/listings/bookmate/02.webp";
import bookmate03 from "@/assets/images/listings/bookmate/03.webp";
import bookmate04 from "@/assets/images/listings/bookmate/04.webp";
import clinicCover from "@/assets/images/listings/clinic-information-system/cover.webp";
import clinic01 from "@/assets/images/listings/clinic-information-system/01.webp";
import clinic02 from "@/assets/images/listings/clinic-information-system/02.webp";
import clinic03 from "@/assets/images/listings/clinic-information-system/03.webp";
import clinic04 from "@/assets/images/listings/clinic-information-system/04.webp";
import inztamotoCover from "@/assets/images/listings/inztamoto-erp/cover.webp";
import inztamoto01 from "@/assets/images/listings/inztamoto-erp/01.webp";
import inztamoto02 from "@/assets/images/listings/inztamoto-erp/02.webp";
import inztamoto03 from "@/assets/images/listings/inztamoto-erp/03.webp";
import inztamoto04 from "@/assets/images/listings/inztamoto-erp/04.webp";
import visualkainCover from "@/assets/images/listings/visualkain-finance/cover.webp";
import visualkain01 from "@/assets/images/listings/visualkain-finance/01.webp";
import visualkain02 from "@/assets/images/listings/visualkain-finance/02.webp";
import visualkain03 from "@/assets/images/listings/visualkain-finance/03.webp";
import visualkain04 from "@/assets/images/listings/visualkain-finance/04.webp";
import wellingCover from "@/assets/images/listings/welling/cover.webp";
import welling01 from "@/assets/images/listings/welling/01.webp";
import welling02 from "@/assets/images/listings/welling/02.webp";
import welling03 from "@/assets/images/listings/welling/03.webp";
import welling04 from "@/assets/images/listings/welling/04.webp";
import webgisCover from "@/assets/images/listings/webgis-gunung-puyuh/cover.webp";
import webgis01 from "@/assets/images/listings/webgis-gunung-puyuh/01.webp";
import webgis02 from "@/assets/images/listings/webgis-gunung-puyuh/02.webp";
import webgis03 from "@/assets/images/listings/webgis-gunung-puyuh/03.webp";
import webgis04 from "@/assets/images/listings/webgis-gunung-puyuh/04.webp";

export type ListingSlide = { src: StaticImageData; alt: string };
export type Listing = ListingCopy & { cover: StaticImageData; slides: ListingSlide[] };

const images: Record<string, { cover: StaticImageData; slides: StaticImageData[] }> = {
  "clinic-information-system": { cover: clinicCover, slides: [clinic01, clinic02, clinic03, clinic04] },
  "visualkain-finance": { cover: visualkainCover, slides: [visualkain01, visualkain02, visualkain03, visualkain04] },
  "inztamoto-erp": { cover: inztamotoCover, slides: [inztamoto01, inztamoto02, inztamoto03, inztamoto04] },
  artconnect: { cover: artconnectCover, slides: [artconnect01, artconnect02, artconnect03, artconnect04] },
  "webgis-gunung-puyuh": { cover: webgisCover, slides: [webgis01, webgis02, webgis03, webgis04] },
  welling: { cover: wellingCover, slides: [welling01, welling02, welling03, welling04] },
  bookmate: { cover: bookmateCover, slides: [bookmate01, bookmate02, bookmate03, bookmate04] },
  marketiv: { cover: marketivCover, slides: [marketiv01, marketiv02, marketiv03, marketiv04] },
};

export const listings: Partial<Record<string, Listing>> = Object.fromEntries(
  Object.entries(images).map(([slug, set]) => {
    const copy = listingCopy[slug];
    return [slug, { ...copy, cover: set.cover, slides: set.slides.map((src, index) => ({ src, alt: copy.captions[index] })) }];
  }),
);
