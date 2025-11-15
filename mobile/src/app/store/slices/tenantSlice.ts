import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TenantBranding {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl?: string;
}

interface Tenant {
  id: string;
  slug: string;
  businessName: string;
  description?: string;
  logoUrl?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  averageRating?: number;
  distance?: number;
  isOpen?: boolean;
}

interface TenantState {
  currentTenant: Tenant | null;
  nearbyTenants: Tenant[];
  branding: TenantBranding | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  currentTenant: null,
  nearbyTenants: [],
  branding: null,
  isLoading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setCurrentTenant: (state, action: PayloadAction<Tenant>) => {
      state.currentTenant = action.payload;
    },

    setBranding: (state, action: PayloadAction<TenantBranding>) => {
      state.branding = action.payload;
    },

    setNearbyTenants: (state, action: PayloadAction<Tenant[]>) => {
      state.nearbyTenants = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearCurrentTenant: (state) => {
      state.currentTenant = null;
      state.branding = null;
    },
  },
});

export const {
  setCurrentTenant,
  setBranding,
  setNearbyTenants,
  setLoading,
  setError,
  clearCurrentTenant,
} = tenantSlice.actions;

export default tenantSlice.reducer;
