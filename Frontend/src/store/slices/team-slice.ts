import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/constant/api-end-point-constant";
import type { TeamMember, TeamInvite, TeamSettings, TeamRole } from "@/types/team-types";

interface TeamState {
  members: TeamMember[];
  invites: TeamInvite[];
  settings: TeamSettings | null;
  loading: boolean;
  error?: string;
  inviteLoading: boolean;
  inviteError?: string;
}

const initialState: TeamState = {
  members: [],
  invites: [],
  settings: null,
  loading: false,
  inviteLoading: false,
};

// Fetch team members
export const fetchTeamMembers = createAsyncThunk<TeamMember[], void, { rejectValue: string }>(
  "team/fetchMembers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.TEAM_MEMBERS);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to fetch team members");
    }
  }
);

// Invite team member
export const inviteTeamMember = createAsyncThunk<
  TeamInvite,
  { email: string; role: TeamRole; message?: string },
  { rejectValue: string }
>(
  "team/inviteMember",
  async ({ email, role, message }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.TEAM_INVITE, {
        email,
        role,
        message,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to invite member");
    }
  }
);

// Remove team member
export const removeTeamMember = createAsyncThunk<number, number, { rejectValue: string }>(
  "team/removeMember",
  async (memberId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_ENDPOINTS.TEAM_MEMBERS}/${memberId}`);
      return memberId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to remove member");
    }
  }
);

// Update team member role
export const updateMemberRole = createAsyncThunk<
  TeamMember,
  { memberId: number; role: TeamRole },
  { rejectValue: string }
>(
  "team/updateMemberRole",
  async ({ memberId, role }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`${API_ENDPOINTS.TEAM_MEMBERS}/${memberId}`, {
        role,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to update member role");
    }
  }
);

// Fetch team settings
export const fetchTeamSettings = createAsyncThunk<TeamSettings, void, { rejectValue: string }>(
  "team/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.TEAM_SETTINGS);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to fetch team settings");
    }
  }
);

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    clearTeamError: (state) => {
      state.error = undefined;
      state.inviteError = undefined;
    },
    updateMemberStatus: (state, action: PayloadAction<{ memberId: number; status: string }>) => {
      const member = state.members.find(m => m.id === action.payload.memberId);
      if (member) {
        member.status = action.payload.status as any;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch team members
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Invite team member
      .addCase(inviteTeamMember.pending, (state) => {
        state.inviteLoading = true;
        state.inviteError = undefined;
      })
      .addCase(inviteTeamMember.fulfilled, (state, action) => {
        state.inviteLoading = false;
        state.invites.push(action.payload);
      })
      .addCase(inviteTeamMember.rejected, (state, action) => {
        state.inviteLoading = false;
        state.inviteError = action.payload;
      })
      // Remove team member
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        state.members = state.members.filter(member => member.id !== action.payload);
      })
      // Update member role
      .addCase(updateMemberRole.fulfilled, (state, action) => {
        const index = state.members.findIndex(member => member.id === action.payload.id);
        if (index !== -1) {
          state.members[index] = action.payload;
        }
      })
      // Fetch team settings
      .addCase(fetchTeamSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      });
  },
});

export const { clearTeamError, updateMemberStatus } = teamSlice.actions;
export default teamSlice.reducer; 