export async function fetchGameState(gameId) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/games/${gameId}`);
    if (!response.ok) {
        throw new Error(`HTTP error!, status: ${response.status}`);
    }
    const data = await response.json();
    // console.log(data);
    return data;
};  