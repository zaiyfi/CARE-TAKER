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
    setFavProducts: (state, action) => {
      if (
        state.auth &&
        state.auth.user &&
        state.auth.user.viewedProducts !== undefined
      ) {
        state.auth = {
          ...state.auth,
          user: {
            ...state.auth.user,
            favProducts: [...state.auth.user.favProducts, action.payload],
          },
        };
      } else {
        state.auth = {
          ...state.auth,
          user: {
            ...state.auth.user,
            favProducts: [action.payload],
          },
        };
      }
    },

    setRemoveFavProducts: (state, action) => {
      const updatedFavProducts = state.auth.user.favProducts.filter(
        (productId) => productId !== action.payload
      );
      state.auth = {
        ...state.auth,
        user: {
          ...state.auth.user,
          favProducts: updatedFavProducts,
        },
      };
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
  },
});
export const {
  setUser,
  setViewedProducts,
  setFavProducts,
  setRemoveFavProducts,
  setUserPic,
} = authSlice.actions;

export default authSlice.reducer;
