import Dashboard from "./components/Pages/Dashboard/Dashboard";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit"; // Import mock store
// import { fetchFilmsList, fetchPlanetsList, fetchSpeciesList } from "./redux/slices/apiSlice";

// Mock API and Redux thunks
jest.mock("./api/Api", () => ({
    fetchCharacters: jest.fn(),
    fetchHomeworld: jest.fn(),
}));

jest.mock("./redux/slices/apiSlice", () => ({
    fetchFilmsList: jest.fn(),
    fetchPlanetsList: jest.fn(),
    fetchSpeciesList: jest.fn(),
}));

const store = configureStore({
        reducer: {
          data: {
                films: [{ value: "1", label: "A New Hope" }],
                planets: [{ value: "1", label: "Tatooine" }],
                species: [{ value: "1", label: "Human" }],
                status: "succeeded",
                error: null,
            }
        },
      });

describe("Dashboard Modal", () => {
    test("opens modal with correct character details when character card is clicked", async () => {
        // const store = mockStore({
        //     films: [{ value: "1", label: "A New Hope" }],
        //     planets: [{ value: "1", label: "Tatooine" }],
        //     species: [{ value: "1", label: "Human" }],
        //     status: "succeeded",
        //     error: null,
        // });
        // // configureStore({
        //     reducer: {
        //       auth: authReducer,
        //       data: apiReducer
        //     },
        //   });
        // Mock API response for character details
        const character = {
            name: "Luke Skywalker",
            height: "172",
            mass: "77",
            birth_year: "19BBY",
            films: ["A New Hope"],
            homeworld: "Tatooine",
            created: "2014-12-09T13:50:51.644000Z",
        };

        require("./api/Api").fetchCharacters.mockResolvedValue({
            status: 200,
            data: {
                results: [character],
                count: 1,
            },
        });

        // Mock Homeworld API
        require("./api/Api").fetchHomeworld.mockResolvedValue({
            status: 200,
            data: {
                name: "Tatooine",
                terrain: "desert",
                climate: "arid",
                population: "200000",
            },
        });

        render(
            <Provider store={store}>
                <Dashboard />
            </Provider>
        );

        // Wait for character name to appear
        const characterName = await screen.findByText("Luke Skywalker");
        expect(characterName).toBeInTheDocument();

        // Click the 'View Details' button
        fireEvent.click(screen.getByText("View Details"));

        // Assert modal opens with correct details
        await waitFor(() => screen.getByText("Luke Skywalker"));
        expect(screen.getByText("Height: 172")).toBeInTheDocument();
        expect(screen.getByText("Mass: 77")).toBeInTheDocument();
        expect(screen.getByText("Birth Year: 19BBY")).toBeInTheDocument();
        expect(screen.getByText("Homeworld: Tatooine")).toBeInTheDocument();
        expect(screen.getByText("Terrain: desert")).toBeInTheDocument();
        expect(screen.getByText("Climate: arid")).toBeInTheDocument();
        expect(screen.getByText("Population: 200000")).toBeInTheDocument();
    });
});
