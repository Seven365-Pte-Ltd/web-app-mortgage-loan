import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

interface DashboardData {
  count: number;
  growthRate: number;
}

interface DashboardState {
  data: Record<string, DashboardData>;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
  DashboardPeriod: number;
}

const initialState: DashboardState = {
  data: {},
  loading: 'idle',
  error: null,
  DashboardPeriod: 0,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (endpoint: string, { getState }) => {
    const { dashboard } = getState() as RootState;
    const DashboardPeriod = dashboard.DashboardPeriod;

    const response = await axios.get(
      `/dashboard/numberOf${endpoint}?DashboardPeriod=${DashboardPeriod}`
    );
    return { endpoint, data: response.data };
  }
);
  
  const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
      setDashboardPeriod(state, action: PayloadAction<number>) {
        state.DashboardPeriod = action.payload;
      }
    }, 
    extraReducers: (builder) => {
      builder
        .addCase(fetchDashboardData.pending, (state) => {
          state.loading = 'pending';
        })
        .addCase(fetchDashboardData.fulfilled, (state, action) => {
          state.loading = 'succeeded';
          state.data[action.payload.endpoint] = action.payload.data;
        })
        .addCase(fetchDashboardData.rejected, (state, action) => {
          state.loading = 'failed';
          state.error = action.error.message || 'Something went wrong';
        });
    },
  });

  export const { setDashboardPeriod } = dashboardSlice.actions;
  export default dashboardSlice.reducer;