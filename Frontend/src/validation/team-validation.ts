import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.enum(["admin", "developer", "viewer", "tester"], {
    required_error: "Please select a role",
  }),
  message: z.string().optional(),
});

export const editMemberSchema = z.object({
  role: z.enum(["admin", "developer", "viewer", "tester"], {
    required_error: "Please select a role",
  }),
  permissions: z.array(z.enum(["Read", "Write", "Delete", "Manage Team", "Billing Access", "Deploy", "Monitor"])),
});

export const teamSettingsSchema = z.object({
  allowMemberInvites: z.boolean(),
  requireApproval: z.boolean(),
  maxTeamSize: z.number().min(1).max(100),
  defaultRole: z.enum(["admin", "developer", "viewer", "tester"]),
});

export type InviteMemberData = z.infer<typeof inviteMemberSchema>;
export type EditMemberData = z.infer<typeof editMemberSchema>;
export type TeamSettingsData = z.infer<typeof teamSettingsSchema>; 