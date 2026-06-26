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
  canSubmitDoc:boolean
}

interface UserState {
  user?: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading?: boolean;
  error?: any;
  others?: any;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  // user: null,
  // loading: false,
  // error: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated:false
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
      return datas;
    } catch (err: any) {
      if (err.response?.status === 401) {
        return rejectWithValue("UNAUTHORIZED")
      }
      return rejectWithValue(
        err.response?.data?.message || err?.message || "Une erreur est survenue",
      );
    }
  }
);

export const searchUser = createAsyncThunk(
  "user/search",
  async (data : {query: string, page: number, limit: number}, { rejectWithValue }) => {
    try {
      const datas = await authService.search(data);
      return datas;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err?.message || "Une erreur est survenue"
      );
    }
  })

  export const deleteUser = createAsyncThunk(
    "user/delete",
    async (id: number, { rejectWithValue }) => {
      try {
        const datas = await authService.deleteUser(id);
        return datas;
      } catch (err: any) {
        return rejectWithValue(
          err.response?.data?.message || err?.message || "Une erreur est survenue"
        );
      }
    }
  )

  export const updateRole = createAsyncThunk(
    "user/updateRole",
    async (data: {id: number, role: string}, { rejectWithValue }) => {
      try {
        const datas = await authService.updateRole(data);
        return datas
      }
      catch(err: any){
        return rejectWithValue(
          err.response?.data?.message || err?.message || "Une erreur est survenue"
        )
      }
    }
  )

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
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false
      // return initialState;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true
    },

    updateProfile: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload
      }
    },

    updateTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    updateProfileImg: (state, action) => {
      if (state.user) {
        state.user.imgUrl = action.payload
      }
    },

    setAllNotifAsRead: (state)=> {
      if (state.others.notification && Array.isArray(state.others.notification)) {
        state.others.notification = []
      }
    },

    addNotif: (state, action) => {
      if (state.others.notification && Array.isArray(state.others.notification)) {
        state.others.notification.unshift(action.payload)
      } else {
        state.others.notification = [action.payload]
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
        state.isAuthenticated = true
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
          state.user = null;
          state.accessToken = null;
          state.error = "Session expire"
        } else {
          state.error = action.payload as string
        }
    })

      //search
        .addCase(searchUser.fulfilled, (state, action) => {
          state.loading = false;
        })
        .addCase(searchUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        .addCase(searchUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
    
    //delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
          state.user = null
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.loading = true
        state.error = null
      })
    
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = true
        state.error = action.payload as string
    })
        
  },
});

export const {
  logout,
  loginSuccess,
  setCredentials,
  updateBalanceUser,
  updateProfile,
  updateProfileImg,
  updateTokens,
  setAllNotifAsRead,
  addNotif
} = userSlice.actions;
export default userSlice.reducer;
