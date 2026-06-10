import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  current: 'english' | 'hindi';
}

const initialState: LanguageState = {
  current: 'english',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'english' | 'hindi'>) => {
      state.current = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;