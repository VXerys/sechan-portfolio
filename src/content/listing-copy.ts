// Captions double as alt text, so they live apart from the image imports and stay testable under `node --test`.
export type ListingCopy = {
  coverAlt: string;
  label: string | null;
  sampleData: boolean;
  captions: string[];
};

export const listingCopy: Record<string, ListingCopy> = {
  "clinic-information-system": {
    coverAlt: "Klinik Cikidang Medika owner dashboard with visits, income, BPJS capitation and cash balance, using sample data",
    label: null,
    sampleData: true,
    captions: [
      "Keep the cash book and drawer balance in step every day",
      "Register patients, run the queue and take payment at one desk",
      "Call each patient from the queue with allergies flagged up front",
      "Export visit, morbidity and cash reports for any period",
    ],
  },
  "visualkain-finance": {
    coverAlt: "VisualKain finance summary with cash in, cash out, receivables, vendor debt and margins, using sample data",
    label: null,
    sampleData: true,
    captions: [
      "Track every customer payment against the 70% down payment rule",
      "See vendor payments, order costs and overheads in one outflow view",
      "Compare vendor HPP with the profit VisualKain keeps per partner",
      "Price a new order from fabric cost and quantity markup",
    ],
  },
  "inztamoto-erp": {
    coverAlt: "InztaMoto ERP dashboard with monthly production, sales, HPP, profit and stock alerts, using sample data",
    label: null,
    sampleData: true,
    captions: [
      "Log sales from Shopee, Tokopedia, resellers and the shop in one list",
      "Track stock in and out per product, with low and empty stock flagged",
      "Follow every production batch from pending to quality control",
      "Turn sales, materials and wages into a monthly profit report",
    ],
  },
  artconnect: {
    coverAlt: "ArtConnect pipeline board moving artworks from concept to sold, using sample data",
    label: null,
    sampleData: true,
    captions: [
      "Introduce the workspace to artists before they sign in",
      "Drag each artwork from concept to sold on one board",
      "Browse the whole inventory with medium, size and price",
      "Track monthly sales and how the collection is moving",
    ],
  },
  "webgis-gunung-puyuh": {
    coverAlt: "Gunung Puyuh WebGIS map with 250 and 500 metre rings around schools and health facilities",
    label: null,
    sampleData: false,
    captions: [
      "Read the background, goals and benefits of the study before opening the map",
      "Check if a spot has schools or clinics within 250 and 500 metres",
      "Switch school and health layers on and off to compare coverage",
      "Open any school to see its name and photo on the map",
    ],
  },
  bookmate: {
    coverAlt: "BookMate home screen with the current book, recent reading activity and book categories",
    label: "Full-stack",
    sampleData: true,
    captions: [
      "Resume the current book and see recent reading from the home screen",
      "Log pages, percent or chapters with a note and share it to a community",
      "Approve or decline borrow requests from other readers",
      "Run a private community with its members and shared book collection",
    ],
  },
};

// Client projects say why their screens are shown; own projects only need the sample-data note.
export function listingNotice(copy: ListingCopy, isClientWork: boolean): string | null {
  if (!copy.sampleData) return null;
  return isClientWork ? "Screens use sample data; the project is shown with the client's approval." : "Screens use sample data.";
}
