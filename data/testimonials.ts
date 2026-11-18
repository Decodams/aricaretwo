// Every entry requires written consent from the family and must be anonymized.
// First names only. No last names, no photos, no placeholder avatars.
// Location details are intentionally omitted to protect privacy.
export type Testimonial = {
  quote: string;
  firstName: string;
  relationship: string;
  program?: string;
};

export const testimonials: Testimonial[] = [
  {
    firstName: "Maria",
    relationship: "Parent",
    quote:
      "I was honestly overwhelmed when we started looking for a day program for my son. A lot of places felt cold or too clinical. From the very first call, these people treated him like a real person. They asked questions about what he likes, what makes him anxious, and what a good day looks like for him. He’s more confident now with simple daily routines, and he actually looks forward to going. That alone has taken so much weight off our shoulders.",
  },
  {
    firstName: "James",
    relationship: "Guardian",
    program: "DTA",
    quote:
      "My brother has developmental disabilities, and finding a place that treats him with real dignity has always been hard. The adult program here has been different. The staff are patient and consistent, and they never talk down to him. We’ve noticed he’s more comfortable around other people and is slowly picking up skills that help him feel more independent. It’s not dramatic overnight change. Just steady, respectful progress, which is exactly what we needed.",
  },
  {
    firstName: "Aisha",
    relationship: "Mother",
    quote:
      "My daughter used to struggle with new environments and group settings. I was nervous about putting her in a day program, but the team took time to understand her. They didn’t rush her or force activities she wasn’t ready for. Over the months, she’s become more willing to participate, communicates a little better, and seems happier. They also keep me updated in a way that feels genuine, not like they’re just checking boxes. It’s made a real difference for both of us.",
  },
  {
    firstName: "Robert and Linda",
    relationship: "Parents",
    quote:
      "We spent a long time searching for the right support for our son. Many programs felt either too rigid or not structured enough. What stood out here is how carefully they listen. They asked about his preferences, his triggers, and what success actually means to our family. He’s building small skills and seems more settled during the day. For the first time in a while, we feel like we’re not navigating this alone.",
  },
  {
    firstName: "Tanya",
    relationship: "Aunt and caregiver",
    quote:
      "I’ve been helping care for my nephew for years, and finding reliable daytime support has always been stressful. This program has given us some real breathing room. The environment feels calm and supportive, and the staff seem to genuinely care about the people they’re working with. He’s made a couple of friends and is practicing skills that actually show up at home. It’s not perfect every day, but it’s consistent, and that consistency has helped our whole family.",
  },
  {
    firstName: "Daniel",
    relationship: "Father",
    quote:
      "What I appreciate most is the respect. A lot of places talk about person-centered care, but it often feels like empty words. Here, they actually take the time to learn who my son is. They don’t push him too hard or treat him like a checklist. Progress is measured in small, meaningful ways, and those small wins matter. It’s given us more peace of mind during the day, and that’s something we hadn’t felt in a long time.",
  },
];
