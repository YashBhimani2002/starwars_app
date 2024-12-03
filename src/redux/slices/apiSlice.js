import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFilms, fetchPlanets, fetchSpecies } from "../../api/Api"; // Adjust the import path as needed

// Thunks for fetching data
export const fetchFilmsList = createAsyncThunk("data/fetchFilms", async () => {
  const response = await fetchFilms();
  return response.results.map((item) => ({
    value: item.url,
    label: item.title,
  }));
});

export const fetchPlanetsList = createAsyncThunk("data/fetchPlanets", async () => {
  const response = await fetchPlanets();
  return response.results.map((item) => ({
    value: item.url,
    label: item.name,
  }));
});

export const fetchSpeciesList = createAsyncThunk("data/fetchSpecies", async () => {
  const response = await fetchSpecies();
  return response.results.map((item) => ({
    value: item.url,
    label: item.name,
  }));
});

// Slice
const apiSlice = createSlice({
  name: "data",
  initialState: {
    films: [],
    planets: [],
    species: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Films
      .addCase(fetchFilmsList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFilmsList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.films = action.payload;
      })
      .addCase(fetchFilmsList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch Planets
      .addCase(fetchPlanetsList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlanetsList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.planets = action.payload;
      })
      .addCase(fetchPlanetsList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch Species
      .addCase(fetchSpeciesList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSpeciesList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.species = action.payload;
      })
      .addCase(fetchSpeciesList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default apiSlice.reducer;
