var net = require("net");
var fs = require("fs");
var bigInt = require("big-integer");

var fd;

var version = "8.4.0";
var binfile = "";
var IPv4ColumnSize = 0;
var IPv6ColumnSize = 0;
var low = 0;
var high = 0;
var mid = 0;

var maxindex = 65536;
var IndexArrayIPv4 = Array(maxindex);
var IndexArrayIPv6 = Array(maxindex);

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

var country_pos_offset = 0;
var region_pos_offset = 0;
var city_pos_offset = 0;
var isp_pos_offset = 0;
var domain_pos_offset = 0;
var zipcode_pos_offset = 0;
var latitude_pos_offset = 0;
var longitude_pos_offset = 0;
var timezone_pos_offset = 0;
var netspeed_pos_offset = 0;
var iddcode_pos_offset = 0;
var areacode_pos_offset = 0;
var weatherstationcode_pos_offset = 0;
var weatherstationname_pos_offset = 0;
var mcc_pos_offset = 0;
var mnc_pos_offset = 0;
var mobilebrand_pos_offset = 0;
var elevation_pos_offset = 0;
var usagetype_pos_offset = 0;

var country_enabled = 0;
var region_enabled = 0;
var city_enabled = 0;
var isp_enabled = 0;
var domain_enabled = 0;
var zipcode_enabled = 0;
var latitude_enabled = 0;
var longitude_enabled = 0;
var timezone_enabled = 0;
var netspeed_enabled = 0;
var iddcode_enabled = 0;
var areacode_enabled = 0;
var weatherstationcode_enabled = 0;
var weatherstationname_enabled = 0;
var mcc_enabled = 0;
var mnc_enabled = 0;
var mobilebrand_enabled = 0;
var elevation_enabled = 0;
var usagetype_enabled = 0;

var MAX_IPV4_RANGE = bigInt(4294967295);
var MAX_IPV6_RANGE = bigInt("340282366920938463463374607431768211455");
var FROM_6TO4 = bigInt("42545680458834377588178886921629466624");
var TO_6TO4 = bigInt("42550872755692912415807417417958686719");
var FROM_TEREDO = bigInt("42540488161975842760550356425300246528");
var TO_TEREDO = bigInt("42540488241204005274814694018844196863");
var LAST_32BITS = bigInt("4294967295");

var mydb = {
	"_DBType": 0,
	"_DBColumn": 0,
	"_DBYear": 0,
	"_DBMonth": 0,
	"_DBDay": 0,
	"_DBCount": 0,
	"_BaseAddr": 0,
	"_DBCountIPv6": 0,
	"_BaseAddrIPv6": 0,
	"_OldBIN": 0,
	"_Indexed": 0,
	"_IndexedIPv6": 0,
	"_IndexBaseAddr": 0,
	"_IndexBaseAddrIPv6": 0
};

// Read row data
function readrow(readbytes, pos) {
	var buff = new Buffer.alloc(readbytes);
	totalread = fs.readSync(fd, buff, 0, readbytes, pos - 1);
	return buff;
}

// Read binary data
function readbin(readbytes, pos, readtype, isbigint) {
	var buff = new Buffer.alloc(readbytes);
	totalread = fs.readSync(fd, buff, 0, readbytes, pos);
	
	if (totalread == readbytes) {
		switch (readtype) {
			case "int8":
				return buff.readUInt8(0);
				break;
			case "int32":
				return buff.readInt32LE(0);
				break;
			case "uint32":
				return (isbigint) ? bigInt(buff.readUInt32LE(0)) : buff.readUInt32LE(0);
				break;
			case "float":
				return buff.readFloatLE(0);
				break;
			case "str":
				return buff.toString("utf8");
				break;
			case "int128":
				var mybig = bigInt(); // zero
				var bitshift = 8;
				for (var x = 0; x < 16; x++) {
					mybig = mybig.add(bigInt(buff.readUInt8(x)).shiftLeft(bitshift * x));
				}
				return mybig;
				break;
		}
	}
	else {
		return 0;
	}
}

// Read 8 bits integer in the database
function read8(pos) {
	readbytes = 1;
	return readbin(readbytes, pos - 1, "int8");
}

// Read 32 bits integer in the database
function read32(pos, isbigint) {
	readbytes = 4;
	return readbin(readbytes, pos - 1, "uint32", isbigint);
}

