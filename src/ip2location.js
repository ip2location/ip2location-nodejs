var net = require("net");
var fs = require("fs");
var bignum = require("bignum");

var version = "6.0";
var fileIPv4 = "";
var fileIPv6 = "";

var low = 0;
var high = 0;
var mid = 0;

var country_pos = [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
var region_pos = [0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
var city_pos = [0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
var isp_pos = [0, 0, 3, 0, 5, 0, 7, 5, 7, 0, 8, 0, 9, 0, 9, 0, 9, 0, 9, 7, 9, 0, 9, 7, 9];
var latitude_pos = [0, 0, 0, 0, 0, 5, 5, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
var longitude_pos = [0, 0, 0, 0, 0, 6, 6, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6];
var domain_pos = [0, 0, 0, 0, 0, 0, 0, 6, 8, 0, 9, 0, 10, 0, 10, 0, 10, 0, 10, 8, 10, 0, 10, 8, 10];
var zipcode_pos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 7, 7, 7, 0, 7, 0, 7, 7, 7, 0, 7];
var timezone_pos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 7, 8, 8, 8, 7, 8, 0, 8, 8, 8, 0, 8];
var netspeed_pos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 11, 0, 11, 8, 11, 0, 11, 0, 11, 0, 11];
var iddcode_pos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 12, 0, 12, 0, 12, 9, 12, 0, 12];
var areacode_pos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 13, 0, 13, 0, 13, 10, 13, 0, 13];
var weatherstationcode_pos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 14, 0, 14, 0, 14, 0, 14];
var weatherstationname_pos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 15, 0, 15, 0, 15, 0, 15];
var mcc_pos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 16, 0, 16, 9, 16];
var mnc_pos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 17, 0, 17, 10, 17];
var mobilebrand_pos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 18, 0, 18, 11, 18];
var elevation_pos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 19, 0, 19];
var usagetype_pos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 20];

var mydb_IPv4 = {
  "_DBType": 0,
	"_DBColumn": 0,
	"_DBYear": 0,
	"_DBMonth": 0,
	"_DBDay": 0,
	"_DBCount": 0,
	"_BaseAddr": 0
};

var mydb_IPv6 = {
	"_DBType": 0,
	"_DBColumn": 0,
	"_DBYear": 0,
	"_DBMonth": 0,
	"_DBDay": 0,
	"_DBCount": 0,
	"_BaseAddr": 0
};

// Read binary data
function readbin(binfile, readbytes, pos, readtype, isbigint) {
	var buff = new Buffer(readbytes);
	var fd = fs.openSync(binfile, 'r');
	totalread = fs.readSync(fd, buff, 0, readbytes, pos - 1);
	fs.closeSync(fd);
	
	if (totalread == readbytes) {
		switch (readtype) {
			case "int8":
				return buff.readInt8(0);
				break;
			case "int32":
				return buff.readInt32LE(0);
				break;
			case "uint32":
				return (isbigint) ? bignum.fromBuffer(buff, { endian: 'small', size: 'auto' }) : buff.readUInt32LE(0);
				break;
			case "float":
				return buff.readFloatLE(0);
				break;
			case "str":
				return buff.toString("utf8");
				break;
			case "int128":
				return bignum.fromBuffer(buff, { endian: 'small', size: 'auto' });
				break;
		}
	}
	else {
		return 0;
	}
}

// Read 8 bits integer in the database
function read8(pos, iptype) {
	binfile = "";
	readbytes = 1;
	
	if (iptype == 4) { // IPv4
		binfile = fileIPv4;
	}
	else if (iptype == 6) { // IPv6
		binfile = fileIPv6;
	}
	return readbin(binfile, readbytes, pos, "int8");
}

// Read 32 bits integer in the database
function read32(pos, iptype, isbigint) {
	binfile = "";
	readbytes = 4;
	
	if (iptype == 4) { // IPv4
		binfile = fileIPv4;
	}
	else if (iptype == 6) { // IPv6
		binfile = fileIPv6;
	}
	return readbin(binfile, readbytes, pos, "uint32", isbigint);
}

// Read 32 bits float in the database
function readfloat(pos, iptype) {
	binfile = "";
	readbytes = 4;
	
	if (iptype == 4) { // IPv4
		binfile = fileIPv4;
	}
	else if (iptype == 6) { // IPv6
		binfile = fileIPv6;
	}
	return readbin(binfile, readbytes, pos, "float");
}

