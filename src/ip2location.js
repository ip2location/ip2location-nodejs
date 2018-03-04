//package ip2location-nodejs
const {isIP} = require('net');
const fs = require('fs');
const bigInt = require('big-integer');

const dot2num = IPv4 => {
    let [a,b,c,d] = IPv4.split('.');
    return (parseInt(a)<<24|parseInt(b)<<16|parseInt(c)<<8|parseInt(d))>>>0;
};
const ip2no = IPv6 => {
    let max_sections = 8; // 8 blocks
    let hex = IPv6
        .split(':')
        .map((block, index, arr)=>{
            return block.length === 0?'0000'.repeat(max_sections - (arr.length - 1)):('000' + block).substr(-4)
        })
        .join('');
    return bigInt(hex, 16);
};
const pos = {
    areacode:           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10,13, 0,13, 0,13,10,13, 0,13],
    city:               [0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    country:            [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    domain:             [0, 0, 0, 0, 0, 0, 0, 6, 8, 0, 9, 0,10, 0,10, 0,10, 0,10, 8,10, 0,10, 8,10],
    elevation:          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11,19, 0,19],
    iddcode:            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9,12, 0,12, 0,12, 9,12, 0,12],
    isp:                [0, 0, 3, 0, 5, 0, 7, 5, 7, 0, 8, 0, 9, 0, 9, 0, 9, 0, 9, 7, 9, 0, 9, 7, 9],
    latitude:           [0, 0, 0, 0, 0, 5, 5, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    mcc:                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9,16, 0,16, 9,16],
    mnc:                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10,17, 0,17,10,17],
    mobilebrand:        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11,18, 0,18,11,18],
    netspeed:           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,11, 0,11, 8,11, 0,11, 0,11, 0,11],
    region:             [0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    timezone:           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 7, 8, 8, 8, 7, 8, 0, 8, 8, 8, 0, 8],
    usagetype:          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,20],
    zipcode:            [0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 7, 7, 7, 0, 7, 0, 7, 7, 7, 0, 7],
    weatherstationcode: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9,14, 0,14, 0,14, 0,14],
    weatherstationname: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10,15, 0,15, 0,15, 0,15],
};
const max_index = 65536;
const MSG_NOT_SUPPORTED = "This method is not applicable for current IP2Location binary data file. Please upgrade your subscription package to install new data file.";

