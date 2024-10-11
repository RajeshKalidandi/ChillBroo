import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ContentState {
  generatedContent: any[];
  lastVisible: any;
  hasMore: boolean;
}

const initialState: ContentState = {
  generatedContent: [],
  lastVisible: null,
  hasMore: true,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setGeneratedContent: (state, action: PayloadAction<any[]>) => {
      state.generatedContent = action.payload;
    },
    appendGeneratedContent: (state, action: PayloadAction<any[]>) => {
      state.generatedContent = [...state.generatedContent, ...action.payload];
    },
    setLastVisible: (state, action: PayloadAction<any>) => {
      state.lastVisible = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
  },
});

export const { setGeneratedContent, appendGeneratedContent, setLastVisible, setHasMore } = contentSlice.actions;
export default contentSlice.reducer;