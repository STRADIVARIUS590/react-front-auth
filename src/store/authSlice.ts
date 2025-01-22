import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Api } from "../services/Api";

export interface IUser {
    id: number
    name: string
    email: string
    all_permissions: [],
    contratation_type : string | null | undefined,
    category : string | null | undefined
    role: {
        id: number | string ,
        name: string
    },
    avatar? : {
        preview_url : string
    }
    // isLogged: boolean
    // isLoading: boolean
}

type AuthState = {
    token: string | null
    user: null | IUser
    isLogged: boolean
    isLoading: boolean
}

export const loginUser = createAsyncThunk('auth/loginUser', async (data: any) => {
    const response = await Api.post('/users/login', data, {});
    if (response.statusCode === 200) {
        return response.data;
    }
    throw new Error('error');
    // return thunkApi.rejectWithValue(response.value);
})


export const registerUSer = createAsyncThunk('auth/registerUser', async (data: any, thunkApi) => {
    const response = await Api.post('/users', data, {});

    if (response.statusCode === 200) {
        return response.data;
    }
    return thunkApi.rejectWithValue(response.data);
    // throw new Error(response.message);
});

const initialState: AuthState = {
    token: null,
    user: null,
    isLogged: false,
    isLoading: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder: any) => {
        builder.addCase(loginUser.pending, (state: AuthState) => {
            state.isLoading = true;
        })
            .addCase(loginUser.fulfilled, (state: AuthState, action: any) => {

                // console.log(action.payload);
                state.isLoading = false;
                state.isLogged = true;
                state.token = action.payload.token;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state: AuthState) => {
                state.isLoading = false;
                state.isLogged = false;
                state.token = null;
                state.user = null;
            })

            .addCase(registerUSer.fulfilled, (state: AuthState, action: any) => {
                state.isLoading = false;
                state.isLogged = true;
                state.token = action.payload.token;
                state.user = action.payload
            })
            .addCase(registerUSer.pending, (state: AuthState) => {
                state.isLoading = false;
                state.isLogged = false;
                state.token = null;
                state.user = null;
            })
            .addCase(registerUSer.rejected, (state: AuthState) => {
                state.isLoading = false;
                state.isLogged = false;
                state.token = null;
                state.user = null;
            })
    }
})

export default authSlice.reducer



