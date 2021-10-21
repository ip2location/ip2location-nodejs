const {IP2Location, IP2LocationWebService} = require("ip2location-nodejs");

let ip2location = new IP2Location();

ip2location.open("./DB25.BIN");

testip = ['2001:0:4136:e378:8000:63bf:f7f7:f7f7', '2002:0803:2200::0803:2200'];

for (var x = 0; x < testip.length; x++) {
	result = ip2location.getAll(testip[x]);
	for (var key in result) {
		console.log(key + ": " + result[key]);
	}
	console.log("--------------------------------------------------------------");
	console.log("countryShort: " + ip2location.getCountryShort(testip[x]));
	console.log("countryLong: " + ip2location.getCountryLong(testip[x]));
	console.log("region: " + ip2location.getRegion(testip[x]));
	console.log("city: " + ip2location.getCity(testip[x]));
	console.log("isp: " + ip2location.getISP(testip[x]));
	console.log("domain: " + ip2location.getDomain(testip[x]));
	console.log("zipCode: " + ip2location.getZIPCode(testip[x]));
	console.log("latitude: " + ip2location.getLatitude(testip[x]));
	console.log("longitude: " + ip2location.getLongitude(testip[x]));
	console.log("timeZone: " + ip2location.getTimeZone(testip[x]));
	console.log("netSpeed: " + ip2location.getNetSpeed(testip[x]));
	console.log("iddCode: " + ip2location.getIDDCode(testip[x]));
	console.log("areaCode: " + ip2location.getAreaCode(testip[x]));
	console.log("weatherStationCode: " + ip2location.getWeatherStationCode(testip[x]));
	console.log("weatherStationName: " + ip2location.getWeatherStationName(testip[x]));
	console.log("mcc: " + ip2location.getMCC(testip[x]));
	console.log("mnc: " + ip2location.getMNC(testip[x]));
	console.log("mobileBrand: " + ip2location.getMobileBrand(testip[x]));
	console.log("elevation: " + ip2location.getElevation(testip[x]));
	console.log("usageType: " + ip2location.getUsageType(testip[x]));
	console.log("addressType: " + ip2location.getAddressType(testip[x]));
	console.log("category: " + ip2location.getCategory(testip[x]));
	console.log("==================================================================");
}

ip2location.close();

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