// Read 32 bits integer in the buffer
function read32_row(pos, buff) {
	return buff.readUInt32LE(pos);
}

// Read 32 bits float in the database
function readfloat(pos) {
	readbytes = 4;
	return readbin(readbytes, pos - 1, "float");
}

// Read 32 bits float in the buffer
function readfloat_row(pos, buff) {
	return buff.readFloatLE(pos);
}

function read32or128(pos, iptype) {
	if (iptype == 4) {
		return read32(pos, true); // should be bigInt here already
	}
	else if (iptype == 6) {
		return read128(pos); // only IPv6 will run this; already returning bigInt object
	}
	else {
		return 0;
	}
}

// Read 128 bits integer in the database
function read128(pos) {
	readbytes = 16;
	return readbin(readbytes, pos - 1, "int128"); // returning bigInt object
}

// Read strings in the database
function readstr(pos) {
	readbytes = 1;
	return readbin(readbin(readbytes, pos, "int8"), pos + 1, "str");
}

function dot2num(IPv4) {
	var d = IPv4.split('.');
	return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
}

function ip2no(IPv6) {
	var maxsections = 8; // should have 8 sections
	var sectionbits = 16; // 16 bits per section
	var m = IPv6.split('::');
	
	var total = bigInt(); // zero
	
	if (m.length == 2) {
		var myarrleft = (m[0] != '') ? m[0].split(":") : [];
		var myarrright = (m[1] != '') ? m[1].split(":") : [];
		var myarrmid = maxsections - myarrleft.length - myarrright.length;
		
		for (var x = 0; x < myarrleft.length; x++) {
			total = total.add(bigInt(parseInt("0x" + myarrleft[x])).shiftLeft((maxsections - (x + 1)) * sectionbits));
		}
		
		for (var x = 0; x < myarrright.length; x++) {
			total = total.add(bigInt(parseInt("0x" + myarrright[x])).shiftLeft((myarrright.length - (x + 1)) * sectionbits));
		}
	}
	else if (m.length == 1) {
		var myarr = m[0].split(":");
		
		for (var x = 0; x < myarr.length; x++) {
			total = total.add(bigInt(parseInt("0x" + myarr[x])).shiftLeft((maxsections - (x + 1)) * sectionbits));
		}
	}
	
	return total;
}

