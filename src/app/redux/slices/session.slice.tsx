import store from 'store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authService } from '@/app/services/auth-service';
import { SessionState } from '@/app/utils/interface';

const initialState: SessionState = {
  isUserLoggedIn: store.get(`${process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY}`) ? true : false,
  me: {},
}

export const setLoggedInUser = createAsyncThunk('setLoggedInUser', async () => {
  return await authService.getMe()
})

const sessionSlice = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {
    setAuth: (state, action) => {
      console.log(action.payload);
      
      store.set(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || 'bIESIcg42Wb9', action?.payload?.accessToken)
      state.isUserLoggedIn = true
    },
    setDestroyAuth: (state) => {
      store.clearAll()
      state.isUserLoggedIn = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setLoggedInUser.fulfilled, (state, action) => {
        console.log('actionactionaction',action.payload);
        
        state.me = action.payload
      })
  },
});

export const { setAuth, setDestroyAuth } = sessionSlice.actions;

export default sessionSlice.reducer;

