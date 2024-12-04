import { useCallback, useEffect, useState } from "react";
import { fetchCharacters, fetchHomeworld, } from "../../../api/Api";
import { CircularProgress } from '@mui/material';
import { Select } from 'antd';
import { Input } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { fetchFilmsList, fetchPlanetsList, fetchSpeciesList } from "../../../redux/slices/apiSlice";
import DialogModal from "../Modal/DialogModal";



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

    //Call characterlist get api
    const fetchCharactersList = useCallback(async () => {
        setLoadingStatus(true);
        try {
            const response = await fetchCharacters(pageNumber);
            if (response?.status === 200) {
                let data = response.data;
                if (data?.results?.length > 0) {
                    if (data?.next == null) {
                        setNextDisable(true);
                    } else if (data?.next != null) {
                        setNextDisable(false);
                    };
                    if (data?.previous == null) {
                        setPrevDisable(true);
                    } else if (data?.previous != null) {
                        setPrevDisable(false);
                    }
                    setListDetails(data?.results);
                    setFilteredCharacters(data?.results);
                    setTotalCount(data?.count);
                    setLoadingStatus(false);
                }
            }
        } catch (error) {
            setLoadingStatus(false);
        }
    }, [pageNumber]);

    //Call the api to show detials on dashboard
    useEffect(() => {
        fetchCharactersList();
    }, [pageNumber, fetchCharactersList]);

    // handle to set modal box details
    const handleOpenModal = async (data) => {
        setModalOpen(true);
        setModalLoader(true);
        setSelectedCharacter({
            name: data.name, height: data.height, mass: data.mass, birth_year: data.birth_year, films: data.films, date: data.created
        });
        try {
            const response = await fetchHomeworld(data.homeworld);
            if (response?.status === 200) {
                let data = response.data;
                setHomeworld({
                    name: data.name, terrain: data.terrain, climate: data.climate, population: data.population
                })
                setModalLoader(false);
            }
        } catch (error) {
            setModalLoader(false);
        }
    }
    //Set search value
    const onSearch = (e) => {
        setSearchTerm(e.target.value)
    };

    // Filter and search logic
    const applyFilters = useCallback(() => {
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
    }, [searchTerm, filters, listDetails]);

    // Update filtered characters when searchTerm or filters change
    useEffect(() => {
        applyFilters();
    }, [searchTerm, filters, applyFilters]);

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
                <div className="bg-gray-200 w-full p-5 flex  flex-col gap-5 h-[80vh] overflow-y-scroll">
                    <div className="flex md:flex-row flex-col flex-wrap w-full md:justify-end items-center gap-4">
                        <Search placeholder="Search by name" onChange={onSearch} className="w-full md:w-[200px]" />
                        <div className="gap-2 flex md:items-center md:flex-row flex-col w-full md:w-auto">
                            <label>Homeworld :</label>
                            <Select
                                defaultValue="All"
                                id="homeworld"
                                className="w-full md:w-[120px]"
                                onChange={(value) => handleFilterChange("homeworld", value)}
                                options={[{ value: "All", label: "All" }, ...planets]}
                            />
                        </div>
                        <div className="gap-2 flex md:items-center md:flex-row flex-col w-full md:w-auto">
                            <label>Film :</label>
                            <Select
                                defaultValue="All"
                                id="film"
                                className="w-full md:w-[120px]"
                                onChange={(value) => handleFilterChange("film", value)}
                                options={[{ value: "All", label: "All" }, ...films]}
                            />
                        </div>
                        <div className="gap-2 flex md:items-center md:flex-row flex-col w-full md:w-auto">
                            <label>Species :</label>
                            <Select
                                defaultValue="All"
                                id="species"
                                className="w-full md:w-[120px]"
                                onChange={(value) => handleFilterChange("species", value)}
                                options={[{ value: "All", label: "All" }, ...species]}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-6">
                        {listDetails?.length > 0 ? (
                            <div className="flex flex-wrap gap-8 justify-center">
                                {filteredCharacters.length === 0 ?
                                    <div className="text-lg h-30 text-center">No data found</div>

                                    : filteredCharacters.map((character, key) => (
                                        <div
                                            className={`w-60 rounded-lg shadow-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl`}
                                            style={{
                                                backgroundColor: character.skin_color.includes(',')
                                                    ? character.skin_color.split(',')[1]
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
                    </div>

                    {/* Character Modal */}
                    <DialogModal
                        modalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                        selectedCharacter={selectedCharacter}
                        homeworld={homeworld}
                        modalLoader={modalLoader}
                    />
                </div>}
        </>
    );
};

export default Dashboard;
