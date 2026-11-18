// Add a team member only with their consent. No stock photos, no invented roles.
// The "Who supports each program" section is hidden while this array is empty.
export type StaffMember = {
  name: string;
  role: string;
  program?: string;
  bio?: string;
};

export const staff: StaffMember[] = [];
