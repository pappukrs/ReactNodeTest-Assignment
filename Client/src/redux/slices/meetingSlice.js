import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi, postApi } from '../../services/api';

export const fetchMeetingData = createAsyncThunk('meeting/fetchMeetingData', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await getApi(user.role === 'superAdmin' ? 'api/meeting' : `api/meeting/?createBy=${user._id}`);
        return response;
    } catch (error) {
        throw error;
    }
});

export const addMeeting = createAsyncThunk('meeting/addMeeting', async (meetingData) => {
    try {
        const response = await postApi('api/meeting/add', meetingData);
        return response;
    } catch (error) {
        throw error;
    }
});

const meetingSlice = createSlice({
    name: 'meeting',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMeetingData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMeetingData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = Array.isArray(action.payload) ? action.payload : [];
                state.error = "";
            })
            .addCase(fetchMeetingData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            })
            .addCase(addMeeting.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addMeeting.fulfilled, (state, action) => {
                console.log('Current state.data:', state.data); 
                console.log('Action payload:', action.payload); 
                state.isLoading = false;
                if (Array.isArray(state.data)) {
                    state.data.push(action.payload);
                } else {
                    state.data = [action.payload]; 
                }
                state.error = "";
            })
            .addCase(addMeeting.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export default meetingSlice.reducer;