import axios from 'axios';

export default async function fetchGameState(gameId) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}`);

    return response
}