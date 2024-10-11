import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  credits: number;
  plan: 'freemium' | 'basic' | 'pro';
}

const initialState: UserState = {
  credits: 0,
  plan: 'freemium',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredits: (state, action: PayloadAction<number>) => {
      state.credits = action.payload;
    },
    setPlan: (state, action: PayloadAction<'freemium' | 'basic' | 'pro'>) => {
      state.plan = action.payload;
    },
  },
});

export const { setCredits, setPlan } = userSlice.actions;
export default userSlice.reducer;