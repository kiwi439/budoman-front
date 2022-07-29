import { createReducer } from '@reduxjs/toolkit';
import { loadProducts } from './actionsCreator.js';

const initialState = { list: [] };

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadProducts, (state, { payload }) => {
      state.list = payload;
    });
});

export default reducer;