
import https from 'https';

const base = 'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/car_brands/';

// Brands that appear to be broken based on user report/screenshot
const missingBrands = [
    { name: 'Skoda', variants: ['Skoda.png', 'skoda.png', 'Skodacarlogo.png', 'skodacarlogo.png'] },
    { name: 'Jaguar', variants: ['Jaguar.png', 'jaguar.png', 'Jaguarcarlogo.png', 'jaguarcarlogo.png'] },
    { name: 'Volkswagen', variants: ['Volkswagen.png', 'volkswagen.png', 'Volkswagancarlogo.png', 'volkswagancarlogo.png', 'VW.png', 'vw.png'] },
    { name: 'Mini', variants: ['Mini.png', 'mini.png', 'Minicarlogo.png', 'minicarlogo.png'] }, // Checking others just in case
    { name: 'Kia', variants: ['Kia.png', 'kia.png', 'Kiacarlogo.png', 'kiacarlogo.png'] },
    { name: 'Nissan', variants: ['Nissan.png', 'nissan.png', 'Nissancarlogo.png', 'nissancarlogo.png'] },
    { name: 'Jeep', variants: ['Jeep.png', 'jeep.png', 'Jeepcarlogo.png', 'jeepcarlogo.png'] },
    { name: 'Lexus', variants: ['Lexus.png', 'lexus.png', 'Lexuscarlogo.png', 'lexuscarlogo.png'] },
    { name: 'Toyota', variants: ['Toyota.png', 'toyota.png', 'Toyotacarlogo.png', 'toyotacarlogo.png'] },
    { name: 'Hyundai', variants: ['Hyundai.png', 'hyundai.png', 'Hyundaicarlogo.png', 'hyundaicarlogo.png'] },
    { name: 'MG', variants: ['MG.png', 'mg.png', 'Mg.png', 'Mgcarlogo.png', 'mgcarlogo.png'] },
    { name: 'Land Rover', variants: ['Land Rover.png', 'LandRover.png', 'landrover.png', 'LandRovercarlogo.png'] },
];

console.log('Starting check for missing brands...');

missingBrands.forEach(brand => {
    brand.variants.forEach(file => {
        const url = `${base}${file}`; // No encodeURIComponent for simple checks to trust the strings exactly
        const req = https.request(url, { method: 'HEAD' }, (res) => {
            if (res.statusCode === 200) {
                console.log(`[${brand.name}] FOUND: ${file}`);
            }
        });

        req.on('error', (e) => {
            // ignore
        });

        req.end();
    });
});
