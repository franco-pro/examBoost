import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  authService,
  forgetPasswordProps,
  loginProps,
  registerProps,
  resetPasswordProps,
} from "@/app/api/authService";
import { RootState } from "../store";

interface User {
  id: number;
  username: string;
  surname: string;
  phone: string;
  email: string;
  niveauID: string;
  wallet: string;
  role: string;
  imgUrl: string;
  isActivated: string;
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: any;
  others?: any;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
  // others: null
};

//un thunk est une action asynchrone qui appelle dans ce cas mon api
export const loginUser = createAsyncThunk(
  "user/login",
  async (payload: loginProps, { rejectWithValue }) => {
    try {
      const datas = await authService.login(payload);
      return datas;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (payload: registerProps, { rejectWithValue }) => {
    try {
      const data = await authService.register(payload);
      return data;
    } catch (err: any) {
      console.log("❌ Erreur pendant register dans slice user:", err);
      return rejectWithValue(
        err.response?.data?.message || err?.message || "Une erreur est survenue"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (payload: resetPasswordProps, { rejectWithValue }) => {
    try {
      const datas = await authService.resetPassword(payload);
      return datas;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err);
    }
  }
);

export const forgetPassword = createAsyncThunk(
  "user/forgetPassword",
  async (payload: forgetPasswordProps, { rejectWithValue }) => {
    try {
      const datas = await authService.forgetPassword(payload);
      return datas;
    } catch (err: any) {
      rejectWithValue(err.response?.data?.message || err);
    }
  }
);

//thunk pour charger le home
export const userDatas = createAsyncThunk(
  "user/datas",
  async (_, { rejectWithValue, getState }) => {
    try {
      // console.log("enter")
      const state: RootState = getState() as RootState;
      const token = state?.user?.accessToken;
      if (!token) throw new Error("No token Found !");
      const datas = await authService.userDatas(token);
      // console.log("enter userData with token:", token);
      console.log("UserDatas:", datas);
      return datas;
    } catch (err: any) {
      const state: RootState = getState() as RootState;
      if (err.response?.status === 401) {
        return rejectWithValue("UNAUTHORIZED")
      }
      return rejectWithValue(
        err.response?.data?.message || err?.message || "Une erreur est survenue",
      );
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string | null;
        refreshToken: string | null;
      }>
    ) => {
      state.accessToken = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: (state) => {
      // state.user = null;
      // state.accessToken = null;
      // state.refreshToken = null;
      return initialState;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken
    },

    updateProfile: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload
      }
    },

    updateBalanceUser: (state, action) => {
      if (state.user) {
        state.user.wallet = action.payload
      } else {
        console.log("le state dans updateBalanceUser: ", state)
      }
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })

      //register
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        console.log("payload:", action.payload);
        state.refreshToken = action.payload.refreshToken;
      })

      //user Datas
      .addCase(userDatas.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.others = action.payload.infos
      })
    
    //redirect login page
      .addCase(userDatas.rejected, (state, action) => {
        state.loading = false
        
        if (action.payload === "UNAUTHORIZED") {
          state.user = null,
            state.accessToken = null
          state.error = "Session expire"
        } else {
          state.error = action.payload as string
        }
    })
  },
});

export const { logout,loginSuccess, setCredentials, updateBalanceUser, updateProfile } = userSlice.actions;
export default userSlice.reducer;