class IP2Location{
    constructor(binPath, message_not_supported = MSG_NOT_SUPPORTED) {
        this.IndexArrayIPv4 = Array(max_index);
        this.IndexArrayIPv6 = Array(max_index);

        this.fd = fs.openSync(binPath, 'r');
        this.message_not_supported = message_not_supported;
        this.mydb = {
            DBType: this._read_8(1),
            DBColumn: this._read_8(2),
            DBYear: this._read_8(3),
            DBMonth: this._read_8(4),
            DBDay: this._read_8(5),
            DBCount: this._read_32(6),
            BaseAddr: this._read_32(10),
            DBCountIPv6: this._read_32(14),
            BaseAddrIPv6: this._read_32(18),
            IndexBaseAddr: this._read_32(22),
            IndexBaseAddrIPv6: this._read_32(26),
        };

        if (this.mydb.IndexBaseAddr > 0) {
            this.mydb.Indexed = 1;
        }

        if (this.mydb.DBCountIPv6 === 0) {
            this.mydb.OldBIN = 1;
        }
        else if (this.mydb.IndexBaseAddrIPv6 > 0) {
            this.mydb.IndexedIPv6 = 1;
        }

        this.IPv4ColumnSize = this.mydb.DBColumn << 2; // 4 bytes each column
        this.IPv6ColumnSize = 16 + ((this.mydb.DBColumn - 1) << 2); // 4 bytes each column, except IPFrom column which is 16 bytes

        let dbt = this.mydb.DBType;

        // since both IPv4 and IPv6 use 4 bytes for the below columns, can just do it once here
        this.offset = {};
        Object.keys(pos).map(name=>{
            if (pos[name][dbt] === 0) return;
            this.offset[name] = (pos[name][dbt] - 1) << 2;
        });

        if (this.mydb.Indexed === 1) {
            let pointer = this.mydb.IndexBaseAddr;

            for (let x = 0; x < max_index; x ++) {
                this.IndexArrayIPv4[x] = [
                    this._read_32(pointer),
                    this._read_32(pointer + 4)
                ];
                pointer += 8;
            }

            if (this.mydb.IndexedIPv6 === 1) {
                for (let x = 0; x < max_index; x ++) {
                    this.IndexArrayIPv6[x] = [
                        this._read_32(pointer),
                        this._read_32(pointer + 4)
                    ];
                    pointer += 8;
                }
            }
        }
    }
    _read_bin(read_bytes, pos, read_type, is_bigInt) {
        let buff = new Buffer(read_bytes);
        let total_read = fs.readSync(this.fd, buff, 0, read_bytes, pos);
        if (total_read !== read_bytes) {
            return 0;
        }
        switch (read_type) {
            case 'int8':
                return buff.readUInt8(0);
            case 'int32':
                return buff.readInt32LE(0);
            case 'uint32':
                return is_bigInt ? bigInt(buff.readUInt32LE(0)) : buff.readUInt32LE(0);
            case 'float':
                return buff.readFloatLE(0);
            case 'str':
                return buff.toString('utf8');
            case 'int128':
                let my_big = bigInt();
                let bit_shift = 8;
                for (let x = 0; x < 16; x ++) {
                    my_big = my_big.add(bigInt(buff.readUInt8(x)).shiftLeft(bit_shift * x));
                }
                return my_big;
        }
    }
    // Read 8 bits integer in the database
    _read_8(pos) {
        return this._read_bin(1, pos - 1, 'int8');
    }
    // Read 32 bits integer in the database
    _read_32(pos, is_bigInt) {
        return this._read_bin(4, pos - 1, "uint32", is_bigInt);
    }
    // Read 32 bits float in the database
    _read_float(pos) {
        return this._read_bin(4, pos - 1, "float");
    }
    // Read 128 bits integer in the database
    _read_128(pos) {
        return this._read_bin(16, pos - 1, 'int128');
    }
    _read_32_or_128(pos, ip_type) {
        if (ip_type === 4) {
            return this._read_32(pos, true); // should be bigInt here already
        }
        else if (ip_type === 6) {
            return this._read_128(pos); // only IPv6 will run this; already returning bigInt object
        }
        else {
            return 0;
        }
    }
    // Read strings in the database
    _read_str(pos) {
        return this._read_bin(this._read_bin(1, pos, 'int8'), pos + 1, 'str');
    }

