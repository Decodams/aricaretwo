// Single source of truth for business details.
// Empty values are hidden everywhere they appear. Fill these in before launch.
export type SiteConfig = {
  brandName: string;
  url: string;
  phone: string;
  email: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  };
  hours: string;
  hoursNote: string;
  kidsHours: string;
  serviceArea: string;
};

export const siteConfig: SiteConfig = {
  brandName: "Arizona Development Center LLC",
  url: "https://aricaretwo.vercel.app",
  phone: "",
  email: "",
  address: {
    street: "11001 N 99th Ave",
    locality: "Peoria",
    region: "AZ",
    postalCode: "85345",
    country: "US",
  },
  hours: "DTA program day: 8:00 a.m. to 4:00 p.m.",
  hoursNote: "Contact the center to confirm operating days and holiday hours.",
  kidsHours: "",
  serviceArea: "Peoria and surrounding communities, Arizona",
};

export const addressLine = `${siteConfig.address.street}, ${siteConfig.address.locality}, ${siteConfig.address.region} ${siteConfig.address.postalCode}`;

export const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(addressLine)}`;

export const telHref = (phone: string) =>
  `tel:${phone.replace(/[^+\d]/g, "")}`;
