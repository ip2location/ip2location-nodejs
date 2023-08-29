# Quickstart

## Dependencies

This library requires IP2Location BIN database to function. You may download the BIN database at

-   IP2Location LITE BIN Data (Free): <https://lite.ip2location.com>
-   IP2Location Commercial BIN Data (Comprehensive):
    <https://www.ip2location.com>

## IPv4 BIN vs IPv6 BIN

Use the IPv4 BIN file if you just need to query IPv4 addresses.
If you query an IPv6 address using the IPv4 BIN, you'll see the IPV6_NOT_SUPPORTED error.

Use the IPv6 BIN file if you need to query BOTH IPv4 and IPv6 addresses.

## Installation

To install this module type the following:

```bash

npm install ip2location-nodejs

```

## Sample Codes

### Query geolocation information from BIN database

You can query the geolocation information from the IP2Location BIN database as below:

```javascript

const {IP2Location} = require("ip2location-nodejs");

let ip2location = new IP2Location();

ip2location.open("./DB26.BIN");

testip = ['8.8.8.8', '2404:6800:4001:c01::67'];

for (var x = 0; x < testip.length; x++) {
	result = ip2location.getAll(testip[x]);
	for (var key in result) {
		console.log(key + ": " + result[key]);
	}
	console.log("--------------------------------------------------------------");
}

ip2location.close();
```

### Query geolocation information from BIN database asynchronously

You can asynchronously query the geolocation information from the IP2Location BIN database as below:

```javascript

const {IP2Location} = require("ip2location-nodejs");

let ip2location = new IP2Location();

testip = ['8.8.8.8', '2404:6800:4001:c01::67'];

ip2location.openAsync("./DB26.BIN").then(() => {
	for (var x = 0; x < testip.length; x++) {
		ip2location.getAllAsync(testip[x]).then(result => {
			for (var key in result) {
				console.log(key + ": " + result[key]);
			}
			console.log("--------------------------------------------------------------");
		});
	}
});
```

### Processing IP address using IP Tools class

You can manupulate IP address, IP number and CIDR as below:

```javascript
const {IPTools} = require("ip2location-nodejs");

let tools = new IPTools();

console.log(tools.isIPV4("60.54.166.38"));
console.log(tools.isIPV6("2001:4860:4860::8888"));
console.log(tools.ipV4ToDecimal("60.54.166.38"));
console.log(tools.ipV6ToDecimal("2001:4860:4860::8888"));
console.log(tools.decimalToIPV4(1010214438));
console.log(tools.decimalToIPV6("530610913025797008819807084026527744"));
console.log(tools.compressIPV6("66:3123:4860:3234:411:23:000:000"));
console.log(tools.expandIPV6("66:023:40:34:411:23:000:000"));
let cidr = tools.ipV4ToCIDR("10.0.0.0", "10.10.2.255");
for (const x of cidr) {
	console.log(x);
}
cidr = tools.ipV6ToCIDR("2001:4860:4860:0000:0000:0000:0000:8888", "2001:4860:4860:0000:eeee:ffff:ffff:ffff");
for (const x of cidr) {
	console.log(x);
}
console.log(tools.cidrToIPV4("10.123.80.0/12"));
console.log(tools.cidrToIPV6("2002:1234::abcd:ffff:c0a8:101/62"));
```

### List down country information

You can query country information for a country from IP2Location Country Information CSV file as below:

```javascript
const {Country} = require("ip2location-nodejs");

let country = new Country("./IP2LOCATION-COUNTRY-INFORMATION-BASIC.CSV");

country.getCountryInfo("US").then(country_info => {
	console.log(country_info);
});

country.getCountryInfo("").then(country_info => {
	console.log(country_info);
});
```

### List down region information

You can get the region code by country code and region name from IP2Location ISO 3166-2 Subdivision Code CSV file as below:

```javascript
const {Region} = require("ip2location-nodejs");

let region = new Region("./IP2LOCATION-ISO3166-2.CSV");

region.getRegionCode("US", "California").then(region_code => {
	console.log(region_code);
});
```