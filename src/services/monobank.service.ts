import axios from 'axios';

async function getMonobankData(apiUrl: string, token: string) {
    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'X-Token': token
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error('Error fetching data from Monobank:', error);
    }
}

async function sendMonobankData(apiUrl: string, token: string, data: any) {
    try {
        const response = await axios.post(apiUrl, data, {
            headers: {
                'X-Token': token,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error('Error sending data to Monobank:', error);
    }
}

export { getMonobankData, sendMonobankData };
