var ip2loc = require("ip2location-nodejs");

// for both IPv4 and IPv6
ip2loc.IP2Location_init("/root/testnodejs/db24.BIN", "/root/testnodejs/IPV6-COUNTRY.BIN");

// for IPv4 only
// ip2loc.IP2Location_init("/root/testnodejs/db24.BIN");

// for Ipv6 only
// ip2loc.IP2Location_init("", "/root/testnodejs/IPV6-COUNTRY.BIN");

testip = ['8.8.8.8', '2404:6800:4001:c01::67', '2001:0200:0102:0000:0000:0000:0000:0000', '2001:0200:0135:0000:0000:0000:0000:0000', '2001:0200:017A:0000:0000:0000:0000:0000'];
for (var x = 0; x < testip.length; x++) {
	result = ip2loc.IP2Location_get_all(testip[x]);
	for (var key in result) {
		console.log(key + ": " + result[key]);
	}
	// console.log(result);
	console.log("--------------------------------------------------------------");
}