function read32or128(pos, iptype) {
	if (iptype == 4) {
		return read32(pos, iptype, true); // should be bignum here already
	}
	else if (iptype == 6) {
		return read128(pos); // only IPv6 will run this; already returning bignum object
	}
	else {
		return 0;
	}
}

// Read 128 bits integer in the database
function read128(pos) {
	binfile = fileIPv6; // only IPv6 will call this function
	readbytes = 16;
	
	return readbin(binfile, readbytes, pos, "int128"); // returning bignum object
}

// Read strings in the database
function readstr(pos, iptype) {
	binfile = "";
	readbytes = 1;
	
	if (iptype == 4) { // IPv4
		binfile = fileIPv4;
	}
	else if (iptype == 6) { // IPv6
		binfile = fileIPv6;
	}
	
	return readbin(binfile, readbin(binfile, readbytes, pos + 1, "int8"), pos + 2, "str");
}

function dot2num(IPv4) {
	var d = IPv4.split('.');
	return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
}

function ip2no(IPv6) {
	var maxsections = 8; // should have 8 sections
	var sectionbits = 16; // 16 bits per section
	var m = IPv6.split('::');
	
	var total = bignum("0");
	
	if (m.length == 2) {
		var myarrleft = m[0].split(":");
		var myarrright = m[1].split(":");
		var myarrmid = maxsections - myarrleft.length - myarrright.length;
		
		for (var x = 0; x < myarrleft.length; x++) {
			total = total.add(bignum(parseInt("0x" + myarrleft[x]).toString()).shiftLeft((maxsections - (x + 1)) * sectionbits));
		}
		
		for (var x = 0; x < myarrright.length; x++) {
			total = total.add(bignum(parseInt("0x" + myarrright[x]).toString()).shiftLeft((myarrright.length - (x + 1)) * sectionbits));
		}
	}
	else if (m.length == 1) {
		var myarr = m[0].split(":");
		
		for (var x = 0; x < myarr.length; x++) {
			total = total.add(bignum(parseInt("0x" + myarr[x]).toString()).shiftLeft((maxsections - (x + 1)) * sectionbits));
		}
	}
	
	return total;
}

exports.IP2Location_init = function IP2Location_init(binpathIPv4, binpathIPv6) {
	fileIPv4 = binpathIPv4;
	fileIPv6 = binpathIPv6;
	
	if (fileIPv4 && (fileIPv4 != "")) {
		mydb_IPv4._DBType = read8(1, 4);
		mydb_IPv4._DBColumn = read8(2, 4);
		mydb_IPv4._DBYear = read8(3, 4);
		mydb_IPv4._DBMonth = read8(4, 4);
		mydb_IPv4._DBDay = read8(5, 4);
		mydb_IPv4._DBCount = read32(6, 4);
		mydb_IPv4._BaseAddr = read32(10, 4);
	}
	
	if (fileIPv6 && (fileIPv6 != "")) {
		mydb_IPv6._DBType = read8(1, 6);
		mydb_IPv6._DBColumn = read8(2, 6);
		mydb_IPv6._DBYear = read8(3, 6);
		mydb_IPv6._DBMonth = read8(4, 6);
		mydb_IPv6._DBDay = read8(5, 6);
		mydb_IPv6._DBCount = read32(6, 6);
		mydb_IPv6._BaseAddr = read32(10, 6);
	}
}

