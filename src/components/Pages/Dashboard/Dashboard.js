import { useEffect, useState } from "react";
import { fetchCharacters, fetchHomeworld, } from "../../../api/Api";
import { Dialog, DialogTitle, DialogContent, CircularProgress } from '@mui/material';
import { Select } from 'antd';
import { Input } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { fetchFilmsList, fetchPlanetsList, fetchSpeciesList } from "../../../redux/slices/apiSlice";



const Dashboard = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [storeCount, setTotalCount] = useState(0);
    const [listDetails, setListDetails] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState({});
    const [homeworld, setHomeworld] = useState({});
    const [modalLoader, setModalLoader] = useState(false);
    const [nextDisable, setNextDisable] = useState(false);
    const [prevDisable, setPrevDisable] = useState(true);
    const [filmsNameList, setFilmsNameList] = useState([]);
    const [plantsNameList, setPlanstNameList] = useState([]);
    const [speciesNameList, setSpeciesNameList] = useState([]);
    const [filteredCharacters, setFilteredCharacters] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        homeworld: "All",
        film: "All",
        species: "All",
    });
    const { Search } = Input;


    const dispatch = useDispatch();

    // Select data from Redux store
    const { films, planets, species } = useSelector((state) => state.data);

    // Dispatch API calls on component mount
    useEffect(() => {
        dispatch(fetchFilmsList());
        dispatch(fetchPlanetsList());
        dispatch(fetchSpeciesList());
    }, [dispatch]);

    // const fetchFilmsList = async () => {
    //     try {
    //         const response = await fetchFilms();
    //         if (response?.results?.length > 0) {
    //             const data = [];
    //             response.results.map((item) => {
    //                 data.push({ value: item.url, label: item.title },)
    //             })
    //             setFilmsNameList(data);
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // const fetchPlanetsList = async () => {
    //     try {
    //         const response = await fetchPlanets();
    //         if (response?.results?.length > 0) {
    //             const data = [];
    //             response.results.map((item) => {
    //                 data.push({ value: item.url, label: item.name },)
    //             })
    //             setPlanstNameList(data);
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // const fetchSpeciesList = async () => {
    //     try {
    //         const response = await fetchSpecies();
    //         if (response?.results?.length > 0) {
    //             const data = [];
    //             response.results.map((item) => {
    //                 data.push({ value: item.url, label: item.name },)
    //             })
    //             setSpeciesNameList(data);
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    //Call characterlist get api
    const fetchCharactersList = async () => {
        setLoadingStatus(true);
        try {
            const response = await fetchCharacters(pageNumber);
            console.log(response);
            if (response?.results?.length > 0) {
                console.log(response?.results);
                if (response?.next == null) {
                    setNextDisable(true);
                } else if (response?.next != null) {
                    setNextDisable(false);
                };
                if (response?.previous == null) {
                    setPrevDisable(true);
                } else if (response?.previous != null) {
                    setPrevDisable(false);
                }
                setListDetails(response?.results);
                setFilteredCharacters(response?.results);
                setTotalCount(response?.count);
                setLoadingStatus(false);
            }
        } catch (error) {
            setLoadingStatus(false);
        }
    };

    //Call the api to show detials on dashboard
    useEffect(() => {
        fetchCharactersList();
    }, [pageNumber]);

    // handle to set modal box details
    const handleOpenModal = async (data) => {
        setModalOpen(true);
        setModalLoader(true);
        setSelectedCharacter({
            name: data.name, height: data.height, mass: data.mass, birth_year: data.birth_year, films: data.films, date: data.created
        });
        try {
            const response = await fetchHomeworld(data.homeworld);
            console.log(response);
            setHomeworld({
                name: response.name, terrain: response.terrain, climate: response.climate, population: response.population
            })
            setModalLoader(false);
        } catch (error) {
            setModalLoader(false);
        }
    }
    //Set search value
    const onSearch = (e) => {
        console.log(e.target.value);
        setSearchTerm(e.target.value)
    };

    // Format date in dd-MM-yyyy
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits for day
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and ensure two digits
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Filter and search logic
    const applyFilters = () => {
        let filteredList = listDetails;
        // Search by name (partial or full match, case-insensitive)
        if (searchTerm) {
            filteredList = filteredList.filter(character =>
                character.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        // Filter by homeworld
        if (filters.homeworld !== "All") {
            filteredList = filteredList.filter(character => character.homeworld === filters.homeworld);
        }
        // Filter by film
        if (filters.film !== "All") {
            filteredList = filteredList.filter(character =>
                character.films.some(film => film === filters.film)
            );
        }
        // Filter by species
        if (filters.species !== "All") {
            filteredList = filteredList.filter(character => character.species === filters.species);
        }
        setFilteredCharacters(filteredList);
    };

    // Update filtered characters when searchTerm or filters change
    useEffect(() => {
        applyFilters();
    }, [searchTerm, filters]);

    const handleFilterChange = (filterType, value) => {
        setFilters({
            ...filters,
            [filterType]: value,
        });
    };

    return (
        <>
            {loadingStatus ?
                <div className="text-xl h-screen bg-gray-200 animate-pulse flex w-full h-full justify-center items-center">
                    <CircularProgress />
                </div> :
                <div className="bg-gray-200 w-full p-5 flex flex-col gap-5 mt-20">
                    <div className="flex flex-wrap flex-1 w-full justify-end items-center gap-4">
                        <Search placeholder="Search by name" onChange={onSearch} style={{ width: 200 }} />
                        <div className="gap-2 flex items-center">
                            <label>Homeworld :</label>
                            <Select
                                defaultValue="All"
                                id="homeworld"
                                style={{ width: 120 }}
                                onChange={(value) => handleFilterChange("homeworld", value)}
                                options={[{ value: "All", label: "All" }, ...planets]}
                            />
                        </div>
                        <div className="gap-2 flex items-center">
                            <label>Film :</label>
                            <Select
                                defaultValue="All"
                                id="film"
                                style={{ width: 120 }}
                                onChange={(value) => handleFilterChange("film", value)}
                                options={[{ value: "All", label: "All" }, ...films]}
                            />
                        </div>
                        <div className="gap-2 flex items-center">
                            <label>Species :</label>
                            <Select
                                defaultValue="All"
                                id="species"
                                style={{ width: 120 }}
                                onChange={(value) => handleFilterChange("species", value)}
                                options={[{ value: "All", label: "All" }, ...species]}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-6">
                        {listDetails?.length > 0 ? (
                            <div className="flex flex-wrap gap-8 justify-center">
                                {filteredCharacters.length == 0 ?
                                    <div className="text-lg h-30 text-center">No data found</div>

                                    : filteredCharacters.map((character, key) => (
                                        <div
                                            className={`w-60 rounded-lg shadow-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl`}
                                            style={{
                                                backgroundColor: character.skin_color.includes(',')
                                                    ? character.skin_color.split(',')[0]
                                                    : character.skin_color
                                            }}
                                            key={key}
                                        >
                                            <img
                                                src={`https://picsum.photos/200/300?random=${character.name}`}
                                                alt={character.name}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                            <div className="p-4">
                                                <h3 className="text-lg font-bold text-gray-800">{character.name}</h3>
                                                <div className="mt-3 text-center">
                                                    <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                                                        onClick={() => {
                                                            handleOpenModal(character)
                                                        }}
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="text-lg">No data found</div>
                        )}
                    </div>
                    {/* Pagination Controls */}
                    {storeCount > 10 && listDetails.length !== 0 && (
                        <div className="mt-6 flex justify-center space-x-4">
                            <button
                                className={`${prevDisable ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600 "} text-white  px-6 py-2 rounded-full transition duration-300 cursor-pointer`}
                                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                                disabled={prevDisable}
                            >
                                Prev
                            </button>
                            <span className="pt-1 font-medium">Page {pageNumber}</span>
                            <button
                                className={`${nextDisable ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600 "} text-white px-6 py-2 rounded-full transition duration-300 cursor-pointer`}
                                onClick={() => setPageNumber((prev) => prev + 1)}
                                disabled={nextDisable}
                            >
                                Next
                            </button>
                        </div>
                    )}
                    {/* Character Modal */}
                    <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth >
                        <DialogTitle className="text-center text-2xl font-semibold text-gray-800">{selectedCharacter?.name}</DialogTitle>
                        <DialogContent className="p-6">
                            {modalLoader ? (
                                <div className="flex justify-center items-center">
                                    <CircularProgress />
                                </div>
                            ) : (
                                <div className="bg-white md:flex shadow-lg rounded-lg p-3 space-y-4 gap-6">
                                    <div className="text-center w-full h-[20vh] md:h-50 flex items-center">
                                        <img
                                            src={`https://picsum.photos/200/300?random=${selectedCharacter?.name}`}
                                            alt={selectedCharacter?.name}
                                            className="w-full h-full rounded-md object-cover "
                                        />
                                    </div>
                                    <div className="space-y-2 text-gray-700 flex-1">
                                        <p><strong>Height:</strong> {selectedCharacter?.height / 100} m</p>
                                        <p><strong>Mass:</strong> {selectedCharacter?.mass} kg</p>
                                        <p><strong>Date:</strong> {formatDate(selectedCharacter?.date)}</p>
                                        <p><strong>Birth Year:</strong> {selectedCharacter?.birth_year}</p>
                                        <p><strong>Films:</strong> {selectedCharacter?.films?.length}</p>

                                        {homeworld && Object.keys(homeworld).length > 0 && (
                                            <div className="mt-4">
                                                <h3 className="font-semibold text-lg text-gray-800">Homeworld Details:</h3>
                                                <p><strong>Name:</strong> {homeworld?.name}</p>
                                                <p><strong>Terrain:</strong> {homeworld?.terrain}</p>
                                                <p><strong>Climate:</strong> {homeworld?.climate}</p>
                                                <p><strong>Population:</strong> {homeworld?.population}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>}
        </>
    );
};

export default Dashboard;
