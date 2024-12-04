// Dashboard.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard'; // Adjust according to the file path
import '@testing-library/jest-dom'; // For the toBeInTheDocument matcher

// Mock the data and components that are required for the test
const mockCharacterData = [
  {
    name: "Luke Skywalker",
    height: 172,
    mass: 77,
    birth_year: "19BBY",
    films: ["Film 1", "Film 2"],
    homeworld: {
      name: "Tatooine",
      terrain: "Desert",
      climate: "Arid",
      population: "200000",
    },
    date: "12-03-2024", // Example date
  },
  // Add more mock characters if necessary
];

jest.mock('../../api/Api', () => ({
  fetchCharacters: jest.fn().mockResolvedValue({
    results: mockCharacterData,
    count: mockCharacterData.length,
  }),
}));

describe('Dashboard Component', () => {
  test('modal opens with the correct character information when a card is clicked', async () => {
    // Render the component
    render(<Dashboard />);

    // Wait for characters to be rendered
    await waitFor(() => screen.getByText('Luke Skywalker'));

    // Find the card with the character's name and click on it
    const characterCard = screen.getByText('Luke Skywalker');
    fireEvent.click(characterCard);

    // Wait for the modal to open
    const modalTitle = await screen.findByText('Luke Skywalker'); // Modal should have the character's name

    // Check if the modal displays the correct details
    expect(modalTitle).toBeInTheDocument();
    expect(screen.getByText(/Height:/)).toHaveTextContent('Height: 1.72 m');
    expect(screen.getByText(/Mass:/)).toHaveTextContent('Mass: 77 kg');
    expect(screen.getByText(/Birth Year:/)).toHaveTextContent('Birth Year: 19BBY');
    expect(screen.getByText(/Films:/)).toHaveTextContent('Films: 2');
    expect(screen.getByText(/Homeworld Details:/)).toBeInTheDocument();
    expect(screen.getByText(/Name:/)).toHaveTextContent('Name: Tatooine');
    expect(screen.getByText(/Terrain:/)).toHaveTextContent('Terrain: Desert');
    expect(screen.getByText(/Climate:/)).toHaveTextContent('Climate: Arid');
    expect(screen.getByText(/Population:/)).toHaveTextContent('Population: 200000');
    expect(screen.getByText(/Date:/)).toHaveTextContent('Date: 12-03-2024');
  });
});
