import { Dialog, DialogTitle, DialogContent ,CircularProgress } from '@mui/material';
const DialogModal = (props) => {
    const {modalOpen, setModalOpen, selectedCharacter, homeworld,modalLoader}= props;
    // Format date in dd-MM-yyyy
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits for day
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and ensure two digits
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    
    return (
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle className="text-center text-2xl font-semibold text-gray-800">{selectedCharacter?.name}</DialogTitle>
            <DialogContent className="p-6">
                {modalLoader ? (
                    <div className="flex justify-center items-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <div className="bg-white md:flex shadow-lg rounded-lg p-3 space-y-4 gap-6 items-center">
                        <div className="text-center w-50 h-[20vh] md:h-full md:h-50 flex items-center">
                            <img
                                src={`https://picsum.photos/200/300?random=${selectedCharacter?.name}`}
                                alt={selectedCharacter?.name}
                                className="w-full h-full rounded-md object-cover "
                            />
                        </div>
                        <div className="space-y-2 text-gray-700 flex-1 md:!mt-0">
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
    )
};
export default DialogModal;