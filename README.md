[![npm](https://img.shields.io/npm/v/ip2location-nodejs.svg)](http://npm.im/ip2location-nodejs)
[![npm](https://img.shields.io/npm/dm/ip2location-nodejs.svg)](http://npm.im/ip2location-nodejs)

# IP2Location Node.js Module

This Node.js module provides a fast lookup of country, region, city, latitude, longitude, ZIP code, time zone, ISP, domain name, connection type, IDD code, area code, weather station code, station name, mcc, mnc, mobile brand, elevation, usage type, address type and IAB category from IP address by using IP2Location database. This module uses a file based database available at IP2Location.com. This database simply contains IP blocks as keys, and other information such as country, region, city, latitude, longitude, ZIP code, time zone, ISP, domain name, connection type, IDD code, area code, weather station code, station name, mcc, mnc, mobile brand, elevation, usage type, address type and IAB category as values. It supports both IP address in IPv4 and IPv6.

This module can be used in many types of projects such as:

 - select the geographically closest mirror
 - analyze your web server logs to determine the countries of your visitors
 - credit card fraud detection
 - software export controls
 - display native language and currency 
 - prevent password sharing and abuse of service 
 - geotargeting in advertisement

The database will be updated on a monthly basis for greater accuracy.

The complete database is available at https://www.ip2location.com under Premium subscription package.
The free LITE database is available at https://lite.ip2location.com.

As an alternative, this module can also call the IP2Location Web Service. This requires an API key. If you don't have an existing API key, you can subscribe for one at the below:

https://www.ip2location.com/web-service/ip2location

## Installation

To install this module type the following:

```bash

npm install ip2location-nodejs

```

## QUERY USING THE BIN FILE

## Dependencies

This library requires IP2Location BIN data file to function. You may download the BIN data file at
* IP2Location LITE BIN Data (Free): https://lite.ip2location.com
* IP2Location Commercial BIN Data (Comprehensive): https://www.ip2location.com


## IPv4 BIN vs IPv6 BIN

Use the IPv4 BIN file if you just need to query IPv4 addresses.
If you query an IPv6 address using the IPv4 BIN, you'll see the IPV6_NOT_SUPPORTED error.

Use the IPv6 BIN file if you need to query BOTH IPv4 and IPv6 addresses.


## Methods

Below are the methods supported in this module.

|Method Name|Description|
|---|---|
|open|Opens the IP2Location BIN data for lookup.|
|getAll|Returns the geolocation information in an object.|
|getCountryShort|Returns the country code.|
|getCountryLong|Returns the country name.|
|getRegion|Returns the region name.|
|getCity|Returns the city name.|
|getISP|Returns the ISP name.|
|getLatitude|Returns the latitude.|
|getLongitude|Returns the longitude.|
|getDomain|Returns the domain name.|
|getZIPCode|Returns the ZIP code.|
|getTimeZone|Returns the time zone.|
|getNetSpeed|Returns the net speed.|
|getIDDCode|Returns the IDD code.|
|getAreaCode|Returns the area code.|
|getWeatherStationCode|Returns the weather station code.|
|getWeatherStationName|Returns the weather station name.|
|getMCC|Returns the mobile country code.|
|getMNC|Returns the mobile network code.|
|getMobileBrand|Returns the mobile brand.|
|getElevation|Returns the elevation in meters.|
|getUsageType|Returns the usage type.|
|getAddressType|Returns the address type.|
|getCategory|Returns the IAB category.|
|close|Closes BIN file and resets metadata.|


## Usage

```javascript

const {IP2Location} = require("ip2location-nodejs");

let ip2location = new IP2Location();

ip2location.open("./DB25.BIN");

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

## QUERY USING THE IP2LOCATION WEB SERVICE

## Methods
Below are the methods supported in this module.

|Method Name|Description|
|---|---|
|open| 3 input parameters:<ol><li>IP2Location API Key.</li><li>Package (WS1 - WS25)</li></li><li>Use HTTPS or HTTP</li></ol> |
|lookup|Query IP address. This method returns an object containing the geolocation info. <ul><li>country_code</li><li>country_name</li><li>region_name</li><li>city_name</li><li>latitude</li><li>longitude</li><li>zip_code</li><li>time_zone</li><li>isp</li><li>domain</li><li>net_speed</li><li>idd_code</li><li>area_code</li><li>weather_station_code</li><li>weather_station_name</li><li>mcc</li><li>mnc</li><li>mobile_brand</li><li>elevation</li><li>usage_type</li><li>address_type</li><li>category</li><li>continent<ul><li>name</li><li>code</li><li>hemisphere</li><li>translations</li></ul></li><li>country<ul><li>name</li><li>alpha3_code</li><li>numeric_code</li><li>demonym</li><li>flag</li><li>capital</li><li>total_area</li><li>population</li><li>currency<ul><li>code</li><li>name</li><li>symbol</li></ul></li><li>language<ul><li>code</li><li>name</li></ul></li><li>idd_code</li><li>tld</li><li>translations</li></ul></li><li>region<ul><li>name</li><li>code</li><li>translations</li></ul></li><li>city<ul><li>name</li><li>translations</li></ul></li><li>geotargeting<ul><li>metro</li></ul></li><li>country_groupings</li><li>time_zone_info<ul><li>olson</li><li>current_time</li><li>gmt_offset</li><li>is_dst</li><li>sunrise</li><li>sunset</li></ul></li><ul>|
|getCredit()|This method returns the web service credit balance in an object.|

## Usage

```javascript

const {IP2LocationWebService} = require("ip2location-nodejs");

let ws = new IP2LocationWebService();

let ip = "8.8.8.8";
let apiKey = "YOUR_API_KEY";
let apiPackage = "WS25";
let useSSL = true;

// addon and lang to get more data and translation (leave both blank if you don't need them)
let addon = "continent,country,region,city,geotargeting,country_groupings,time_zone_info";
let lang = "fr";

ws.open(apiKey, apiPackage, useSSL);

ws.lookup(ip, addon, lang, (err, data) => {
	if (!err) {
		console.log(data);
		
		ws.getCredit((err, data) => {
			if (!err) {
				console.log(data);
			}
		});
	}
});

```

## IPTOOLS CLASS

## Methods
Below are the methods supported in this module.

|Method Name|Description|
|---|---|
|isIPV4(myIP)|Returns true if string contains an IPv4 address. Otherwise false.|
|isIPV6(myIP)|Returns true if string contains an IPv6 address. Otherwise false.|
|ipV4ToDecimal(myIP)|Returns the IP number for an IPv4 address.|
|ipV6ToDecimal(myIP)|Returns the IP number for an IPv6 address.|
|decimalToIPV4(ipNum)|Returns the IPv4 address for the supplied IP number.|
|decimalToIPV6(ipNum)|Returns the IPv6 address for the supplied IP number.|
|compressIPV6(myIP)|Returns the IPv6 address in compressed form.|
|expandIPV6(myIP)|Returns the IPv6 address in expanded form.|
|ipV4ToCIDR(ipFrom, ipTo)|Returns a list of CIDR from the supplied IPv4 range.|
|ipV6ToCIDR(ipFrom, ipTo)|Returns a list of CIDR from the supplied IPv6 range.|
|cidrToIPV4(cidr)|Returns the IPv4 range from the supplied CIDR.|
|cidrToIPV6(cidr)|Returns the IPv6 range from the supplied CIDR.|

## Usage

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

## COUNTRY CLASS

## Methods
Below are the methods supported in this module.

|Method Name|Description|
|---|---|
|getCountryInfo(countryCode)|Returns the country information.|

## Usage

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

## REGION CLASS

## Methods
Below are the methods supported in this module.

|Method Name|Description|
|---|---|
|getRegionCode(countryCode, regionName)|Returns the region code for the supplied country code and region name.|

## Usage

```javascript
const {Region} = require("ip2location-nodejs");

let region = new Region("./IP2LOCATION-ISO3166-2.CSV");

region.getRegionCode("US", "California").then(region_code => {
	console.log(region_code);
});
```
