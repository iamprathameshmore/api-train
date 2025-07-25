// store/slices/api-slice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axios-instance";

export interface ApiItem {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface ApiState {
  apis: ApiItem[];
  loading: boolean;
  error?: string;
}

const initialState: ApiState = {
  apis: [],
  loading: false,
};

// thunk
export const fetchApis = createAsyncThunk("apis/fetch", async () => {
  const res = await axiosInstance.get<ApiItem[]>("/apis");
  return res.data;
});

const apiSlice = createSlice({
  name: "apis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApis.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApis.fulfilled, (state, action) => {
        state.loading = false;
        state.apis = action.payload;
      })
      .addCase(fetchApis.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load APIs";
      });
  },
});

export default apiSlice.reducer;
