export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: TeamRole;
  status: TeamMemberStatus;
  date: string;
  avatarUrl?: string;
  permissions: Permission[];
}

export type TeamRole = 'Admin' | 'Developer' | 'Viewer' | 'Tester';

export type TeamMemberStatus = 'Active' | 'Pending' | 'Inactive';

export type Permission = 'Read' | 'Write' | 'Delete' | 'Manage Team' | 'Billing Access' | 'Deploy' | 'Monitor';

export interface TeamRoleConfig {
  value: string;
  label: string;
  description: string;
  permissions: Permission[];
}

export interface TeamInvite {
  email: string;
  role: TeamRole;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: 'Pending' | 'Accepted' | 'Expired';
}

export interface TeamSettings {
  allowMemberInvites: boolean;
  requireApproval: boolean;
  maxTeamSize: number;
  defaultRole: TeamRole;
} 