function IP2Location_query(myIP, iptype, data) {
	if (iptype == 4) { // IPv4
		binfile = fileIPv4;
		_DBType = mydb_IPv4._DBType;
		_DBColumn = mydb_IPv4._DBColumn;
		_DBCount = mydb_IPv4._DBCount;
		_BaseAddr = mydb_IPv4._BaseAddr;
		ipnum = dot2num(myIP);
	}
	else if (iptype == 6) { // IPv6
		binfile = fileIPv6;
		_DBType = mydb_IPv6._DBType;
		_DBColumn = mydb_IPv6._DBColumn;
		_DBCount = mydb_IPv6._DBCount;
		_BaseAddr = mydb_IPv6._BaseAddr;
		ipnum = ip2no(myIP);
	}
	
	MSG_NOT_SUPPORTED = "This method is not applicable for current IP2Location binary data file. Please upgrade your subscription package to install new data file.";
	low = 0;
	mid = 0;
	high = _DBCount;
	
	data.ip = myIP;
	data.ip_no = (ipnum instanceof bignum) ? ipnum.toString() : ipnum;
	
	while (low <= high) {
		mid = parseInt((low + high) / 2);
		
		switch (iptype) {
			case 4:
				rowoffset = _BaseAddr + (mid * _DBColumn * 4); // 4 bytes in each column
				rowoffset2 = _BaseAddr + ((mid + 1) * _DBColumn * 4); // 4 bytes in each column
				break;
			case 6:
				rowoffset = _BaseAddr + (mid * (16 + ((_DBColumn - 1) * 4))); // IPFrom is 16 bytes, the rest 4 bytes
				rowoffset2 = _BaseAddr + ((mid + 1) * (16 + ((_DBColumn - 1) * 4))); // IPFrom is 16 bytes, the rest 4 bytes
		}

		var ipfrom = read32or128(rowoffset, iptype);
		var ipto = read32or128(rowoffset2, iptype);
		
		if (ipfrom.le(ipnum) && ipto.gt(ipnum)) {
			for (var key in data) {
				if (/^(ip|ip_no|latitude|longitude|elevation)$/i.test(key) === false) {
					data[key] = MSG_NOT_SUPPORTED;
				}
				else if (/^(ip|ip_no)$/i.test(key) === false) {
					data[key] = 0;
				}
			}
			
			if (iptype == 6) { // IPv6
				rowoffset = rowoffset + 12; // coz below is assuming all columns are 4 bytes, so got 12 left to go to make 16 bytes total
			}

			if (country_pos[_DBType] != 0) {
				data.country_short = readstr(read32(rowoffset + 4 * (country_pos[_DBType] - 1), iptype), iptype)
				data.country_long = readstr(read32(rowoffset + 4 * (country_pos[_DBType] - 1), iptype) + 3, iptype)
			}
			if (region_pos[_DBType] != 0) {
				data.region = readstr(read32(rowoffset + 4 * (region_pos[_DBType] - 1), iptype), iptype)
			}
			if (city_pos[_DBType] != 0) {
				data.city = readstr(read32(rowoffset + 4 * (city_pos[_DBType] - 1), iptype), iptype)
			}
			if (isp_pos[_DBType] != 0) {
				data.isp = readstr(read32(rowoffset + 4 * (isp_pos[_DBType] - 1), iptype), iptype)
			}
			if (domain_pos[_DBType] != 0) {
				data.domain = readstr(read32(rowoffset + 4 * (domain_pos[_DBType] - 1), iptype), iptype)
			}
			if (zipcode_pos[_DBType] != 0) {
				data.zipcode = readstr(read32(rowoffset + 4 * (zipcode_pos[_DBType] - 1), iptype), iptype)
			}
			if (latitude_pos[_DBType] != 0) {
				data.latitude = readfloat(rowoffset + 4 * (latitude_pos[_DBType] - 1), iptype)
			}
			if (longitude_pos[_DBType] != 0) {
				data.longitude = readfloat(rowoffset + 4 * (longitude_pos[_DBType] - 1), iptype)
			}
			if (timezone_pos[_DBType] != 0) {
				data.timezone = readstr(read32(rowoffset + 4 * (timezone_pos[_DBType] - 1), iptype), iptype)
			}
			if (netspeed_pos[_DBType] != 0) {
				data.netspeed = readstr(read32(rowoffset + 4 * (netspeed_pos[_DBType] - 1), iptype), iptype)
			}
			if (iddcode_pos[_DBType] != 0) {
				data.iddcode = readstr(read32(rowoffset + 4 * (iddcode_pos[_DBType] - 1), iptype), iptype)
			}
			if (areacode_pos[_DBType] != 0) {
				data.areacode = readstr(read32(rowoffset + 4 * (areacode_pos[_DBType] - 1), iptype), iptype)
			}
			if (weatherstationcode_pos[_DBType] != 0) {
				data.weatherstationcode = readstr(read32(rowoffset + 4 * (weatherstationcode_pos[_DBType] - 1), iptype), iptype)
			}
			if (weatherstationname_pos[_DBType] != 0) {
				data.weatherstationname = readstr(read32(rowoffset + 4 * (weatherstationname_pos[_DBType] - 1), iptype), iptype)
			}
			if (mcc_pos[_DBType] != 0) {
				data.mcc = readstr(read32(rowoffset + 4 * (mcc_pos[_DBType] - 1), iptype), iptype)
			}
			if (mnc_pos[_DBType] != 0) {
				data.mnc = readstr(read32(rowoffset + 4 * (mnc_pos[_DBType] - 1), iptype), iptype)
			}
			if (mobilebrand_pos[_DBType] != 0) {
				data.mobilebrand = readstr(read32(rowoffset + 4 * (mobilebrand_pos[_DBType] - 1), iptype), iptype)
			}
			if (elevation_pos[_DBType] != 0) {
				data.elevation = readstr(read32(rowoffset + 4 * (elevation_pos[_DBType] - 1), iptype), iptype)
			}
			if (usagetype_pos[_DBType] != 0) {
				data.usagetype = readstr(read32(rowoffset + 4 * (usagetype_pos[_DBType] - 1), iptype), iptype)
			}
			data.status = "OK";
			return;
		}
		else {
			if (ipfrom.gt(ipnum)) {
				high = mid - 1;
			}
			else {
				low = mid + 1;
			}
		}
	}
	data.status = "IP_ADDRESS_NOT_FOUND";
}

