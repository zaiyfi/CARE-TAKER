import { createSlice } from "@reduxjs/toolkit";

export const gigSlice = createSlice({
  name: "gigs",
  initialState: {
    gigs: [],
  },
  reducers: {
    setGigs: (state, action) => {
      state.gigs = action.payload;
    },
    deleteGig: (state, action) => {
      state.gigs = state.gigs.filter((g) => g._id !== action.payload);
    },
    addGig: (state, action) => {
      state.gigs.push(action.payload);
    },

    // setProductImage: (state, action) => {
    //   const { img_url, productId } = action.payload;
    //   const productIndex = state.products.findIndex((p) => p._id === productId);
    //   if (productIndex !== -1) {
    //     // Product found, update its images
    //     state.products[productIndex].images.push(img_url);
    //   } else {
    //     // Product not found, log an error or add a new product
    //     console.error("Product not found");
    //     // Add new product logic goes here if needed
    //   }
    // },
    setGigReview: (state, action) => {
      const updatedGig = action.payload;
      const gigIndex = state.gigs.findIndex((g) => g._id === updatedGig._id);
      if (gigIndex !== -1) {
        state.gigs[gigIndex].reviews = updatedGig.reviews;
      } else {
        console.error("Gig not found");
      }
    },
    updateGig: (state, action) => {
      const updatedGig = action.payload;
      const gigIndex = state.gigs.findIndex((g) => g._id === updatedGig._id);
      if (gigIndex >= 0) {
        state.gigs[gigIndex] = updatedGig; // Update the name of the product with the given _id
      }
    },
  },
});
export const {
  setGigs,
  deleteGig,
  createProduct,
  setProductImage,
  setGigReview,
  setProductStatus,
  updateGig,
  addGig,
} = gigSlice.actions;
