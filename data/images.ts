// Every image slot is swappable here. Replace `src` with a consented photograph
// when real photography is available and update `alt` to describe the new image.
// Keep the representative caption until a photographed image is approved.
export type ImageSlot = {
  src: string;
  alt: string;
  caption?: string;
};

export const images: Record<string, ImageSlot> = {
  hero: {
    src: "/images/dtt-circle-time.jpg",
    alt: "Representative image of children taking part in a group learning activity",
    caption: "Representative image",
  },
  dta: {
    src: "/images/adult_care.jpg",
    alt: "Representative image of adults taking part in a group activity",
    caption: "Representative image",
  },
  dtt: {
    src: "/images/dtt-circle-time.jpg",
    alt: "Representative image of children and a teacher taking part in a group activity",
    caption: "Representative image",
  },
  mission: {
    src: "/images/adult_care.jpg",
    alt: "Representative image of adults taking part in a group arts activity",
    caption: "Representative image",
  },
};
