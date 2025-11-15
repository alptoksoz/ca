import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItemCustomization {
  group: string;
  option: string;
  price: number;
}

interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  imageUrl?: string;
  basePrice: number;
  quantity: number;
  customizations: CartItemCustomization[];
  specialInstructions?: string;
  totalPrice: number;
}

interface Tenant {
  id: string;
  slug: string;
  businessName: string;
  logoUrl?: string;
}

interface CartState {
  tenant: Tenant | null;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  loyaltyPointsToUse: number;
  promotionCode: string | null;
}

const initialState: CartState = {
  tenant: null,
  items: [],
  subtotal: 0,
  tax: 0,
  discount: 0,
  total: 0,
  loyaltyPointsToUse: 0,
  promotionCode: null,
};

const calculateTotals = (state: CartState) => {
  state.subtotal = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
  state.total = state.subtotal + state.tax - state.discount;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setTenant: (state, action: PayloadAction<Tenant>) => {
      // If changing tenant, clear cart
      if (state.tenant && state.tenant.id !== action.payload.id) {
        state.items = [];
      }
      state.tenant = action.payload;
      calculateTotals(state);
    },

    addItem: (state, action: PayloadAction<Omit<CartItem, 'id'>>) => {
      const newItem: CartItem = {
        ...action.payload,
        id: `${action.payload.menuItemId}-${Date.now()}`,
      };
      state.items.push(newItem);
      calculateTotals(state);
    },

    updateItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        item.totalPrice =
          (item.basePrice +
            item.customizations.reduce((sum, c) => sum + c.price, 0)) *
          item.quantity;
      }
      calculateTotals(state);
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      calculateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.tax = 0;
      state.discount = 0;
      state.total = 0;
      state.loyaltyPointsToUse = 0;
      state.promotionCode = null;
    },

    applyLoyaltyPoints: (state, action: PayloadAction<number>) => {
      state.loyaltyPointsToUse = action.payload;
      state.discount = action.payload / 10; // 100 points = 10 TRY
      calculateTotals(state);
    },

    applyPromotionCode: (state, action: PayloadAction<string>) => {
      state.promotionCode = action.payload;
      // Discount calculation would be done by backend
    },
  },
});

export const {
  setTenant,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  applyLoyaltyPoints,
  applyPromotionCode,
} = cartSlice.actions;

export default cartSlice.reducer;
