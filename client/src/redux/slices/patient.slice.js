import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";

export const getNextPatientIdThunk = createAsyncThunk(
  "patient/getPatientId",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/patient/getPatientId");
      return data.patientId || "";
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch patient ID",
      );
    }
  },
);

export const patientRegisterThunk = createAsyncThunk(
  "patient/register",
  async (formValues, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      Object.keys(formValues).forEach((key) => {
        if (formValues[key] !== undefined && formValues[key] !== null) {
          formData.append(key, formValues[key]);
        }
      });

      const { data } = await api.post("/patient/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const patientLoginThunk = createAsyncThunk(
  "patient/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/patient/login", {
        email,
        password,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Login failed");
    }
  },
);

export const patientLogoutThunk = createAsyncThunk(
  "patient/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/patient/logout");
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Logout failed");
    }
  },
);

export const getAllPatientThunk = createAsyncThunk(
  "patient/all",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/patient/all");
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Fetch patients failed",
      );
    }
  },
);

export const profilePatientThunk = createAsyncThunk(
  "patient/me",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/patient/me");
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

export const updatePatientProfileThunk = createAsyncThunk(
  "patient/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/patient/me/update", profileData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

export const changePatientPasswordThunk = createAsyncThunk(
  "patient/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/patient/me/password", passwordData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to change password",
      );
    }
  },
);

const initialState = {
  patient: null,
  patients: [],
  patientId: "",
  loading: false,
  error: null,
  isPatientAuthenticated: false,
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetPatientState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      /* ========= NEXT PATIENT ID ========= */
      .addCase(getNextPatientIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNextPatientIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.patientId = action.payload;
      })
      .addCase(getNextPatientIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ========= REGISTER ========= */
      .addCase(patientRegisterThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patientRegisterThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.patient = action.payload?.patient || action.payload?.data || null;
        // state.isPatientAuthenticated = true;
        state.error = null;
      })
      .addCase(patientRegisterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isPatientAuthenticated = false;
      })

      /* ========= LOGIN ========= */
      .addCase(patientLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patientLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.patient = action.payload?.patient || action.payload?.data || null;
        state.isPatientAuthenticated = true;
        state.error = null;
      })
      .addCase(patientLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isPatientAuthenticated = false;
      })

      /* ========= LOGOUT ========= */
      .addCase(patientLogoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patientLogoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.patient = null;
        state.isPatientAuthenticated = false;
        state.error = null;
      })
      .addCase(patientLogoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ========= GET ALL ========= */
      .addCase(getAllPatientThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPatientThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload?.patients || action.payload || [];
        state.error = null;
      })
      .addCase(getAllPatientThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ========= PROFILE ========= */
      .addCase(profilePatientThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(profilePatientThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.patient = action.payload?.patient || action.payload?.data || null;
        state.isPatientAuthenticated = true;
        state.error = null;
      })
      .addCase(profilePatientThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isPatientAuthenticated = false;
      })

      /* ========= UPDATE PROFILE ========= */
      .addCase(updatePatientProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatientProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.patient = action.payload?.patient || state.patient;
        state.error = null;
      })
      .addCase(updatePatientProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ========= CHANGE PASSWORD ========= */
      .addCase(changePatientPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePatientPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePatientPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetPatientState } = patientSlice.actions;

export default patientSlice.reducer;
