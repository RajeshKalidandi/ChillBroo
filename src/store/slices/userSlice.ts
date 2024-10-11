import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  credits: number;
}

const initialState: UserState = {
  credits: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredits: (state, action: PayloadAction<number>) => {
      state.credits = action.payload;
    },
  },
});

export const { setCredits } = userSlice.actions;
export default userSlice.reducer;