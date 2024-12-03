import axios from 'axios';

const API_BASE = 'https://swapi.dev/api';

export const fetchCharacters = async (page) => {
    try {
        const response = await axios.get(`${API_BASE}/people/?page=${page}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
};

export const fetchHomeworld = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }

};
