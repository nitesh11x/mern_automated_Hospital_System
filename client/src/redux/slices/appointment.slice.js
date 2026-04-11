import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/axios";

export const bookAppointment = createAsyncThunk(
  "appointment/book",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/appointment/book", appointmentData);
      return data?.appointment || data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Booking failed",
      );
    }
  },
);

export const getAllAppointments = createAsyncThunk(
  "appointment/all",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/appointment/all");
      return data?.appointments || data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch appointments",
      );
    }
  },
);

export const getPatientAppointments = createAsyncThunk(
  "appointment/me",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/appointment/me");
      return data?.appointments || data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch patient appointments",
      );
    }
  },
);

export const getDoctorAppointments = createAsyncThunk(
  "appointment/doctor/appointments",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/appointment/doctor/appointments");
      return data?.appointments || data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch doctor appointments",
      );
    }
  },
);

export const updateAppointmentPaymentStatus = createAsyncThunk(
  "appointment/status/payment/update",
  async ({ id, paymentStatus }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/appointment/status/payment/${id}`, {
        paymentStatus,
      });
      return data?.appointment || data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update payment status",
      );
    }
  },
);

export const updateAppointmentStatus = createAsyncThunk(
  "appointment/status/update",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/appointment/status/${id}`, { status });
      return data?.appointment || data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update appointment status",
      );
    }
  },
);

export const reScheduelAppointmentByIdThunk = createAsyncThunk(
  "appointment/rescheduel/appointmentId",
  async (
    { appointmentId, appointmentDate, approvedTimeSlot },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.put(
        `/appointment/rescheduel/${appointmentId}`,
        { appointmentDate, approvedTimeSlot },
      );
      return data.appointment;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to reschedule appointment",
      );
    }
  },
);

export const generateAppointmentQRThunk = createAsyncThunk(
  "appointment/generateQR",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/appointment/qr/${appointmentId}`);
      return data.qr;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Server failed to generate QR",
      );
    }
  },
);

export const deleteAppointmentByIdThunk = createAsyncThunk(
  "appointment/delete",
  async (appointmentId, { rejectWithValue }) => {
    try {
      await api.delete(`/appointment/delete/${appointmentId}`);
      return appointmentId;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Delete failed");
    }
  },
);

export const getAvailableSlotsThunk = createAsyncThunk(
  "appointment/getAvailableSlots",
  async ({ doctorId, date }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/appointment/${doctorId}/slots?date=${date}`,
      );
      return data.availableSlots;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch slots",
      );
    }
  },
);

export const cancelAppointmentThunk = createAsyncThunk(
  "appointment/cancel",
  async ({ appointmentId, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/appointment/cancel/${appointmentId}`, {
        status,
      });
      return data?.appointment || data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to Cancel appointment",
      );
    }
  },
);

export const getPreviousAppointmentByEmailThunk = createAsyncThunk(
  "appointment/previous",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/appointment/previous", {
        params: { email },
      });
      return data.prevAppointments;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch appointments",
      );
    }
  },
);

export const getAppointmentById = createAsyncThunk(
  "appointment/appointmentId",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/appointment/${appointmentId}`);
      // Return the appointment object directly
      return data?.appointment || data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch patient appointments",
      );
    }
  },
);
export const bookAppointmentByAdminThunk = createAsyncThunk(
  "appointment/bookByAdmin",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/appointment/admin/book", 
        appointmentData,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to book appointment",
        console.log(error)
      );
    }
  },
);

