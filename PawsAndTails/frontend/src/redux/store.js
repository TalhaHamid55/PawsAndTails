import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "../features/authSlice";
import productReducer from "../features/productSlice";
import cartReducer from "../features/cartSlice";
import { authApi } from "../apis/auth";
import { productApi } from "../apis/products";
import { commonApi } from "../apis/common";
import { adoptionApi } from "../apis/adoptions";
import { veterinaryApi } from "../apis/veterinaries";
import { groomingApi } from "../apis/groomings";
import { blogsApi } from "../apis/blogs";
import { ordersApi } from "../apis/orders";
import { appointmentsApi } from "../apis/appointments";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [commonApi.reducerPath]: commonApi.reducer,
    [adoptionApi.reducerPath]: adoptionApi.reducer,
    [veterinaryApi.reducerPath]: veterinaryApi.reducer,
    [groomingApi.reducerPath]: groomingApi.reducer,
    [blogsApi.reducerPath]: blogsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [appointmentsApi.reducerPath]: appointmentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productApi.middleware,
      commonApi.middleware,
      veterinaryApi.middleware,
      adoptionApi.middleware,
      blogsApi.middleware,
      groomingApi.middleware,
      ordersApi.middleware,
      appointmentsApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
