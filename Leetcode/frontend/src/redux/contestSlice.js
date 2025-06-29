import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for contest operations
export const fetchContests = createAsyncThunk(
  'contests/fetchContests',
  async () => {
    const response = await fetch('/contests');
    if (!response.ok) throw new Error('Failed to fetch contests');
    return response.json();
  }
);

export const registerForContest = createAsyncThunk(
  'contests/register',
  async (contestId) => {
    const response = await fetch(`/contests/${contestId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to register for contest');
    return response.json();
  }
);

export const submitContestProblem = createAsyncThunk(
  'contests/submitProblem',
  async ({ contestId, problemId, solution, language }) => {
    const response = await fetch(`/contests/${contestId}/problems/${problemId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ solution, language }),
    });
    if (!response.ok) throw new Error('Failed to submit solution');
    return response.json();
  }
);

const contestSlice = createSlice({
  name: 'contests',
  initialState: {
    contests: [],
    activeContest: null,
    loading: false,
    error: null,
    registrationStatus: {},
    submissions: {},
  },
  reducers: {
    setActiveContest: (state, action) => {
      state.activeContest = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch contests
      .addCase(fetchContests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContests.fulfilled, (state, action) => {
        state.loading = false;
        state.contests = action.payload;
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Register for contest
      .addCase(registerForContest.pending, (state, action) => {
        state.registrationStatus[action.meta.arg] = 'pending';
      })
      .addCase(registerForContest.fulfilled, (state, action) => {
        state.registrationStatus[action.meta.arg] = 'succeeded';
        const contestIndex = state.contests.findIndex(c => c._id === action.meta.arg);
        if (contestIndex !== -1) {
          state.contests[contestIndex].isRegistered = true;
        }
      })
      .addCase(registerForContest.rejected, (state, action) => {
        state.registrationStatus[action.meta.arg] = 'failed';
        state.error = action.error.message;
      })
      // Submit contest problem
      .addCase(submitContestProblem.pending, (state, action) => {
        const { contestId, problemId } = action.meta.arg;
        if (!state.submissions[contestId]) {
          state.submissions[contestId] = {};
        }
        state.submissions[contestId][problemId] = {
          status: 'pending',
          result: null,
        };
      })
      .addCase(submitContestProblem.fulfilled, (state, action) => {
        const { contestId, problemId } = action.meta.arg;
        state.submissions[contestId][problemId] = {
          status: 'succeeded',
          result: action.payload,
        };
      })
      .addCase(submitContestProblem.rejected, (state, action) => {
        const { contestId, problemId } = action.meta.arg;
        state.submissions[contestId][problemId] = {
          status: 'failed',
          error: action.error.message,
        };
      });
  },
});

export const { setActiveContest, clearError } = contestSlice.actions;
export default contestSlice.reducer;