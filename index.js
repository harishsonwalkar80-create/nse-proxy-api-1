
const https = require('https');

const options = {
    hostname: 'www.nseindia.com',
    path: '/api/equity-stockIndices?index=NIFTY%2050',
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': '*/*',
        'Connection': 'keep-alive'
    }
};

https.get(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log(parsed);
        } catch (e) {
            console.error("Failed to parse JSON:", e.message);
        }
    });
}).on('error', (e) => {
    console.error("Error fetching data:", e.message);
});
