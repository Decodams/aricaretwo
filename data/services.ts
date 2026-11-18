// One array drives the homepage card grid, the /services hub and the two
// detailed program pages. Add one object here to add a program later.
export type Service = {
  id: string;
  slug: string;
  number: string;
  title: string;
  audience: string;
  short: string;
  detail: string;
  activities: string[];
  progress: string;
  image: string;
  alt: string;
  metaTitle: string;
  metaDescription: string;
};

export const services: Service[] = [
  {
    id: "dta",
    slug: "dta",
    number: "01",
    title: "Day Treatment and Training – Adult (DTA)",
    audience: "For adults with developmental disabilities",
    short:
      "A welcoming, structured day focused on life skills, relationships, and participation at a pace that respects each person.",
    detail:
      "Day Treatment and Training for Adults offers a structured setting with life-skills practice, chair yoga and stretching, arts and food crafts, music, trivia and puzzles, social events, and community participation. Activities support skill-building and independence.",
    activities: [
      "Life skills development and everyday routines",
      "Social connection, movement, and creative activities",
      "Opportunities for community participation",
    ],
    progress:
      "Progress can be discussed around the person’s goals, participation, and skills practiced. Ask the team how updates are shared with individuals and families.",
    image: "dta",
    alt: "Representative image of adults taking part in a group activity",
    metaTitle: "Day Treatment and Training for Adults (DTA)",
    metaDescription:
      "Learn about Day Treatment and Training for Adults (DTA) at Arizona Development Center in Peoria, Arizona, including activities, a typical day, and how progress is discussed.",
  },
  {
    id: "dtt",
    slug: "dtt",
    number: "02",
    title: "Day Treatment and Training – Kids (DTT)",
    audience: "For children and youth with developmental disabilities",
    short:
      "Age-appropriate activities that encourage communication, confidence, learning, and meaningful connection with others.",
    detail:
      "Day Treatment and Training for Children and Youth includes age-appropriate learning, sensory-motor, cognitive, social, and independence-building activities. Ask the center about program fit and current availability.",
    activities: [
      "Communication, social, and learning activities",
      "Sensory-motor and age-appropriate skill-building",
      "Practice with routines, choice-making, and participation",
    ],
    progress:
      "Progress is personal. Ask how the team learns what matters to your child and how participation and emerging skills are communicated to families.",
    image: "dtt",
    alt: "Representative image of children and a teacher taking part in a group activity",
    metaTitle: "Day Treatment and Training for Kids and Youth (DTT)",
    metaDescription:
      "Learn about Day Treatment and Training for Kids and Youth (DTT) at Arizona Development Center in Peoria, Arizona, including activities and how progress is discussed.",
  },
];

export const getService = (slug?: string) =>
  services.find((service) => service.slug === slug);