    IP2Location_query(my_ip, ip_type, data) {
        let low = 0, mid = 0, high = 0;
        let DBType, DBColumn, BaseAddr, ColumnSize, IndexAddr;
        let ip_num;
        // DBType = this.mydb.DBType;
        // DBColumn = this.mydb.DBColumn;
        if (ip_type === 4) { // IPv4
            high = this.mydb.DBCount;
            BaseAddr = this.mydb.BaseAddr;
            ColumnSize = this.IPv4ColumnSize;
            ip_num = dot2num(my_ip);

            if (this.mydb.Indexed === 1) {
                IndexAddr = ip_num >>> 16;
                low = this.IndexArrayIPv4[IndexAddr][0];
                high = this.IndexArrayIPv4[IndexAddr][1];
            }
        }
        else if (ip_type === 6) { // IPv6
            high = this.mydb.DBCountIPv6;
            BaseAddr = this.mydb.BaseAddrIPv6;
            ColumnSize = this.IPv6ColumnSize;
            ip_num = ip2no(my_ip);

            if (this.mydb.IndexedIPv6 === 1) {
                IndexAddr = ip_num.shiftRight(112).toJSNumber();
                low = this.IndexArrayIPv6[IndexAddr][0];
                high = this.IndexArrayIPv6[IndexAddr][1];
            }
        }

        data.ip = my_ip;
        ip_num = bigInt(ip_num);
        data.ip_no = ip_num.toString();

        while (low <= high) {
            mid = parseInt((low + high) / 2);
            let row_offset = BaseAddr + (mid * ColumnSize);
            let row_offset2 = row_offset + ColumnSize;

            let ip_from = this._read_32_or_128(row_offset, ip_type);
            let ip_to = this._read_32_or_128(row_offset2, ip_type);

            ip_from = bigInt(ip_from);
            ip_to = bigInt(ip_to);

            if (ip_from.leq(ip_num) && ip_to.gt(ip_num)) {
                Object.keys(data).forEach(key => {
                    if (/^(ip|ip_no|latitude|longitude|elevation)$/i.test(key) === false) {
                        data[key] = this.message_not_supported;
                    }
                    else if (/^(ip|ip_no)$/i.test(key) === false) {
                        data[key] = 0;
                    }
                });

                if (ip_type === 6) {// IPv6
                    row_offset = row_offset + 12;
                }

                if (this.offset.country != null) {
                    let country_pos = this._read_32(row_offset + this.offset.country);
                    data.country_short = this._read_str(country_pos);
                    data.country_long = this._read_str(country_pos + 3);
                }
                [
                    'region',
                    'city',
                    'isp',
                    'domain',
                    'zipcode',
                    'timezone',
                    'netspeed',
                    'iddcode',
                    'areacode',
                    'weatherstationcode',
                    'weatherstationname',
                    'mcc',
                    'mnc',
                    'mobilebrand',
                    'elevation',
                    'usagetype',
                ]
                    .forEach(name => {
                        if (this.offset[name] == null) return;
                        data[name] = this._read_str(this._read_32(row_offset + this.offset[name]));
                    });
                [
                    'latitude', 'longitude'
                ]
                    .forEach(name => {
                        if (this.offset[name] == null) return;
                        data[name] = Math.round(this._read_float(row_offset + this.offset[name]));
                    });
                data.status = 'OK';
                return;
            }
            else {
                if (ip_from.gt(ip_num)) {
                    high = mid - 1;
                }
                else {
                    low = mid + 1;
                }
            }
        }
        data.status = 'IP_ADDRESS_NOT_FOUND';
    }
    IP2Location_get_all(my_ip) {
        let data = {
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

        if (/^[:0]+:F{4}:(\d+\.){3}\d+$/i.test(my_ip)) {
            my_ip = my_ip.replace(/^[:0]+:F{4}:/i, '');
        }

        let ip_type = isIP(my_ip);

        if (ip_type === 0) {
            data.status = "INVALID_IP_ADDRESS";
            return data;
        }
        else if (ip_type === 6 && this.mydb.OldBIN === 1) {
            data.status = 'IPV6_NOT_SUPPORTED';
            return data;
        }
        else {
            this.IP2Location_query(my_ip, ip_type, data);
            return data;
        }
    }
    IP2Location_get_areacode(my_ip) { return this.IP2Location_get_all(my_ip).areacode; }
    IP2Location_get_city(my_ip) { return this.IP2Location_get_all(my_ip).city; }
    IP2Location_get_country_long(my_ip) { return this.IP2Location_get_all(my_ip).country_long; }
    IP2Location_get_country_short(my_ip) { return this.IP2Location_get_all(my_ip).country_short; }
    IP2Location_get_domain(my_ip) { return this.IP2Location_get_all(my_ip).domain; }
    IP2Location_get_elevation(my_ip) { return this.IP2Location_get_all(my_ip).elevation; }
    IP2Location_get_iddcode(my_ip) { return this.IP2Location_get_all(my_ip).iddcode; }
    IP2Location_get_isp(my_ip) { return this.IP2Location_get_all(my_ip).isp; }
    IP2Location_get_latitude(my_ip) { return this.IP2Location_get_all(my_ip).latitude; }
    IP2Location_get_longitude(my_ip) { return this.IP2Location_get_all(my_ip).longitude; }
    IP2Location_get_mcc(my_ip) { return this.IP2Location_get_all(my_ip).mcc; }
    IP2Location_get_mnc(my_ip) { return this.IP2Location_get_all(my_ip).mnc; }
    IP2Location_get_mobilebrand(my_ip) { return this.IP2Location_get_all(my_ip).mobilebrand; }
    IP2Location_get_netspeed(my_ip) { return this.IP2Location_get_all(my_ip).netspeed; }
    IP2Location_get_region(my_ip) { return this.IP2Location_get_all(my_ip).region; }
    IP2Location_get_timezone(my_ip) { return this.IP2Location_get_all(my_ip).timezone; }
    IP2Location_get_usagetype(my_ip) { return this.IP2Location_get_all(my_ip).usagetype; }
    IP2Location_get_weatherstationcode(my_ip) { return this.IP2Location_get_all(my_ip).weatherstationcode; }
    IP2Location_get_weatherstationname(my_ip) { return this.IP2Location_get_all(my_ip).weatherstationname; }
    IP2Location_get_zipcode(my_ip) { return this.IP2Location_get_all(my_ip).zipcode; }
}

module.exports = IP2Location;