const IP2Location = require('./ip2location');

let ip2loc = new IP2Location(process.env.DB_IP2LOCATION_PATH, null);

let test_ip = [
    '8.8.8.8',
    '2404:6800:4001:c01::67',
    '2001:0200:0102:0000:0000:0000:0000:0000',
    '2001:0200:0135:0000:0000:0000:0000:0000',
    '2001:0200:017A:0000:0000:0000:0000:0000',
    '2404:6800:4001:c01::93',
    '::FFFF:8.8.8.8',
    '0000:0000:0000:0000:0000:FFFF:8.8.8.8',
    '::8.8.8.8.8'
];

test_ip.forEach(ip => {
    let result = ip2loc.IP2Location_get_all(ip);
    Object.keys(result).forEach(key => {
        console.log(`${key}: ${result[key]}`);
    });

    console.log("--------------------------------------------------------------");
});
