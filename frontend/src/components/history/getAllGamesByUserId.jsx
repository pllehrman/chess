export async function getAllGamesByUserId(userId) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/user/${userId}?t=${new Date().getTime()}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.games;
}