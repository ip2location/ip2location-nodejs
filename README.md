[![npm](https://img.shields.io/npm/v/ip2location-nodejs.svg)](http://npm.im/ip2location-nodejs)
[![npm](https://img.shields.io/npm/dm/ip2location-nodejs.svg)](http://npm.im/ip2location-nodejs)

# IP2Location Node.js Module

This Node.js module provides a fast lookup of country, region, city, latitude, longitude, ZIP code, time zone, ISP, domain name, connection type, IDD code, area code, weather station code, station name, mcc, mnc, mobile brand, elevation, and usage type from IP address by using IP2Location database. This module uses a file based database available at IP2Location.com. This database simply contains IP blocks as keys, and other information such as country, region, city, latitude, longitude, ZIP code, time zone, ISP, domain name, connection type, IDD code, area code, weather station code, station name, mcc, mnc, mobile brand, elevation, and usage type as values. It supports both IP address in IPv4 and IPv6.

This module can be used in many types of projects such as:

 - select the geographically closest mirror
 - analyze your web server logs to determine the countries of your visitors
 - credit card fraud detection
 - software export controls
 - display native language and currency 
 - prevent password sharing and abuse of service 
 - geotargeting in advertisement

The database will be updated in monthly basis for the greater accuracy. Free sample DB1 database is available at /samples directory or download it from https://www.ip2location.com/developers.htm.

The complete database is available at https://www.ip2location.com under Premium subscription package.


## Installation

To install this module type the following:

```bash

npm install ip2location-nodejs

```


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
|IP2Location_init|Opens the IP2Location BIN data for lookup.|
|IP2Location_get_all|Returns the geolocation information in an object.|
|IP2Location_get_country_short|Returns the country code.|
|IP2Location_get_country_long|Returns the country name.|
|IP2Location_get_region|Returns the region name.|
|IP2Location_get_city|Returns the city name.|
|IP2Location_get_isp|Returns the ISP name.|
|IP2Location_get_latitude|Returns the latitude.|
|IP2Location_get_longitude|Returns the longitude.|
|IP2Location_get_domain|Returns the domain name.|
|IP2Location_get_zipcode|Returns the ZIP code.|
|IP2Location_get_timezone|Returns the time zone.|
|IP2Location_get_netspeed|Returns the net speed.|
|IP2Location_get_iddcode|Returns the IDD code.|
|IP2Location_get_areacode|Returns the area code.|
|IP2Location_get_weatherstationcode|Returns the weather station code.|
|IP2Location_get_weatherstationname|Returns the weather station name.|
|IP2Location_get_mcc|Returns the mobile country code.|
|IP2Location_get_mnc|Returns the mobile network code.|
|IP2Location_get_mobilebrand|Returns the mobile brand.|
|IP2Location_get_elevation|Returns the elevation in meters.|
|IP2Location_get_usagetype|Returns the usage type.|
|IP2Location_close|Closes BIN file and resets metadata.|


## Usage

```javascript

var ip2loc = require("ip2location-nodejs");

ip2loc.IP2Location_init("./DB24.BIN");

testip = ['8.8.8.8', '2404:6800:4001:c01::67'];

for (var x = 0; x < testip.length; x++) {
	result = ip2loc.IP2Location_get_all(testip[x]);
	for (var key in result) {
		console.log(key + ": " + result[key]);
	}
	console.log("--------------------------------------------------------------");
}

ip2loc.IP2Location_close();
```
