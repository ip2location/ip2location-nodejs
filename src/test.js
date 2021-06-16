var ip2loc = require("ip2location-nodejs");
// var ip2loc = require("./ip2location.js");

// ip2loc.IP2Location_init("/root/testnodejs/db24.BIN");
ip2loc.IP2Location_init("./DB25.BIN");

// testip = ['8.8.8.8', '2404:6800:4001:c01::67', '2001:0200:0102:0000:0000:0000:0000:0000', '2001:0200:0135:0000:0000:0000:0000:0000', '2001:0200:017A:0000:0000:0000:0000:0000', '2404:6800:4001:c01::93', '::FFFF:8.8.8.8', '0000:0000:0000:0000:0000:FFFF:8.8.8.8', '::8.8.8.8.8'];
// testip = ['8.8.8.8', '2404:6800:4001:c01::93'];
testip = ['2001:0:4136:e378:8000:63bf:f7f7:f7f7', '2002:0803:2200::0803:2200'];

for (var x = 0; x < testip.length; x++) {
	result = ip2loc.IP2Location_get_all(testip[x]);
	for (var key in result) {
		console.log(key + ": " + result[key]);
	}
	// console.log(result);
	console.log("--------------------------------------------------------------");
}

ip2loc.IP2Location_close();