import axios from 'axios';

const API_BASE = 'https://swapi.dev/api';

export const fetchCharacters = async (page) => {
    try {
        const response = await axios.get(`${API_BASE}/people/?page=${page}`);
        return response;
    }
    catch (error) {
        throw error;
    }
};

export const fetchHomeworld = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

export const fetchFilms = async () => {
    try {
        const response = await axios.get('https://swapi.dev/api/films')
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const fetchPlanets = async () => {
    try {
        const response = await axios.get('https://swapi.dev/api/planets')
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const fetchSpecies = async () => {
    try {
        const response = await axios.get('https://swapi.dev/api/species')
        return response.data;
    } catch (error) {
        throw error;
    }
}