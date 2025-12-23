
import https from 'https';

const urls = [
    'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/car_brands/Audicarlogo.png',
    'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/car_brands/Bmwcarlogo.png'
];

urls.forEach(url => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
        if (res.statusCode === 200) {
            console.log(`CONFIRMED: ${url}`);
        } else {
            console.log(`FAILED: ${url} (${res.statusCode})`);
        }
    });

    req.on('error', (e) => {
        console.error(`ERROR: ${url} - ${e.message}`);
    });

    req.end();
});
