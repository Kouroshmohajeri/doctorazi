import axios from 'axios';
import { pool } from '../config/db.js';


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_URL = 'https://zoom.us/oauth/token';

async function getStoredToken() {
    // Retrieve the stored tokens from your database
    const result = await pool.query('SELECT * FROM oauth_refresh_tokens WHERE id = 2');
    return result[0][0]; 
}

async function updateStoredToken(accessToken, refreshToken, expiresIn) {
    // Convert expiresIn to milliseconds and add to the current timestamp
    const expiresAtMillis = Date.now() + expiresIn * 1000;

    // Convert the expiresAtMillis to a Date object
    const expiresAtDate = new Date(expiresAtMillis);

    // Format the Date object as a string acceptable by MySQL DATETIME
    const expiresAtMySQL = expiresAtDate.toISOString().slice(0, 19).replace('T', ' ');

    // Now, you can use expiresAtMySQL in your SQL query
    await pool.query('UPDATE oauth_refresh_tokens SET access_token = ?, refresh_token = ?, expires_at = ? WHERE id = 2', [
        accessToken,
        refreshToken,
        expiresAtMySQL, // Use the properly formatted DATETIME value here
    ]);
}

async function refreshAccessToken(refreshToken) {
    // Refresh the access token using the refresh token
    try {
        const response = await axios.post(TOKEN_URL, null, {
            params: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            },
            headers: {
                'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token, refresh_token, expires_in } = response.data;
        await updateStoredToken(access_token, refresh_token, expires_in);
        return access_token;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw new Error('Failed to refresh access token');
    }
}

export async function getAccessToken() {
    const { access_token, refresh_token, expires_at } = await getStoredToken();
    // Check if the current access token is expired
    if (Date.now() > expires_at) {
        // Refresh the access token
        return await refreshAccessToken(refresh_token);
    }

    return access_token;
}