exports.IP2Location_init = function IP2Location_init(binpath) {
	binfile = binpath;
	
	if (binfile && (binfile != "")) {
		fd = fs.openSync(binfile, 'r');
		
		mydb._DBType = read8(1);
		mydb._DBColumn = read8(2);
		mydb._DBYear = read8(3);
		mydb._DBMonth = read8(4);
		mydb._DBDay = read8(5);
		mydb._DBCount = read32(6);
		mydb._BaseAddr = read32(10);
		mydb._DBCountIPv6 = read32(14);
		mydb._BaseAddrIPv6 = read32(18);
		mydb._IndexBaseAddr = read32(22);
		mydb._IndexBaseAddrIPv6 = read32(26);
		
		if (mydb._IndexBaseAddr > 0) {
			mydb._Indexed = 1;
		}
		
		if (mydb._DBCountIPv6 == 0) {
			mydb._OldBIN = 1;
		}
		else if (mydb._IndexBaseAddrIPv6 > 0) {
			mydb._IndexedIPv6 = 1;
		}
		
		IPv4ColumnSize = mydb._DBColumn << 2; // 4 bytes each column
		IPv6ColumnSize = 16 + ((mydb._DBColumn - 1) << 2); // 4 bytes each column, except IPFrom column which is 16 bytes
		
		var dbt = mydb._DBType;
		
		// since both IPv4 and IPv6 use 4 bytes for the below columns, can just do it once here
		// country_pos_offset = (country_pos[dbt] != 0) ? (country_pos[dbt] - 1) << 2 : 0;
		// region_pos_offset = (region_pos[dbt] != 0) ? (region_pos[dbt] - 1) << 2 : 0;
		// city_pos_offset = (city_pos[dbt] != 0) ? (city_pos[dbt] - 1) << 2 : 0;
		// isp_pos_offset = (isp_pos[dbt] != 0) ? (isp_pos[dbt] - 1) << 2 : 0;
		// domain_pos_offset = (domain_pos[dbt] != 0) ? (domain_pos[dbt] - 1) << 2 : 0;
		// zipcode_pos_offset = (zipcode_pos[dbt] != 0) ? (zipcode_pos[dbt] - 1) << 2 : 0;
		// latitude_pos_offset = (latitude_pos[dbt] != 0) ? (latitude_pos[dbt] - 1) << 2 : 0;
		// longitude_pos_offset = (longitude_pos[dbt] != 0) ? (longitude_pos[dbt] - 1) << 2 : 0;
		// timezone_pos_offset = (timezone_pos[dbt] != 0) ? (timezone_pos[dbt] - 1) << 2 : 0;
		// netspeed_pos_offset = (netspeed_pos[dbt] != 0) ? (netspeed_pos[dbt] - 1) << 2 : 0;
		// iddcode_pos_offset = (iddcode_pos[dbt] != 0) ? (iddcode_pos[dbt] - 1) << 2 : 0;
		// areacode_pos_offset = (areacode_pos[dbt] != 0) ? (areacode_pos[dbt] - 1) << 2 : 0;
		// weatherstationcode_pos_offset = (weatherstationcode_pos[dbt] != 0) ? (weatherstationcode_pos[dbt] - 1) << 2 : 0;
		// weatherstationname_pos_offset = (weatherstationname_pos[dbt] != 0) ? (weatherstationname_pos[dbt] - 1) << 2 : 0;
		// mcc_pos_offset = (mcc_pos[dbt] != 0) ? (mcc_pos[dbt] - 1) << 2 : 0;
		// mnc_pos_offset = (mnc_pos[dbt] != 0) ? (mnc_pos[dbt] - 1) << 2 : 0;
		// mobilebrand_pos_offset = (mobilebrand_pos[dbt] != 0) ? (mobilebrand_pos[dbt] - 1) << 2 : 0;
		// elevation_pos_offset = (elevation_pos[dbt] != 0) ? (elevation_pos[dbt] - 1) << 2 : 0;
		// usagetype_pos_offset = (usagetype_pos[dbt] != 0) ? (usagetype_pos[dbt] - 1) << 2 : 0;
		
		// slightly different offset for reading by row
		country_pos_offset = (country_pos[dbt] != 0) ? (country_pos[dbt] - 2) << 2 : 0;
		region_pos_offset = (region_pos[dbt] != 0) ? (region_pos[dbt] - 2) << 2 : 0;
		city_pos_offset = (city_pos[dbt] != 0) ? (city_pos[dbt] - 2) << 2 : 0;
		isp_pos_offset = (isp_pos[dbt] != 0) ? (isp_pos[dbt] - 2) << 2 : 0;
		domain_pos_offset = (domain_pos[dbt] != 0) ? (domain_pos[dbt] - 2) << 2 : 0;
		zipcode_pos_offset = (zipcode_pos[dbt] != 0) ? (zipcode_pos[dbt] - 2) << 2 : 0;
		latitude_pos_offset = (latitude_pos[dbt] != 0) ? (latitude_pos[dbt] - 2) << 2 : 0;
		longitude_pos_offset = (longitude_pos[dbt] != 0) ? (longitude_pos[dbt] - 2) << 2 : 0;
		timezone_pos_offset = (timezone_pos[dbt] != 0) ? (timezone_pos[dbt] - 2) << 2 : 0;
		netspeed_pos_offset = (netspeed_pos[dbt] != 0) ? (netspeed_pos[dbt] - 2) << 2 : 0;
		iddcode_pos_offset = (iddcode_pos[dbt] != 0) ? (iddcode_pos[dbt] - 2) << 2 : 0;
		areacode_pos_offset = (areacode_pos[dbt] != 0) ? (areacode_pos[dbt] - 2) << 2 : 0;
		weatherstationcode_pos_offset = (weatherstationcode_pos[dbt] != 0) ? (weatherstationcode_pos[dbt] - 2) << 2 : 0;
		weatherstationname_pos_offset = (weatherstationname_pos[dbt] != 0) ? (weatherstationname_pos[dbt] - 2) << 2 : 0;
		mcc_pos_offset = (mcc_pos[dbt] != 0) ? (mcc_pos[dbt] - 2) << 2 : 0;
		mnc_pos_offset = (mnc_pos[dbt] != 0) ? (mnc_pos[dbt] - 2) << 2 : 0;
		mobilebrand_pos_offset = (mobilebrand_pos[dbt] != 0) ? (mobilebrand_pos[dbt] - 2) << 2 : 0;
		elevation_pos_offset = (elevation_pos[dbt] != 0) ? (elevation_pos[dbt] - 2) << 2 : 0;
		usagetype_pos_offset = (usagetype_pos[dbt] != 0) ? (usagetype_pos[dbt] - 2) << 2 : 0;
		
		country_enabled = (country_pos[dbt] != 0) ? 1 : 0;
		region_enabled = (region_pos[dbt] != 0) ? 1 : 0;
		city_enabled = (city_pos[dbt] != 0) ? 1 : 0;
		isp_enabled = (isp_pos[dbt] != 0) ? 1 : 0;
		latitude_enabled = (latitude_pos[dbt] != 0) ? 1 : 0;
		longitude_enabled = (longitude_pos[dbt] != 0) ? 1 : 0;
		domain_enabled = (domain_pos[dbt] != 0) ? 1 : 0;
		zipcode_enabled = (zipcode_pos[dbt] != 0) ? 1 : 0;
		timezone_enabled = (timezone_pos[dbt] != 0) ? 1 : 0;
		netspeed_enabled = (netspeed_pos[dbt] != 0) ? 1 : 0;
		iddcode_enabled = (iddcode_pos[dbt] != 0) ? 1 : 0;
		areacode_enabled = (areacode_pos[dbt] != 0) ? 1 : 0;
		weatherstationcode_enabled = (weatherstationcode_pos[dbt] != 0) ? 1 : 0;
		weatherstationname_enabled = (weatherstationname_pos[dbt] != 0) ? 1 : 0;
		mcc_enabled = (mcc_pos[dbt] != 0) ? 1 : 0;
		mnc_enabled = (mnc_pos[dbt] != 0) ? 1 : 0;
		mobilebrand_enabled = (mobilebrand_pos[dbt] != 0) ? 1 : 0;
		elevation_enabled = (elevation_pos[dbt] != 0) ? 1 : 0;
		usagetype_enabled = (usagetype_pos[dbt] != 0) ? 1 : 0;
		
		if (mydb._Indexed == 1) {
			var pointer = mydb._IndexBaseAddr;
			
			for (var x = 0; x < maxindex; x++) {
				IndexArrayIPv4[x] = Array(2);
				IndexArrayIPv4[x][0] = read32(pointer);
				IndexArrayIPv4[x][1] = read32(pointer + 4);
				pointer += 8;
			}
			
			if (mydb._IndexedIPv6 == 1) {
				for (var x = 0; x < maxindex; x++) {
					IndexArrayIPv6[x] = Array(2);
					IndexArrayIPv6[x][0] = read32(pointer);
					IndexArrayIPv6[x][1] = read32(pointer + 4);
					pointer += 8;
				}
			}
		}
	}
}

