const fetchGameState = async (gameId) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export default fetchGameState;