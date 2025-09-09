const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function fetchKana(type) {
    const res = await fetch(`${API_BASE_URL}/?type=${type}`);
    if (!res.ok) 
        throw new Error(`Failed to load kana`);
        return res.json();
    }