exports.IP2Location_close = function IP2Location_close() {
	binfile = "";
	try {
		fs.closeSync(fd);
	}
	catch (err) {
		// do nothing
	}
	mydb._DBType = 0;
	mydb._DBColumn = 0;
	mydb._DBYear = 0;
	mydb._DBMonth = 0;
	mydb._DBDay = 0;
	mydb._DBCount = 0;
	mydb._BaseAddr = 0;
	mydb._DBCountIPv6 = 0;
	mydb._BaseAddrIPv6 = 0;
	mydb._OldBIN = 0;
	mydb._Indexed = 0;
	mydb._IndexedIPv6 = 0;
	mydb._IndexBaseAddr = 0;
	mydb._IndexBaseAddrIPv6 = 0;
}

function IP2Location_query(myIP, iptype, data) {
	_DBType = mydb._DBType;
	_DBColumn = mydb._DBColumn;
	low = 0;
	mid = 0;
	high = 0;
	var MAX_IP_RANGE = bigInt();
	
	if (iptype == 4) { // IPv4
		MAX_IP_RANGE = MAX_IPV4_RANGE;
		high = mydb._DBCount;
		_BaseAddr = mydb._BaseAddr;
		_ColumnSize = IPv4ColumnSize;
		ipnum = dot2num(myIP);
		
		if (mydb._Indexed == 1) {
			indexaddr = ipnum >>> 16;
			low = IndexArrayIPv4[indexaddr][0];
			high = IndexArrayIPv4[indexaddr][1];
		}
	}
	else if (iptype == 6) { // IPv6
		MAX_IP_RANGE = MAX_IPV6_RANGE;
		high = mydb._DBCountIPv6;
		_BaseAddr = mydb._BaseAddrIPv6;
		_ColumnSize = IPv6ColumnSize;
		ipnum = ip2no(myIP);
		
		if ((ipnum.geq(FROM_6TO4) && ipnum.leq(TO_6TO4)) || (ipnum.geq(FROM_TEREDO) && ipnum.leq(TO_TEREDO))) {
			iptype = 4;
			MAX_IP_RANGE = MAX_IPV4_RANGE;
			high = mydb._DBCount;
			_BaseAddr = mydb._BaseAddr;
			_ColumnSize = IPv4ColumnSize;
			
			if (ipnum.geq(FROM_6TO4) && ipnum.leq(TO_6TO4)) {
				ipnum = ipnum.shiftRight(80).and(LAST_32BITS).toJSNumber();
			}
			else {
				ipnum = ipnum.not().and(LAST_32BITS).toJSNumber();
			}
			if (mydb._Indexed == 1) {
				indexaddr = ipnum >>> 16;
				low = IndexArrayIPv4[indexaddr][0];
				high = IndexArrayIPv4[indexaddr][1];
			}
		}
		else {
			if (mydb._IndexedIPv6 == 1) {
				indexaddr = ipnum.shiftRight(112).toJSNumber();
				low = IndexArrayIPv6[indexaddr][0];
				high = IndexArrayIPv6[indexaddr][1];
			}
		}
	}
	
	MSG_NOT_SUPPORTED = "This method is not applicable for current IP2Location binary data file. Please upgrade your subscription package to install new data file.";
	
	data.ip = myIP;
	ipnum = bigInt(ipnum);
	
	if (ipnum.geq(MAX_IP_RANGE)) {
		ipnum = MAX_IP_RANGE.minus(1);
	}
	
	data.ip_no = ipnum.toString();
	
	while (low <= high) {
		mid = parseInt((low + high) / 2);
		rowoffset = _BaseAddr + (mid * _ColumnSize)
		rowoffset2 = rowoffset + _ColumnSize
		
		var ipfrom = read32or128(rowoffset, iptype);
		var ipto = read32or128(rowoffset2, iptype);
		
		ipfrom = bigInt(ipfrom);
		ipto = bigInt(ipto);
		
		if (ipfrom.leq(ipnum) && ipto.gt(ipnum)) {
			for (var key in data) {
				if (/^(ip|ip_no|latitude|longitude|elevation)$/i.test(key) === false) {
					data[key] = MSG_NOT_SUPPORTED;
				}
				else if (/^(ip|ip_no)$/i.test(key) === false) {
					data[key] = 0;
				}
			}
			
			var firstcol = 4;
			if (iptype == 6) { // IPv6
				firstcol = 16;
				// rowoffset = rowoffset + 12; // coz below is assuming all columns are 4 bytes, so got 12 left to go to make 16 bytes total
			}
			
			var row = readrow(_ColumnSize - firstcol, rowoffset + firstcol);
			
			if (country_enabled) {
				// countrypos = read32(rowoffset + country_pos_offset);
				countrypos = read32_row(country_pos_offset, row);
				data.country_short = readstr(countrypos);
				data.country_long = readstr(countrypos + 3);
			}
			if (region_enabled) {
				// data.region = readstr(read32(rowoffset + region_pos_offset));
				data.region = readstr(read32_row(region_pos_offset, row));
			}
			if (city_enabled) {
				// data.city = readstr(read32(rowoffset + city_pos_offset));
				data.city = readstr(read32_row(city_pos_offset, row));
			}
			if (isp_enabled) {
				// data.isp = readstr(read32(rowoffset + isp_pos_offset));
				data.isp = readstr(read32_row(isp_pos_offset, row));
			}
			if (domain_enabled) {
				// data.domain = readstr(read32(rowoffset + domain_pos_offset));
				data.domain = readstr(read32_row(domain_pos_offset, row));
			}
			if (zipcode_enabled) {
				// data.zipcode = readstr(read32(rowoffset + zipcode_pos_offset));
				data.zipcode = readstr(read32_row(zipcode_pos_offset, row));
			}
			if (latitude_enabled) {
				// data.latitude = Math.round(readfloat(rowoffset + latitude_pos_offset) * 1000000, 6) / 1000000;
				data.latitude = Math.round(readfloat_row(latitude_pos_offset, row) * 1000000, 6) / 1000000;
			}
			if (longitude_enabled) {
				// data.longitude = Math.round(readfloat(rowoffset + longitude_pos_offset) * 1000000, 6) / 1000000;
				data.longitude = Math.round(readfloat_row(longitude_pos_offset, row) * 1000000, 6) / 1000000;
			}
			if (timezone_enabled) {
				// data.timezone = readstr(read32(rowoffset + timezone_pos_offset));
				data.timezone = readstr(read32_row(timezone_pos_offset, row));
			}
			if (netspeed_enabled) {
				// data.netspeed = readstr(read32(rowoffset + netspeed_pos_offset));
				data.netspeed = readstr(read32_row(netspeed_pos_offset, row));
			}
			if (iddcode_enabled) {
				// data.iddcode = readstr(read32(rowoffset + iddcode_pos_offset));
				data.iddcode = readstr(read32_row(iddcode_pos_offset, row));
			}
			if (areacode_enabled) {
				// data.areacode = readstr(read32(rowoffset + areacode_pos_offset));
				data.areacode = readstr(read32_row(areacode_pos_offset, row));
			}
			if (weatherstationcode_enabled) {
				// data.weatherstationcode = readstr(read32(rowoffset + weatherstationcode_pos_offset));
				data.weatherstationcode = readstr(read32_row(weatherstationcode_pos_offset, row));
			}
			if (weatherstationname_enabled) {
				// data.weatherstationname = readstr(read32(rowoffset + weatherstationname_pos_offset));
				data.weatherstationname = readstr(read32_row(weatherstationname_pos_offset, row));
			}
			if (mcc_enabled) {
				// data.mcc = readstr(read32(rowoffset + mcc_pos_offset));
				data.mcc = readstr(read32_row(mcc_pos_offset, row));
			}
			if (mnc_enabled) {
				// data.mnc = readstr(read32(rowoffset + mnc_pos_offset));
				data.mnc = readstr(read32_row(mnc_pos_offset, row));
			}
			if (mobilebrand_enabled) {
				// data.mobilebrand = readstr(read32(rowoffset + mobilebrand_pos_offset));
				data.mobilebrand = readstr(read32_row(mobilebrand_pos_offset, row));
			}
			if (elevation_enabled) {
				// data.elevation = readstr(read32(rowoffset + elevation_pos_offset));
				data.elevation = readstr(read32_row(elevation_pos_offset, row));
			}
			if (usagetype_enabled) {
				// data.usagetype = readstr(read32(rowoffset + usagetype_pos_offset));
				data.usagetype = readstr(read32_row(usagetype_pos_offset, row));
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
		"country_long": "?",
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
	
	if (/^[:0]+:F{4}:(\d+\.){3}\d+$/i.test(myIP)) {
		myIP = myIP.replace(/^[:0]+:F{4}:/i, '');
	}
	else if (/^[:0]+F{4}(:[\dA-Z]{4}){2}$/i.test(myIP)) {
		tmp = myIP.replace(/^[:0]+F{4}:/i, '');
		tmp = tmp.replace(/:/, '');
		tmparr = [];
		for (var x = 0; x < 8; x = x + 2) {
			tmparr.push(parseInt("0x" + tmp.substring(x, x + 2)));
		}
		myIP = tmparr.join('.');
	}
	iptype = net.isIP(myIP);
	
	if (iptype == 0) {
		data.status = "INVALID_IP_ADDRESS";
		return data;
	}
	else if ((!binfile) || (binfile == "") || (!fs.existsSync(binfile))) {
		data.status = "MISSING_FILE";
		return data;
	}
	else if (mydb._DBType == 0) {
		data.status = "RUN_INIT_FIRST";
		return data;
	}
	else if ((iptype == 6) && (mydb._OldBIN == 1)) {
		data.status = "IPV6_NOT_SUPPORTED";
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