const initialState = {
  appointments: [],
  patientAppointments: null,
  availableSlots: null,
  slotsLoading: false,
  loading: false,
  error: null,
  bookingSuccess: false,
  previousAppointments: [],
  qrCode: null,
  appointmentsMap: {}, 
  currentAppointment: null,
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    resetBookingState: (state) => {
      state.bookingSuccess = false;
      state.error = null;
    },
    clearAppointmentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= Book Appointment
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.bookingSuccess = false;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingSuccess = true;
        state.appointments = [...state.appointments, action.payload];
        if (action.payload?._id) {
          state.appointmentsMap[action.payload._id] = action.payload;
        }
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.bookingSuccess = false;
      })
      // ================= FETCH
      .addCase(getAllAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        if (Array.isArray(action.payload)) {
          action.payload.forEach((appt) => {
            if (appt?._id) {
              state.appointmentsMap[appt._id] = appt;
            }
          });
        }
      })
      .addCase(getAllAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ================= PATIENT APPOINTMENTS
      .addCase(getPatientAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatientAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.patientAppointments = action.payload;
        if (Array.isArray(action.payload)) {
          action.payload.forEach((appt) => {
            if (appt?._id) {
              state.appointmentsMap[appt._id] = appt;
            }
          });
        }
      })
      .addCase(getPatientAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ================= DOCTOR APPOINTMENTS
      .addCase(getDoctorAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        if (Array.isArray(action.payload)) {
          action.payload.forEach((appt) => {
            if (appt?._id) {
              state.appointmentsMap[appt._id] = appt;
            }
          });
        }
      })
      .addCase(getDoctorAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ================= UPDATE STATUS
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const updatedAppointment = action.payload;
        if (updatedAppointment?._id) {
          state.appointmentsMap[updatedAppointment._id] = updatedAppointment;
          state.appointments = state.appointments.map((appt) =>
            appt._id === updatedAppointment._id ? updatedAppointment : appt,
          );
          if (
            state.patientAppointments &&
            Array.isArray(state.patientAppointments)
          ) {
            state.patientAppointments = state.patientAppointments.map((appt) =>
              appt._id === updatedAppointment._id ? updatedAppointment : appt,
            );
          }
        }
      })
      // ================= UPDATE Payment Status
      .addCase(updateAppointmentPaymentStatus.fulfilled, (state, action) => {
        const updatedAppointment = action.payload;
        if (updatedAppointment?._id) {
          state.appointmentsMap[updatedAppointment._id] = updatedAppointment;
          state.appointments = state.appointments.map((appt) =>
            appt._id === updatedAppointment._id ? updatedAppointment : appt,
          );
          if (
            state.patientAppointments &&
            Array.isArray(state.patientAppointments)
          ) {
            state.patientAppointments = state.patientAppointments.map((appt) =>
              appt._id === updatedAppointment._id ? updatedAppointment : appt,
            );
          }
        }
      })
      // ================= reschedule appointment
      .addCase(reScheduelAppointmentByIdThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated?._id) {
          state.appointmentsMap[updated._id] = updated;
          const index = state.appointments.findIndex(
            (app) => app._id === updated._id,
          );
          if (index !== -1) {
            state.appointments[index] = updated;
          }
          if (
            state.patientAppointments &&
            Array.isArray(state.patientAppointments)
          ) {
            const patientIndex = state.patientAppointments.findIndex(
              (app) => app._id === updated._id,
            );
            if (patientIndex !== -1) {
              state.patientAppointments[patientIndex] = updated;
            }
          }
        }
      })
      // qr code
      .addCase(generateAppointmentQRThunk.fulfilled, (state, action) => {
        state.qrCode = action.payload;
      })
      // delete appointment
      .addCase(deleteAppointmentByIdThunk.fulfilled, (state, action) => {
        const deletedId = action.payload;
        delete state.appointmentsMap[deletedId];
        state.appointments = state.appointments.filter(
          (app) => app._id !== deletedId,
        );
        if (
          state.patientAppointments &&
          Array.isArray(state.patientAppointments)
        ) {
          state.patientAppointments = state.patientAppointments.filter(
            (app) => app._id !== deletedId,
          );
        }
      })
      // Fetch available slots
      .addCase(getAvailableSlotsThunk.pending, (state) => {
        state.slotsLoading = true;
        state.error = null;
      })
      .addCase(getAvailableSlotsThunk.fulfilled, (state, action) => {
        state.slotsLoading = false;
        state.availableSlots = action.payload;
      })
      .addCase(getAvailableSlotsThunk.rejected, (state, action) => {
        state.slotsLoading = false;
        state.error = action.payload;
        state.availableSlots = null;
      })
      // cancel
      .addCase(cancelAppointmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAppointmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        const cancelledAppointment = action.payload;
        if (cancelledAppointment?._id) {
          state.appointmentsMap[cancelledAppointment._id] =
            cancelledAppointment;
          state.appointments = state.appointments.map((appt) =>
            appt._id === cancelledAppointment._id ? cancelledAppointment : appt,
          );
          if (
            state.patientAppointments &&
            Array.isArray(state.patientAppointments)
          ) {
            state.patientAppointments = state.patientAppointments.map((appt) =>
              appt._id === cancelledAppointment._id
                ? cancelledAppointment
                : appt,
            );
          }
        }
      })
      .addCase(cancelAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // previous appointment by email
      .addCase(getPreviousAppointmentByEmailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getPreviousAppointmentByEmailThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.previousAppointments = action.payload;
          if (Array.isArray(action.payload)) {
            action.payload.forEach((appt) => {
              if (appt?._id) {
                state.appointmentsMap[appt._id] = appt;
              }
            });
          }
        },
      )
      .addCase(getPreviousAppointmentByEmailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get appointment by id - FIXED: Store in map
      .addCase(getAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        const appointment = action.payload;
        if (appointment?._id) {
          // Store in map for easy access
          state.appointmentsMap[appointment._id] = appointment;
          state.currentAppointment = appointment;
        }
      })
      .addCase(getAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // book by admin
      .addCase(bookAppointmentByAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(bookAppointmentByAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(bookAppointmentByAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetBookingState, clearAppointmentError } =
  appointmentSlice.actions;

export default appointmentSlice.reducer;