exports.IP2Location_get_all = function IP2Location_get_all(myIP) {
	var data = {
		"ip": "?",
		"ip_no": "?",
		"country_short": "?",
		"country_short": "?",
		"region": "?",
		"city": "?",
		"isp": "?",
		"latitude": "?",
		"longitude": "?",
		"domain": "?",
		"zipcode": "?",
		"timezone": "?",
		"netspeed": "?",
		"iddcode": "?",
		"areacode": "?",
		"weatherstationcode": "?",
		"weatherstationname": "?",
		"mcc": "?",
		"mnc": "?",
		"mobilebrand": "?",
		"elevation": "?",
		"usagetype": "?",
		"status": "?"
	};
	
	iptype = net.isIP(myIP);
	
	if (iptype == 0) {
		data.status = "INVALID_IP_ADDRESS";
		return data;
	}
	else if ((iptype == 4) && ((!fileIPv4) || (fileIPv4 == "") || (!fs.existsSync(fileIPv4)))) {
		data.status = "MISSING_FILE";
		return data;
	}
	else if ((iptype == 4) && (mydb_IPv4._DBType == 0)) {
		data.status = "RUN_INIT_FIRST";
		return data;
	}
	else if ((iptype == 6) && ((!fileIPv6) || (fileIPv6 == "") || (!fs.existsSync(fileIPv6)))) {
		data.status = "MISSING_FILE";
		return data;
	}
	else if ((iptype == 6) && (mydb_IPv6._DBType == 0)) {
		data.status = "RUN_INIT_FIRST";
		return data;
	}
	else {
		IP2Location_query(myIP, iptype, data);
		return data;
	}
}

exports.IP2Location_get_country_short = function IP2Location_get_country_short(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.country_short;
}

exports.IP2Location_get_country_long = function IP2Location_get_country_long(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.country_long;
}

exports.IP2Location_get_region = function IP2Location_get_region(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.region;
}

exports.IP2Location_get_city = function IP2Location_get_city(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.city;
}

exports.IP2Location_get_isp = function IP2Location_get_isp(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.isp;
}

exports.IP2Location_get_latitude = function IP2Location_get_latitude(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.latitude;
}

exports.IP2Location_get_longitude = function IP2Location_get_longitude(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.longitude;
}

exports.IP2Location_get_domain = function IP2Location_get_domain(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.domain;
}

exports.IP2Location_get_zipcode = function IP2Location_get_zipcode(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.zipcode;
}

exports.IP2Location_get_timezone = function IP2Location_get_timezone(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.timezone;
}

exports.IP2Location_get_netspeed = function IP2Location_get_netspeed(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.netspeed;
}

exports.IP2Location_get_iddcode = function IP2Location_get_iddcode(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.iddcode;
}

exports.IP2Location_get_areacode = function IP2Location_get_areacode(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.areacode;
}

exports.IP2Location_get_weatherstationcode = function IP2Location_get_weatherstationcode(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.weatherstationcode;
}

exports.IP2Location_get_weatherstationname = function IP2Location_get_weatherstationname(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.weatherstationname;
}

exports.IP2Location_get_mcc = function IP2Location_get_mcc(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.mcc;
}

exports.IP2Location_get_mnc = function IP2Location_get_mnc(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.mnc;
}

exports.IP2Location_get_mobilebrand = function IP2Location_get_mobilebrand(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.mobilebrand;
}

exports.IP2Location_get_elevation = function IP2Location_get_elevation(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.elevation;
}

exports.IP2Location_get_usagetype = function IP2Location_get_usagetype(myIP) {
	data = this.IP2Location_get_all(myIP);
	return data.usagetype;
}

