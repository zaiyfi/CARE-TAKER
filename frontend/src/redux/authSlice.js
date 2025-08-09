import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    auth: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.auth = action.payload;
    },

    setViewedProducts: (state, action) => {
      const productId = action.payload;

      if (state.auth.user && state.auth.user.viewedProducts !== undefined) {
        state.auth = {
          ...state.auth,
          user: {
            ...state.auth.user,
            viewedProducts: [...state.auth.user.viewedProducts, productId],
          },
        };
      } else {
        state.auth = {
          ...state.auth,
          user: {
            ...state.auth.user,
            viewedProducts: [productId],
          },
        };
      }
    },
    setUserPic: (state, action) => {
      const imgUri = action.payload;
      state.auth = {
        ...state.auth,
        user: {
          ...state.auth.user,
          pic: [imgUri],
        },
      };
    },
    setUserCity: (state, action) => {
      const city = action.payload;
      if (state.auth && state.auth.user) {
        state.auth = {
          ...state.auth,
          user: {
            ...state.auth.user,
            city,
          },
        };
      }
    },
    setVerificationInfo: (state, action) => {
      if (state.auth && state.auth.user) {
        state.auth = {
          ...state.auth,
          user: {
            ...state.auth.user,
            verificationInfo: action.payload,
          },
        };
      }
    },
    setUpdatedVerification: (state, action) => {
      if (state.auth?.user?.verificationInfo) {
        state.auth.user.verificationInfo = {
          ...state.auth.user.verificationInfo,
          ...action.payload,
        };
      }
    },
  },
});
export const {
  setUser,
  setViewedProducts,
  setVerificationInfo,
  setUpdatedVerification,
  // setFavProducts,
  // setRemoveFavProducts,
  setUserCity,
  setUserPic,
} = authSlice.actions;

export default authSlice.reducer;
