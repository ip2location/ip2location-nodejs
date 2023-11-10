const net = require("net");
const fs = require("fs");
const fsp = fs.promises;
const https = require("https");
const csv = require("csv-parser");

// For BIN queries
const VERSION = "9.6.1";
const MAX_INDEX = 65536;
const COUNTRY_POSITION = [
  0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  2,
];
const REGION_POSITION = [
  0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
  3,
];
const CITY_POSITION = [
  0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
  4,
];
const ISP_POSITION = [
  0, 0, 3, 0, 5, 0, 7, 5, 7, 0, 8, 0, 9, 0, 9, 0, 9, 0, 9, 7, 9, 0, 9, 7, 9, 9,
  9,
];
const LATITUDE_POSITION = [
  0, 0, 0, 0, 0, 5, 5, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  5,
];
const LONGITUDE_POSITION = [
  0, 0, 0, 0, 0, 6, 6, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
  6,
];
const DOMAIN_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 6, 8, 0, 9, 0, 10, 0, 10, 0, 10, 0, 10, 8, 10, 0, 10, 8,
  10, 10, 10,
];
const ZIP_CODE_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 7, 7, 7, 0, 7, 0, 7, 7, 7, 0, 7, 7,
  7,
];
const TIME_ZONE_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 7, 8, 8, 8, 7, 8, 0, 8, 8, 8, 0, 8, 8,
  8,
];
const NET_SPEED_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 11, 0, 11, 8, 11, 0, 11, 0, 11, 0,
  11, 11, 11,
];
const IDD_CODE_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 12, 0, 12, 0, 12, 9, 12, 0,
  12, 12, 12,
];
const AREA_CODE_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 13, 0, 13, 0, 13, 10, 13, 0,
  13, 13, 13,
];
const WEATHER_STATION_CODE_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 14, 0, 14, 0, 14, 0, 14,
  14, 14,
];
const WEATHER_STATION_NAME_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 15, 0, 15, 0, 15, 0,
  15, 15, 15,
];
const MCC_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 16, 0, 16, 9, 16,
  16, 16,
];
const MNC_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 17, 0, 17, 10,
  17, 17, 17,
];
const MOBILE_BRAND_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 18, 0, 18, 11,
  18, 18, 18,
];
const ELEVATION_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 19, 0, 19,
  19, 19,
];
const USAGE_TYPE_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 20,
  20, 20,
];
const ADDRESS_TYPE_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21,
  21,
];
const CATEGORY_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22,
  22,
];
const DISTRICT_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  23,
];
const ASN_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  24,
];
const AS_POSITION = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  25,
];
const MAX_IPV4_RANGE = BigInt(4294967295);
const MAX_IPV6_RANGE = BigInt("340282366920938463463374607431768211455");
const FROM_6TO4 = BigInt("42545680458834377588178886921629466624");
const TO_6TO4 = BigInt("42550872755692912415807417417958686719");
const FROM_TEREDO = BigInt("42540488161975842760550356425300246528");
const TO_TEREDO = BigInt("42540488241204005274814694018844196863");
const LAST_32_BITS = BigInt("4294967295");

const MODES = {
  COUNTRY_SHORT: 1,
  COUNTRY_LONG: 2,
  REGION: 3,
  CITY: 4,
  ISP: 5,
  LATITUDE: 6,
  LONGITUDE: 7,
  DOMAIN: 8,
  ZIP_CODE: 9,
  TIME_ZONE: 10,
  NET_SPEED: 11,
  IDD_CODE: 12,
  AREA_CODE: 13,
  WEATHER_STATION_CODE: 14,
  WEATHER_STATION_NAME: 15,
  MCC: 16,
  MNC: 17,
  MOBILE_BRAND: 18,
  ELEVATION: 19,
  USAGE_TYPE: 20,
  ADDRESS_TYPE: 21,
  CATEGORY: 22,
  DISTRICT: 23,
  ASN: 24,
  AS: 25,
  ALL: 100,
};
const MSG_NOT_SUPPORTED =
  "This method is not applicable for current IP2Location binary data file. Please upgrade your subscription package to install new data file.";
const MSG_INVALID_IP = "INVALID_IP_ADDRESS";
const MSG_MISSING_FILE = "MISSING_FILE";
const MSG_IPV6_UNSUPPORTED = "IPV6_NOT_SUPPORTED";
const MSG_INVALID_BIN =
  "Incorrect IP2Location BIN file format. Please make sure that you are using the latest IP2Location BIN file.";
const REGEX_TEXT_FIELD = /^(ip|ipno)$/i;
const REGEX_IPV4_1_MATCH = /^[:0]+:F{4}:(\d+\.){3}\d+$/i;
const REGEX_IPV4_1_REPLACE = /^[:0]+:F{4}:/i;
const REGEX_IPV4_2_MATCH = /^[:0]+:(\d+\.){3}\d+$/i;
const REGEX_IPV4_2_REPLACE = /^[:0]+:/i;

// For API queries
const REGEX_API_KEY = /^[\dA-Z]{10}$/;
const REGEX_API_PACKAGE = /^WS\d+$/;
const BASE_URL = "api.ip2location.com/v2/";
const MSG_INVALID_API_KEY = "Invalid API key.";
const MSG_INVALID_API_PACKAGE = "Invalid package name.";

// For IPTools
const REGEX_IPV6_SEGMENT_MATCH = /(.{4})/g;
const REGEX_IPV6_ZERO_1_MATCH = /^(0:){2,}/;
const REGEX_IPV6_ZERO_2_MATCH = /:(0:){2,}/;
const REGEX_IPV6_ZERO_3_MATCH = /(:0){2,}$/;
const REGEX_IPV6_BIN_MATCH = /[01]{1,128}/;
const REGEX_IPV4_PREFIX_MATCH = /^[0-9]{1,2}$/;
const REGEX_IPV6_PREFIX_MATCH = /^[0-9]{1,3}$/;

// Promise for fs.read since not provided by Node.js
const readPromise = (...args) => {
  return new Promise((resolve, reject) => {
    fs.read(...args, (err, bytesRead, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve({ bytesRead: bytesRead, buffer: buffer });
      }
    });
  });
};

// BIN query class
class IP2Location {
  #binFile = "";
  #indexArrayIPV4 = Array(MAX_INDEX);
  #indexArrayIPV6 = Array(MAX_INDEX);
  #ipV4ColumnSize = 0;
  #ipV6ColumnSize = 0;

  #countryPositionOffset = 0;
  #regionPositionOffset = 0;
  #cityPositionOffset = 0;
  #ispPositionOffset = 0;
  #domainPositionOffset = 0;
  #zipCodePositionOffset = 0;
  #latitudePositionOffset = 0;
  #longitudePositionOffset = 0;
  #timeZonePositionOffset = 0;
  #netSpeedPositionOffset = 0;
  #iddCodePositionOffset = 0;
  #areaCodePositionOffset = 0;
  #weatherStationCodePositionOffset = 0;
  #weatherStationNamePositionOffset = 0;
  #mccPositionOffset = 0;
  #mncPositionOffset = 0;
  #mobileBrandPositionOffset = 0;
  #elevationPositionOffset = 0;
  #usageTypePositionOffset = 0;
  #addressTypePositionOffset = 0;
  #categoryPositionOffset = 0;
  #districtPositionOffset = 0;
  #asnPositionOffset = 0;
  #asPositionOffset = 0;

  #countryEnabled = 0;
  #regionEnabled = 0;
  #cityEnabled = 0;
  #ispEnabled = 0;
  #domainEnabled = 0;
  #zipCodeEnabled = 0;
  #latitudeEnabled = 0;
  #longitudeEnabled = 0;
  #timeZoneEnabled = 0;
  #netSpeedEnabled = 0;
  #iddCodeEnabled = 0;
  #areaCodeEnabled = 0;
  #weatherStationCodeEnabled = 0;
  #weatherStationNameEnabled = 0;
  #mccEnabled = 0;
  #mncEnabled = 0;
  #mobileBrandEnabled = 0;
  #elevationEnabled = 0;
  #usageTypeEnabled = 0;
  #addressTypeEnabled = 0;
  #categoryEnabled = 0;
  #districtEnabled = 0;
  #asnEnabled = 0;
  #asEnabled = 0;

  #myDB = {
    dbType: 0,
    dbColumn: 0,
    dbYear: 0,
    dbMonth: 0,
    dbDay: 0,
    dbCount: 0,
    baseAddress: 0,
    dbCountIPV6: 0,
    baseAddressIPV6: 0,
    indexed: 0,
    indexedIPV6: 0,
    indexBaseAddress: 0,
    indexBaseAddressIPV6: 0,
    productCode: 0,
    productType: 0,
    fileSize: 0,
  };
  #fd;

  constructor() {}

  // Read row data
  readRow(readBytes, position) {
    let buffer = new Buffer.alloc(readBytes);
    let totalRead = fs.readSync(this.#fd, buffer, 0, readBytes, position - 1);
    return buffer;
  }

  // Read row data async
  async readRowAsync(readBytes, position) {
    let buffer = new Buffer.alloc(readBytes);
    var data;
    try {
      data = await readPromise(this.#fd, buffer, 0, readBytes, position - 1);
    } catch (e) {
      console.error(e);
    }
    return buffer;
  }

  // Read binary data
  readBin(readBytes, position, readType, isBigInt) {
    let buffer = new Buffer.alloc(readBytes);
    let totalRead = fs.readSync(this.#fd, buffer, 0, readBytes, position);

    if (totalRead == readBytes) {
      switch (readType) {
        case "int8":
          return buffer.readUInt8(0);
          break;
        case "int32":
          return buffer.readInt32LE(0);
          break;
        case "uint32":
          return isBigInt
            ? BigInt(buffer.readUInt32LE(0))
            : buffer.readUInt32LE(0);
          break;
        case "float":
          return buffer.readFloatLE(0);
          break;
        case "str":
          return buffer.toString("utf8");
          break;
        case "int128":
          let myBig = BigInt(0); // zero
          let bitShift = 8;
          for (let x = 0; x < 16; x++) {
            myBig = myBig + (BigInt(buffer.readUInt8(x)) << (bitShift * x));
          }
          return myBig;
          break;
      }
    } else {
      return 0;
    }
  }

  // Read 8 bits integer in the database
  read8(position) {
    let readBytes = 1;
    return this.readBin(readBytes, position - 1, "int8");
  }

  // Read 8 bits integer in the buffer
  read8Row(position, buffer) {
    return buffer.readUInt8(position);
  }

  // Read 32 bits integer in the database
  read32(position, isBigInt) {
    let readBytes = 4;
    return this.readBin(readBytes, position - 1, "uint32", isBigInt);
  }

  // Read 32 bits integer in the buffer
  read32Row(position, buffer) {
    return buffer.readUInt32LE(position);
  }

  // Read 128 bits integer in the buffer
  read128Row(position, buffer) {
    let myBig = BigInt(0); // zero
    let bitShift = 8;
    for (let x = 0; x < 16; x++) {
      let pos = position + x;
      myBig =
        myBig + (BigInt(this.read8Row(pos, buffer)) << BigInt(bitShift * x));
    }
    return myBig;
  }

  read32Or128Row(position, buffer, len) {
    if (len == 4) {
      return this.read32Row(position, buffer);
    } else if (len == 16) {
      return this.read128Row(position, buffer);
    } else {
      return 0;
    }
  }

  read32Or128(position, ipType) {
    if (ipType == 4) {
      return this.read32(position, true);
    } else if (ipType == 6) {
      return this.read128(position);
    } else {
      return 0;
    }
  }

  // Read 128 bits integer in the database
  read128(position) {
    let readBytes = 16;
    return this.readBin(readBytes, position - 1, "int128");
  }

  // Read 32 bits float in the buffer
  readFloatRow(position, buffer) {
    return buffer.readFloatLE(position);
  }

  // Read strings in the database
  readStr(position) {
    let readBytes = 256; // max size of string field + 1 byte for the length
    let row = this.readRow(readBytes, position + 1);
    let len = this.read8Row(0, row);
    return row.toString("utf8", 1, len + 1);
  }

  // Read strings in the database async
  async readStrAsync(position) {
    let readBytes = 256; // max size of string field + 1 byte for the length
    let row = await this.readRowAsync(readBytes, position + 1);
    let len = this.read8Row(0, row);
    return row.toString("utf8", 1, len + 1);
  }

  // Read metadata and indexes
  loadBin() {
    let loadOK = false;

    try {
      if (this.#binFile && this.#binFile != "") {
        this.#fd = fs.openSync(this.#binFile, "r");

        let len = 64; // 64-byte header
        let row = this.readRow(len, 1);

        this.#myDB.dbType = this.read8Row(0, row);
        this.#myDB.dbColumn = this.read8Row(1, row);
        this.#myDB.dbYear = this.read8Row(2, row);
        this.#myDB.dbMonth = this.read8Row(3, row);
        this.#myDB.dbDay = this.read8Row(4, row);
        this.#myDB.dbCount = this.read32Row(5, row);
        this.#myDB.baseAddress = this.read32Row(9, row);
        this.#myDB.dbCountIPV6 = this.read32Row(13, row);
        this.#myDB.baseAddressIPV6 = this.read32Row(17, row);
        this.#myDB.indexBaseAddress = this.read32Row(21, row);
        this.#myDB.indexBaseAddressIPV6 = this.read32Row(25, row);
        this.#myDB.productCode = this.read8Row(29, row);
        // below 2 fields just read for now, not being used yet
        this.#myDB.productType = this.read8Row(30, row);
        this.#myDB.fileSize = this.read32Row(31, row);

        // check if is correct BIN (should be 1 for IP2Location BIN file), also checking for zipped file (PK being the first 2 chars)
        if (
          (this.#myDB.productCode != 1 && this.#myDB.dbYear >= 21) ||
          (this.#myDB.dbType == 80 && this.#myDB.dbColumn == 75)
        ) {
          // only BINs from Jan 2021 onwards have this byte set
          throw new Error(MSG_INVALID_BIN);
        }
        if (this.#myDB.indexBaseAddress > 0) {
          this.#myDB.indexed = 1;
        }

        if (this.#myDB.dbCountIPV6 > 0 && this.#myDB.indexBaseAddressIPV6 > 0) {
          this.#myDB.indexedIPV6 = 1;
        }

        this.#ipV4ColumnSize = this.#myDB.dbColumn << 2; // 4 bytes each column
        this.#ipV6ColumnSize = 16 + ((this.#myDB.dbColumn - 1) << 2); // 4 bytes each column, except IPFrom column which is 16 bytes

        let dbt = this.#myDB.dbType;

        this.#countryPositionOffset =
          COUNTRY_POSITION[dbt] != 0 ? (COUNTRY_POSITION[dbt] - 2) << 2 : 0;
        this.#regionPositionOffset =
          REGION_POSITION[dbt] != 0 ? (REGION_POSITION[dbt] - 2) << 2 : 0;
        this.#cityPositionOffset =
          CITY_POSITION[dbt] != 0 ? (CITY_POSITION[dbt] - 2) << 2 : 0;
        this.#ispPositionOffset =
          ISP_POSITION[dbt] != 0 ? (ISP_POSITION[dbt] - 2) << 2 : 0;
        this.#domainPositionOffset =
          DOMAIN_POSITION[dbt] != 0 ? (DOMAIN_POSITION[dbt] - 2) << 2 : 0;
        this.#zipCodePositionOffset =
          ZIP_CODE_POSITION[dbt] != 0 ? (ZIP_CODE_POSITION[dbt] - 2) << 2 : 0;
        this.#latitudePositionOffset =
          LATITUDE_POSITION[dbt] != 0 ? (LATITUDE_POSITION[dbt] - 2) << 2 : 0;
        this.#longitudePositionOffset =
          LONGITUDE_POSITION[dbt] != 0 ? (LONGITUDE_POSITION[dbt] - 2) << 2 : 0;
        this.#timeZonePositionOffset =
          TIME_ZONE_POSITION[dbt] != 0 ? (TIME_ZONE_POSITION[dbt] - 2) << 2 : 0;
        this.#netSpeedPositionOffset =
          NET_SPEED_POSITION[dbt] != 0 ? (NET_SPEED_POSITION[dbt] - 2) << 2 : 0;
        this.#iddCodePositionOffset =
          IDD_CODE_POSITION[dbt] != 0 ? (IDD_CODE_POSITION[dbt] - 2) << 2 : 0;
        this.#areaCodePositionOffset =
          AREA_CODE_POSITION[dbt] != 0 ? (AREA_CODE_POSITION[dbt] - 2) << 2 : 0;
        this.#weatherStationCodePositionOffset =
          WEATHER_STATION_CODE_POSITION[dbt] != 0
            ? (WEATHER_STATION_CODE_POSITION[dbt] - 2) << 2
            : 0;
        this.#weatherStationNamePositionOffset =
          WEATHER_STATION_NAME_POSITION[dbt] != 0
            ? (WEATHER_STATION_NAME_POSITION[dbt] - 2) << 2
            : 0;
        this.#mccPositionOffset =
          MCC_POSITION[dbt] != 0 ? (MCC_POSITION[dbt] - 2) << 2 : 0;
        this.#mncPositionOffset =
          MNC_POSITION[dbt] != 0 ? (MNC_POSITION[dbt] - 2) << 2 : 0;
        this.#mobileBrandPositionOffset =
          MOBILE_BRAND_POSITION[dbt] != 0
            ? (MOBILE_BRAND_POSITION[dbt] - 2) << 2
            : 0;
        this.#elevationPositionOffset =
          ELEVATION_POSITION[dbt] != 0 ? (ELEVATION_POSITION[dbt] - 2) << 2 : 0;
        this.#usageTypePositionOffset =
          USAGE_TYPE_POSITION[dbt] != 0
            ? (USAGE_TYPE_POSITION[dbt] - 2) << 2
            : 0;
        this.#addressTypePositionOffset =
          ADDRESS_TYPE_POSITION[dbt] != 0
            ? (ADDRESS_TYPE_POSITION[dbt] - 2) << 2
            : 0;
        this.#categoryPositionOffset =
          CATEGORY_POSITION[dbt] != 0 ? (CATEGORY_POSITION[dbt] - 2) << 2 : 0;
        this.#districtPositionOffset =
          DISTRICT_POSITION[dbt] != 0 ? (DISTRICT_POSITION[dbt] - 2) << 2 : 0;
        this.#asnPositionOffset =
          ASN_POSITION[dbt] != 0 ? (ASN_POSITION[dbt] - 2) << 2 : 0;
        this.#asPositionOffset =
          AS_POSITION[dbt] != 0 ? (AS_POSITION[dbt] - 2) << 2 : 0;

        this.#countryEnabled = COUNTRY_POSITION[dbt] != 0 ? 1 : 0;
        this.#regionEnabled = REGION_POSITION[dbt] != 0 ? 1 : 0;
        this.#cityEnabled = CITY_POSITION[dbt] != 0 ? 1 : 0;
        this.#ispEnabled = ISP_POSITION[dbt] != 0 ? 1 : 0;
        this.#latitudeEnabled = LATITUDE_POSITION[dbt] != 0 ? 1 : 0;
        this.#longitudeEnabled = LONGITUDE_POSITION[dbt] != 0 ? 1 : 0;
        this.#domainEnabled = DOMAIN_POSITION[dbt] != 0 ? 1 : 0;
        this.#zipCodeEnabled = ZIP_CODE_POSITION[dbt] != 0 ? 1 : 0;
        this.#timeZoneEnabled = TIME_ZONE_POSITION[dbt] != 0 ? 1 : 0;
        this.#netSpeedEnabled = NET_SPEED_POSITION[dbt] != 0 ? 1 : 0;
        this.#iddCodeEnabled = IDD_CODE_POSITION[dbt] != 0 ? 1 : 0;
        this.#areaCodeEnabled = AREA_CODE_POSITION[dbt] != 0 ? 1 : 0;
        this.#weatherStationCodeEnabled =
          WEATHER_STATION_CODE_POSITION[dbt] != 0 ? 1 : 0;
        this.#weatherStationNameEnabled =
          WEATHER_STATION_NAME_POSITION[dbt] != 0 ? 1 : 0;
        this.#mccEnabled = MCC_POSITION[dbt] != 0 ? 1 : 0;
        this.#mncEnabled = MNC_POSITION[dbt] != 0 ? 1 : 0;
        this.#mobileBrandEnabled = MOBILE_BRAND_POSITION[dbt] != 0 ? 1 : 0;
        this.#elevationEnabled = ELEVATION_POSITION[dbt] != 0 ? 1 : 0;
        this.#usageTypeEnabled = USAGE_TYPE_POSITION[dbt] != 0 ? 1 : 0;
        this.#addressTypeEnabled = ADDRESS_TYPE_POSITION[dbt] != 0 ? 1 : 0;
        this.#categoryEnabled = CATEGORY_POSITION[dbt] != 0 ? 1 : 0;
        this.#districtEnabled = DISTRICT_POSITION[dbt] != 0 ? 1 : 0;
        this.#asnEnabled = ASN_POSITION[dbt] != 0 ? 1 : 0;
        this.#asEnabled = AS_POSITION[dbt] != 0 ? 1 : 0;

        if (this.#myDB.indexed == 1) {
          len = MAX_INDEX;
          if (this.#myDB.indexedIPV6 == 1) {
            len += MAX_INDEX;
          }
          len *= 8; // 4 bytes for both From/To

          row = this.readRow(len, this.#myDB.indexBaseAddress);

          let pointer = 0;

          for (let x = 0; x < MAX_INDEX; x++) {
            this.#indexArrayIPV4[x] = Array(2);
            this.#indexArrayIPV4[x][0] = this.read32Row(pointer, row);
            this.#indexArrayIPV4[x][1] = this.read32Row(pointer + 4, row);
            pointer += 8;
          }

          if (this.#myDB.indexedIPV6 == 1) {
            for (let x = 0; x < MAX_INDEX; x++) {
              this.#indexArrayIPV6[x] = Array(2);
              this.#indexArrayIPV6[x][0] = this.read32Row(pointer, row);
              this.#indexArrayIPV6[x][1] = this.read32Row(pointer + 4, row);
              pointer += 8;
            }
          }
        }
        loadOK = true;
      }
    } catch (err) {
      // do nothing for now
    }
    return loadOK;
  }

  // Read metadata and indexes async
  async loadBinAsync() {
    let loadOK = false;

    try {
      if (this.#binFile && this.#binFile != "") {
        let fh = await fsp.open(this.#binFile, "r");
        this.#fd = fh.fd;

        let len = 64; // 64-byte header
        let row = await this.readRowAsync(len, 1);

        this.#myDB.dbType = this.read8Row(0, row);
        this.#myDB.dbColumn = this.read8Row(1, row);
        this.#myDB.dbYear = this.read8Row(2, row);
        this.#myDB.dbMonth = this.read8Row(3, row);
        this.#myDB.dbDay = this.read8Row(4, row);
        this.#myDB.dbCount = this.read32Row(5, row);
        this.#myDB.baseAddress = this.read32Row(9, row);
        this.#myDB.dbCountIPV6 = this.read32Row(13, row);
        this.#myDB.baseAddressIPV6 = this.read32Row(17, row);
        this.#myDB.indexBaseAddress = this.read32Row(21, row);
        this.#myDB.indexBaseAddressIPV6 = this.read32Row(25, row);
        this.#myDB.productCode = this.read8Row(29, row);
        // below 2 fields just read for now, not being used yet
        this.#myDB.productType = this.read8Row(30, row);
        this.#myDB.fileSize = this.read32Row(31, row);

        // check if is correct BIN (should be 1 for IP2Location BIN file), also checking for zipped file (PK being the first 2 chars)
        if (
          (this.#myDB.productCode != 1 && this.#myDB.dbYear >= 21) ||
          (this.#myDB.dbType == 80 && this.#myDB.dbColumn == 75)
        ) {
          // only BINs from Jan 2021 onwards have this byte set
          throw new Error(MSG_INVALID_BIN);
        }
        if (this.#myDB.indexBaseAddress > 0) {
          this.#myDB.indexed = 1;
        }

        if (this.#myDB.dbCountIPV6 > 0 && this.#myDB.indexBaseAddressIPV6 > 0) {
          this.#myDB.indexedIPV6 = 1;
        }

        this.#ipV4ColumnSize = this.#myDB.dbColumn << 2; // 4 bytes each column
        this.#ipV6ColumnSize = 16 + ((this.#myDB.dbColumn - 1) << 2); // 4 bytes each column, except IPFrom column which is 16 bytes

        let dbt = this.#myDB.dbType;

        this.#countryPositionOffset =
          COUNTRY_POSITION[dbt] != 0 ? (COUNTRY_POSITION[dbt] - 2) << 2 : 0;
        this.#regionPositionOffset =
          REGION_POSITION[dbt] != 0 ? (REGION_POSITION[dbt] - 2) << 2 : 0;
        this.#cityPositionOffset =
          CITY_POSITION[dbt] != 0 ? (CITY_POSITION[dbt] - 2) << 2 : 0;
        this.#ispPositionOffset =
          ISP_POSITION[dbt] != 0 ? (ISP_POSITION[dbt] - 2) << 2 : 0;
        this.#domainPositionOffset =
          DOMAIN_POSITION[dbt] != 0 ? (DOMAIN_POSITION[dbt] - 2) << 2 : 0;
        this.#zipCodePositionOffset =
          ZIP_CODE_POSITION[dbt] != 0 ? (ZIP_CODE_POSITION[dbt] - 2) << 2 : 0;
        this.#latitudePositionOffset =
          LATITUDE_POSITION[dbt] != 0 ? (LATITUDE_POSITION[dbt] - 2) << 2 : 0;
        this.#longitudePositionOffset =
          LONGITUDE_POSITION[dbt] != 0 ? (LONGITUDE_POSITION[dbt] - 2) << 2 : 0;
        this.#timeZonePositionOffset =
          TIME_ZONE_POSITION[dbt] != 0 ? (TIME_ZONE_POSITION[dbt] - 2) << 2 : 0;
        this.#netSpeedPositionOffset =
          NET_SPEED_POSITION[dbt] != 0 ? (NET_SPEED_POSITION[dbt] - 2) << 2 : 0;
        this.#iddCodePositionOffset =
          IDD_CODE_POSITION[dbt] != 0 ? (IDD_CODE_POSITION[dbt] - 2) << 2 : 0;
        this.#areaCodePositionOffset =
          AREA_CODE_POSITION[dbt] != 0 ? (AREA_CODE_POSITION[dbt] - 2) << 2 : 0;
        this.#weatherStationCodePositionOffset =
          WEATHER_STATION_CODE_POSITION[dbt] != 0
            ? (WEATHER_STATION_CODE_POSITION[dbt] - 2) << 2
            : 0;
        this.#weatherStationNamePositionOffset =
          WEATHER_STATION_NAME_POSITION[dbt] != 0
            ? (WEATHER_STATION_NAME_POSITION[dbt] - 2) << 2
            : 0;
        this.#mccPositionOffset =
          MCC_POSITION[dbt] != 0 ? (MCC_POSITION[dbt] - 2) << 2 : 0;
        this.#mncPositionOffset =
          MNC_POSITION[dbt] != 0 ? (MNC_POSITION[dbt] - 2) << 2 : 0;
        this.#mobileBrandPositionOffset =
          MOBILE_BRAND_POSITION[dbt] != 0
            ? (MOBILE_BRAND_POSITION[dbt] - 2) << 2
            : 0;
        this.#elevationPositionOffset =
          ELEVATION_POSITION[dbt] != 0 ? (ELEVATION_POSITION[dbt] - 2) << 2 : 0;
        this.#usageTypePositionOffset =
          USAGE_TYPE_POSITION[dbt] != 0
            ? (USAGE_TYPE_POSITION[dbt] - 2) << 2
            : 0;
        this.#addressTypePositionOffset =
          ADDRESS_TYPE_POSITION[dbt] != 0
            ? (ADDRESS_TYPE_POSITION[dbt] - 2) << 2
            : 0;
        this.#categoryPositionOffset =
          CATEGORY_POSITION[dbt] != 0 ? (CATEGORY_POSITION[dbt] - 2) << 2 : 0;
        this.#districtPositionOffset =
          DISTRICT_POSITION[dbt] != 0 ? (DISTRICT_POSITION[dbt] - 2) << 2 : 0;
        this.#asnPositionOffset =
          ASN_POSITION[dbt] != 0 ? (ASN_POSITION[dbt] - 2) << 2 : 0;
        this.#asPositionOffset =
          AS_POSITION[dbt] != 0 ? (AS_POSITION[dbt] - 2) << 2 : 0;

        this.#countryEnabled = COUNTRY_POSITION[dbt] != 0 ? 1 : 0;
        this.#regionEnabled = REGION_POSITION[dbt] != 0 ? 1 : 0;
        this.#cityEnabled = CITY_POSITION[dbt] != 0 ? 1 : 0;
        this.#ispEnabled = ISP_POSITION[dbt] != 0 ? 1 : 0;
        this.#latitudeEnabled = LATITUDE_POSITION[dbt] != 0 ? 1 : 0;
        this.#longitudeEnabled = LONGITUDE_POSITION[dbt] != 0 ? 1 : 0;
        this.#domainEnabled = DOMAIN_POSITION[dbt] != 0 ? 1 : 0;
        this.#zipCodeEnabled = ZIP_CODE_POSITION[dbt] != 0 ? 1 : 0;
        this.#timeZoneEnabled = TIME_ZONE_POSITION[dbt] != 0 ? 1 : 0;
        this.#netSpeedEnabled = NET_SPEED_POSITION[dbt] != 0 ? 1 : 0;
        this.#iddCodeEnabled = IDD_CODE_POSITION[dbt] != 0 ? 1 : 0;
        this.#areaCodeEnabled = AREA_CODE_POSITION[dbt] != 0 ? 1 : 0;
        this.#weatherStationCodeEnabled =
          WEATHER_STATION_CODE_POSITION[dbt] != 0 ? 1 : 0;
        this.#weatherStationNameEnabled =
          WEATHER_STATION_NAME_POSITION[dbt] != 0 ? 1 : 0;
        this.#mccEnabled = MCC_POSITION[dbt] != 0 ? 1 : 0;
        this.#mncEnabled = MNC_POSITION[dbt] != 0 ? 1 : 0;
        this.#mobileBrandEnabled = MOBILE_BRAND_POSITION[dbt] != 0 ? 1 : 0;
        this.#elevationEnabled = ELEVATION_POSITION[dbt] != 0 ? 1 : 0;
        this.#usageTypeEnabled = USAGE_TYPE_POSITION[dbt] != 0 ? 1 : 0;
        this.#addressTypeEnabled = ADDRESS_TYPE_POSITION[dbt] != 0 ? 1 : 0;
        this.#categoryEnabled = CATEGORY_POSITION[dbt] != 0 ? 1 : 0;
        this.#districtEnabled = DISTRICT_POSITION[dbt] != 0 ? 1 : 0;
        this.#asnEnabled = ASN_POSITION[dbt] != 0 ? 1 : 0;
        this.#asEnabled = AS_POSITION[dbt] != 0 ? 1 : 0;

        if (this.#myDB.indexed == 1) {
          len = MAX_INDEX;
          if (this.#myDB.indexedIPV6 == 1) {
            len += MAX_INDEX;
          }
          len *= 8; // 4 bytes for both From/To

          row = await this.readRowAsync(len, this.#myDB.indexBaseAddress);

          let pointer = 0;

          for (let x = 0; x < MAX_INDEX; x++) {
            this.#indexArrayIPV4[x] = Array(2);
            this.#indexArrayIPV4[x][0] = this.read32Row(pointer, row);
            this.#indexArrayIPV4[x][1] = this.read32Row(pointer + 4, row);
            pointer += 8;
          }

          if (this.#myDB.indexedIPV6 == 1) {
            for (let x = 0; x < MAX_INDEX; x++) {
              this.#indexArrayIPV6[x] = Array(2);
              this.#indexArrayIPV6[x][0] = this.read32Row(pointer, row);
              this.#indexArrayIPV6[x][1] = this.read32Row(pointer + 4, row);
              pointer += 8;
            }
          }
        }
        loadOK = true;
      }
    } catch (err) {
      // do nothing for now
    }
    return loadOK;
  }

  // Initialize the module with the path to the IP2Location BIN file
  open(binPath) {
    if (this.#myDB.dbType == 0) {
      this.#binFile = binPath;
      this.loadBin();
    }
  }

  // Initialize the module with the path to the IP2Location BIN file async
  async openAsync(binPath) {
    if (this.#myDB.dbType == 0) {
      this.#binFile = binPath;
      await this.loadBinAsync();
    }
  }

  // Reset everything (do not use in async case due to race conditions)
  close() {
    try {
      this.#myDB.baseAddress = 0;
      this.#myDB.dbCount = 0;
      this.#myDB.dbColumn = 0;
      this.#myDB.dbType = 0;
      this.#myDB.dbDay = 0;
      this.#myDB.dbMonth = 0;
      this.#myDB.dbYear = 0;
      this.#myDB.baseAddressIPV6 = 0;
      this.#myDB.dbCountIPV6 = 0;
      this.#myDB.indexed = 0;
      this.#myDB.indexedIPV6 = 0;
      this.#myDB.indexBaseAddress = 0;
      this.#myDB.indexBaseAddressIPV6 = 0;
      this.#myDB.productCode = 0;
      this.#myDB.productType = 0;
      this.#myDB.fileSize = 0;
      fs.closeSync(this.#fd);
      return 0;
    } catch (err) {
      return -1;
    }
  }

  // Search BIN for the data
  geoQueryData(myIP, ipType, data, mode) {
    let MAX_IP_RANGE;
    let low;
    let mid;
    let high;
    let countryPosition;
    let baseAddress;
    let columnSize;
    let ipNumber;
    let indexAddress;
    let rowOffset;
    let rowOffset2;
    let ipFrom;
    let ipTo;
    let firstCol = 4; // IP From is 4 bytes
    let row;
    let fullRow;

    if (ipType == 4) {
      MAX_IP_RANGE = MAX_IPV4_RANGE;
      high = this.#myDB.dbCount;
      baseAddress = this.#myDB.baseAddress;
      columnSize = this.#ipV4ColumnSize;
      ipNumber = dot2Num(myIP);

      if (this.#myDB.indexed == 1) {
        indexAddress = ipNumber >>> 16;
        low = this.#indexArrayIPV4[indexAddress][0];
        high = this.#indexArrayIPV4[indexAddress][1];
      }
    } else if (ipType == 6) {
      MAX_IP_RANGE = MAX_IPV6_RANGE;
      high = this.#myDB.dbCountIPV6;
      baseAddress = this.#myDB.baseAddressIPV6;
      columnSize = this.#ipV6ColumnSize;
      ipNumber = ip2No(myIP);

      if (
        (ipNumber >= FROM_6TO4 && ipNumber <= TO_6TO4) ||
        (ipNumber >= FROM_TEREDO && ipNumber <= TO_TEREDO)
      ) {
        ipType = 4;
        MAX_IP_RANGE = MAX_IPV4_RANGE;
        high = this.#myDB.dbCount;
        baseAddress = this.#myDB.baseAddress;
        columnSize = this.#ipV4ColumnSize;

        if (ipNumber >= FROM_6TO4 && ipNumber <= TO_6TO4) {
          ipNumber = Number((ipNumber >> BigInt(80)) & LAST_32_BITS);
        } else {
          ipNumber = Number(~ipNumber & LAST_32_BITS);
        }
        if (this.#myDB.indexed == 1) {
          indexAddress = ipNumber >>> 16;
          low = this.#indexArrayIPV4[indexAddress][0];
          high = this.#indexArrayIPV4[indexAddress][1];
        }
      } else {
        firstCol = 16; // IPv6 is 16 bytes
        if (this.#myDB.indexedIPV6 == 1) {
          indexAddress = Number(ipNumber >> BigInt(112));
          low = this.#indexArrayIPV6[indexAddress][0];
          high = this.#indexArrayIPV6[indexAddress][1];
        }
      }
    }
    data.ip = myIP;
    ipNumber = BigInt(ipNumber);

    if (ipNumber >= MAX_IP_RANGE) {
      ipNumber = MAX_IP_RANGE - BigInt(1);
    }

    data.ipNo = ipNumber.toString();

    while (low <= high) {
      mid = Math.trunc((low + high) / 2);
      rowOffset = baseAddress + mid * columnSize;
      rowOffset2 = rowOffset + columnSize;

      // reading IP From + whole row + next IP From
      fullRow = this.readRow(columnSize + firstCol, rowOffset);
      ipFrom = this.read32Or128Row(0, fullRow, firstCol);
      ipTo = this.read32Or128Row(columnSize, fullRow, firstCol);

      ipFrom = BigInt(ipFrom);
      ipTo = BigInt(ipTo);

      if (ipFrom <= ipNumber && ipTo > ipNumber) {
        loadMesg(data, MSG_NOT_SUPPORTED); // load default message

        let rowLen = columnSize - firstCol;
        row = fullRow.subarray(firstCol, firstCol + rowLen); // extract the actual row data

        if (this.#countryEnabled) {
          if (
            mode == MODES.ALL ||
            mode == MODES.COUNTRY_SHORT ||
            mode == MODES.COUNTRY_LONG
          ) {
            countryPosition = this.read32Row(this.#countryPositionOffset, row);
          }
          if (mode == MODES.ALL || mode == MODES.COUNTRY_SHORT) {
            data.countryShort = this.readStr(countryPosition);
          }
          if (mode == MODES.ALL || mode == MODES.COUNTRY_LONG) {
            data.countryLong = this.readStr(countryPosition + 3);
          }
        }

        if (this.#regionEnabled) {
          if (mode == MODES.ALL || mode == MODES.REGION) {
            data.region = this.readStr(
              this.read32Row(this.#regionPositionOffset, row)
            );
          }
        }

        if (this.#cityEnabled) {
          if (mode == MODES.ALL || mode == MODES.CITY) {
            data.city = this.readStr(
              this.read32Row(this.#cityPositionOffset, row)
            );
          }
        }
        if (this.#ispEnabled) {
          if (mode == MODES.ALL || mode == MODES.ISP) {
            data.isp = this.readStr(
              this.read32Row(this.#ispPositionOffset, row)
            );
          }
        }
        if (this.#domainEnabled) {
          if (mode == MODES.ALL || mode == MODES.DOMAIN) {
            data.domain = this.readStr(
              this.read32Row(this.#domainPositionOffset, row)
            );
          }
        }
        if (this.#zipCodeEnabled) {
          if (mode == MODES.ALL || mode == MODES.ZIP_CODE) {
            data.zipCode = this.readStr(
              this.read32Row(this.#zipCodePositionOffset, row)
            );
          }
        }
        if (this.#latitudeEnabled) {
          if (mode == MODES.ALL || mode == MODES.LATITUDE) {
            data.latitude =
              Math.round(
                this.readFloatRow(this.#latitudePositionOffset, row) * 1000000,
                6
              ) / 1000000;
          }
        }
        if (this.#longitudeEnabled) {
          if (mode == MODES.ALL || mode == MODES.LONGITUDE) {
            data.longitude =
              Math.round(
                this.readFloatRow(this.#longitudePositionOffset, row) * 1000000,
                6
              ) / 1000000;
          }
        }
        if (this.#timeZoneEnabled) {
          if (mode == MODES.ALL || mode == MODES.TIME_ZONE) {
            data.timeZone = this.readStr(
              this.read32Row(this.#timeZonePositionOffset, row)
            );
          }
        }
        if (this.#netSpeedEnabled) {
          if (mode == MODES.ALL || mode == MODES.NET_SPEED) {
            data.netSpeed = this.readStr(
              this.read32Row(this.#netSpeedPositionOffset, row)
            );
          }
        }
        if (this.#iddCodeEnabled) {
          if (mode == MODES.ALL || mode == MODES.IDD_CODE) {
            data.iddCode = this.readStr(
              this.read32Row(this.#iddCodePositionOffset, row)
            );
          }
        }
        if (this.#areaCodeEnabled) {
          if (mode == MODES.ALL || mode == MODES.AREA_CODE) {
            data.areaCode = this.readStr(
              this.read32Row(this.#areaCodePositionOffset, row)
            );
          }
        }
        if (this.#weatherStationCodeEnabled) {
          if (mode == MODES.ALL || mode == MODES.WEATHER_STATION_CODE) {
            data.weatherStationCode = this.readStr(
              this.read32Row(this.#weatherStationCodePositionOffset, row)
            );
          }
        }
        if (this.#weatherStationNameEnabled) {
          if (mode == MODES.ALL || mode == MODES.WEATHER_STATION_NAME) {
            data.weatherStationName = this.readStr(
              this.read32Row(this.#weatherStationNamePositionOffset, row)
            );
          }
        }
        if (this.#mccEnabled) {
          if (mode == MODES.ALL || mode == MODES.MCC) {
            data.mcc = this.readStr(
              this.read32Row(this.#mccPositionOffset, row)
            );
          }
        }
        if (this.#mncEnabled) {
          if (mode == MODES.ALL || mode == MODES.MNC) {
            data.mnc = this.readStr(
              this.read32Row(this.#mncPositionOffset, row)
            );
          }
        }
        if (this.#mobileBrandEnabled) {
          if (mode == MODES.ALL || mode == MODES.MOBILE_BRAND) {
            data.mobileBrand = this.readStr(
              this.read32Row(this.#mobileBrandPositionOffset, row)
            );
          }
        }
        if (this.#elevationEnabled) {
          if (mode == MODES.ALL || mode == MODES.ELEVATION) {
            data.elevation = this.readStr(
              this.read32Row(this.#elevationPositionOffset, row)
            );
          }
        }
        if (this.#usageTypeEnabled) {
          if (mode == MODES.ALL || mode == MODES.USAGE_TYPE) {
            data.usageType = this.readStr(
              this.read32Row(this.#usageTypePositionOffset, row)
            );
          }
        }
        if (this.#addressTypeEnabled) {
          if (mode == MODES.ALL || mode == MODES.ADDRESS_TYPE) {
            data.addressType = this.readStr(
              this.read32Row(this.#addressTypePositionOffset, row)
            );
          }
        }
        if (this.#categoryEnabled) {
          if (mode == MODES.ALL || mode == MODES.CATEGORY) {
            data.category = this.readStr(
              this.read32Row(this.#categoryPositionOffset, row)
            );
          }
        }
        if (this.#districtEnabled) {
          if (mode == MODES.ALL || mode == MODES.DISTRICT) {
            data.district = this.readStr(
              this.read32Row(this.#districtPositionOffset, row)
            );
          }
        }
        if (this.#asnEnabled) {
          if (mode == MODES.ALL || mode == MODES.ASN) {
            data.asn = this.readStr(
              this.read32Row(this.#asnPositionOffset, row)
            );
          }
        }
        if (this.#asEnabled) {
          if (mode == MODES.ALL || mode == MODES.AS) {
            data.as = this.readStr(this.read32Row(this.#asPositionOffset, row));
          }
        }
        return;
      } else {
        if (ipFrom > ipNumber) {
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      }
    }
    loadMesg(data, MSG_INVALID_IP);
  }

  // Search BIN for the data async
  async geoQueryDataAsync(myIP, ipType, data, mode) {
    let MAX_IP_RANGE;
    let low;
    let mid;
    let high;
    let countryPosition;
    let baseAddress;
    let columnSize;
    let ipNumber;
    let indexAddress;
    let rowOffset;
    let rowOffset2;
    let ipFrom;
    let ipTo;
    let firstCol = 4; // IP From is 4 bytes
    let row;
    let fullRow;

    if (ipType == 4) {
      MAX_IP_RANGE = MAX_IPV4_RANGE;
      high = this.#myDB.dbCount;
      baseAddress = this.#myDB.baseAddress;
      columnSize = this.#ipV4ColumnSize;
      ipNumber = dot2Num(myIP);

      if (this.#myDB.indexed == 1) {
        indexAddress = ipNumber >>> 16;
        low = this.#indexArrayIPV4[indexAddress][0];
        high = this.#indexArrayIPV4[indexAddress][1];
      }
    } else if (ipType == 6) {
      MAX_IP_RANGE = MAX_IPV6_RANGE;
      high = this.#myDB.dbCountIPV6;
      baseAddress = this.#myDB.baseAddressIPV6;
      columnSize = this.#ipV6ColumnSize;
      ipNumber = ip2No(myIP);

      if (
        (ipNumber >= FROM_6TO4 && ipNumber <= TO_6TO4) ||
        (ipNumber >= FROM_TEREDO && ipNumber <= TO_TEREDO)
      ) {
        ipType = 4;
        MAX_IP_RANGE = MAX_IPV4_RANGE;
        high = this.#myDB.dbCount;
        baseAddress = this.#myDB.baseAddress;
        columnSize = this.#ipV4ColumnSize;

        if (ipNumber >= FROM_6TO4 && ipNumber <= TO_6TO4) {
          ipNumber = Number((ipNumber >> BigInt(80)) & LAST_32_BITS);
        } else {
          ipNumber = Number(~ipNumber & LAST_32_BITS);
        }
        if (this.#myDB.indexed == 1) {
          indexAddress = ipNumber >>> 16;
          low = this.#indexArrayIPV4[indexAddress][0];
          high = this.#indexArrayIPV4[indexAddress][1];
        }
      } else {
        firstCol = 16; // IPv6 is 16 bytes
        if (this.#myDB.indexedIPV6 == 1) {
          indexAddress = Number(ipNumber >> BigInt(112));
          low = this.#indexArrayIPV6[indexAddress][0];
          high = this.#indexArrayIPV6[indexAddress][1];
        }
      }
    }
    data.ip = myIP;
    ipNumber = BigInt(ipNumber);

    if (ipNumber >= MAX_IP_RANGE) {
      ipNumber = MAX_IP_RANGE - BigInt(1);
    }

    data.ipNo = ipNumber.toString();

    while (low <= high) {
      mid = Math.trunc((low + high) / 2);
      rowOffset = baseAddress + mid * columnSize;
      rowOffset2 = rowOffset + columnSize;

      // reading IP From + whole row + next IP From
      fullRow = await this.readRowAsync(columnSize + firstCol, rowOffset);
      ipFrom = this.read32Or128Row(0, fullRow, firstCol);
      ipTo = this.read32Or128Row(columnSize, fullRow, firstCol);

      ipFrom = BigInt(ipFrom);
      ipTo = BigInt(ipTo);

      if (ipFrom <= ipNumber && ipTo > ipNumber) {
        loadMesg(data, MSG_NOT_SUPPORTED); // load default message

        let rowLen = columnSize - firstCol;
        row = fullRow.subarray(firstCol, firstCol + rowLen); // extract the actual row data

        if (this.#countryEnabled) {
          if (
            mode == MODES.ALL ||
            mode == MODES.COUNTRY_SHORT ||
            mode == MODES.COUNTRY_LONG
          ) {
            countryPosition = this.read32Row(this.#countryPositionOffset, row);
          }
          if (mode == MODES.ALL || mode == MODES.COUNTRY_SHORT) {
            data.countryShort = await this.readStrAsync(countryPosition);
          }
          if (mode == MODES.ALL || mode == MODES.COUNTRY_LONG) {
            data.countryLong = await this.readStrAsync(countryPosition + 3);
          }
        }

        if (this.#regionEnabled) {
          if (mode == MODES.ALL || mode == MODES.REGION) {
            data.region = await this.readStrAsync(
              this.read32Row(this.#regionPositionOffset, row)
            );
          }
        }

        if (this.#cityEnabled) {
          if (mode == MODES.ALL || mode == MODES.CITY) {
            data.city = await this.readStrAsync(
              this.read32Row(this.#cityPositionOffset, row)
            );
          }
        }
        if (this.#ispEnabled) {
          if (mode == MODES.ALL || mode == MODES.ISP) {
            data.isp = await this.readStrAsync(
              this.read32Row(this.#ispPositionOffset, row)
            );
          }
        }
        if (this.#domainEnabled) {
          if (mode == MODES.ALL || mode == MODES.DOMAIN) {
            data.domain = await this.readStrAsync(
              this.read32Row(this.#domainPositionOffset, row)
            );
          }
        }
        if (this.#zipCodeEnabled) {
          if (mode == MODES.ALL || mode == MODES.ZIP_CODE) {
            data.zipCode = await this.readStrAsync(
              this.read32Row(this.#zipCodePositionOffset, row)
            );
          }
        }
        if (this.#latitudeEnabled) {
          if (mode == MODES.ALL || mode == MODES.LATITUDE) {
            data.latitude =
              Math.round(
                this.readFloatRow(this.#latitudePositionOffset, row) * 1000000,
                6
              ) / 1000000;
          }
        }
        if (this.#longitudeEnabled) {
          if (mode == MODES.ALL || mode == MODES.LONGITUDE) {
            data.longitude =
              Math.round(
                this.readFloatRow(this.#longitudePositionOffset, row) * 1000000,
                6
              ) / 1000000;
          }
        }
        if (this.#timeZoneEnabled) {
          if (mode == MODES.ALL || mode == MODES.TIME_ZONE) {
            data.timeZone = await this.readStrAsync(
              this.read32Row(this.#timeZonePositionOffset, row)
            );
          }
        }
        if (this.#netSpeedEnabled) {
          if (mode == MODES.ALL || mode == MODES.NET_SPEED) {
            data.netSpeed = await this.readStrAsync(
              this.read32Row(this.#netSpeedPositionOffset, row)
            );
          }
        }
        if (this.#iddCodeEnabled) {
          if (mode == MODES.ALL || mode == MODES.IDD_CODE) {
            data.iddCode = await this.readStrAsync(
              this.read32Row(this.#iddCodePositionOffset, row)
            );
          }
        }
        if (this.#areaCodeEnabled) {
          if (mode == MODES.ALL || mode == MODES.AREA_CODE) {
            data.areaCode = await this.readStrAsync(
              this.read32Row(this.#areaCodePositionOffset, row)
            );
          }
        }
        if (this.#weatherStationCodeEnabled) {
          if (mode == MODES.ALL || mode == MODES.WEATHER_STATION_CODE) {
            data.weatherStationCode = await this.readStrAsync(
              this.read32Row(this.#weatherStationCodePositionOffset, row)
            );
          }
        }
        if (this.#weatherStationNameEnabled) {
          if (mode == MODES.ALL || mode == MODES.WEATHER_STATION_NAME) {
            data.weatherStationName = await this.readStrAsync(
              this.read32Row(this.#weatherStationNamePositionOffset, row)
            );
          }
        }
        if (this.#mccEnabled) {
          if (mode == MODES.ALL || mode == MODES.MCC) {
            data.mcc = await this.readStrAsync(
              this.read32Row(this.#mccPositionOffset, row)
            );
          }
        }
        if (this.#mncEnabled) {
          if (mode == MODES.ALL || mode == MODES.MNC) {
            data.mnc = await this.readStrAsync(
              this.read32Row(this.#mncPositionOffset, row)
            );
          }
        }
        if (this.#mobileBrandEnabled) {
          if (mode == MODES.ALL || mode == MODES.MOBILE_BRAND) {
            data.mobileBrand = await this.readStrAsync(
              this.read32Row(this.#mobileBrandPositionOffset, row)
            );
          }
        }
        if (this.#elevationEnabled) {
          if (mode == MODES.ALL || mode == MODES.ELEVATION) {
            data.elevation = await this.readStrAsync(
              this.read32Row(this.#elevationPositionOffset, row)
            );
          }
        }
        if (this.#usageTypeEnabled) {
          if (mode == MODES.ALL || mode == MODES.USAGE_TYPE) {
            data.usageType = await this.readStrAsync(
              this.read32Row(this.#usageTypePositionOffset, row)
            );
          }
        }
        if (this.#addressTypeEnabled) {
          if (mode == MODES.ALL || mode == MODES.ADDRESS_TYPE) {
            data.addressType = await this.readStrAsync(
              this.read32Row(this.#addressTypePositionOffset, row)
            );
          }
        }
        if (this.#categoryEnabled) {
          if (mode == MODES.ALL || mode == MODES.CATEGORY) {
            data.category = await this.readStrAsync(
              this.read32Row(this.#categoryPositionOffset, row)
            );
          }
        }
        if (this.#districtEnabled) {
          if (mode == MODES.ALL || mode == MODES.DISTRICT) {
            data.district = await this.readStrAsync(
              this.read32Row(this.#districtPositionOffset, row)
            );
          }
        }
        if (this.#asnEnabled) {
          if (mode == MODES.ALL || mode == MODES.ASN) {
            data.asn = await this.readStrAsync(
              this.read32Row(this.#asnPositionOffset, row)
            );
          }
        }
        if (this.#asEnabled) {
          if (mode == MODES.ALL || mode == MODES.AS) {
            data.as = await this.readStrAsync(
              this.read32Row(this.#asPositionOffset, row)
            );
          }
        }
        return;
      } else {
        if (ipFrom > ipNumber) {
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      }
    }
    loadMesg(data, MSG_INVALID_IP);
  }

  // Query IP for geolocation info
  geoQuery(myIP, mode) {
    let data = {
      ip: "?",
      ipNo: "?",
      countryShort: "?",
      countryLong: "?",
      region: "?",
      city: "?",
      isp: "?",
      domain: "?",
      zipCode: "?",
      latitude: "?",
      longitude: "?",
      timeZone: "?",
      netSpeed: "?",
      iddCode: "?",
      areaCode: "?",
      weatherStationCode: "?",
      weatherStationName: "?",
      mcc: "?",
      mnc: "?",
      mobileBrand: "?",
      elevation: "?",
      usageType: "?",
      addressType: "?",
      category: "?",
      district: "?",
      asn: "?",
      as: "?",
    };

    if (REGEX_IPV4_1_MATCH.test(myIP)) {
      myIP = myIP.replace(REGEX_IPV4_1_REPLACE, "");
    } else if (REGEX_IPV4_2_MATCH.test(myIP)) {
      myIP = myIP.replace(REGEX_IPV4_2_REPLACE, "");
    }

    let ipType = net.isIP(myIP);

    if (ipType == 0) {
      loadMesg(data, MSG_INVALID_IP);
      return data;
    } else if (
      !this.#binFile ||
      this.#binFile == "" ||
      !fs.existsSync(this.#binFile)
    ) {
      loadMesg(data, MSG_MISSING_FILE);
      return data;
    } else if (this.#myDB.dbType == 0) {
      loadMesg(data, MSG_MISSING_FILE);
      return data;
    } else if (ipType == 6 && this.#myDB.dbCountIPV6 == 0) {
      loadMesg(data, MSG_IPV6_UNSUPPORTED);
      return data;
    } else {
      this.geoQueryData(myIP, ipType, data, mode);
      return data;
    }
  }

  // Query IP for geolocation info async
  async geoQueryAsync(myIP, mode) {
    let data = {
      ip: "?",
      ipNo: "?",
      countryShort: "?",
      countryLong: "?",
      region: "?",
      city: "?",
      isp: "?",
      domain: "?",
      zipCode: "?",
      latitude: "?",
      longitude: "?",
      timeZone: "?",
      netSpeed: "?",
      iddCode: "?",
      areaCode: "?",
      weatherStationCode: "?",
      weatherStationName: "?",
      mcc: "?",
      mnc: "?",
      mobileBrand: "?",
      elevation: "?",
      usageType: "?",
      addressType: "?",
      category: "?",
      district: "?",
      asn: "?",
      as: "?",
    };

    if (REGEX_IPV4_1_MATCH.test(myIP)) {
      myIP = myIP.replace(REGEX_IPV4_1_REPLACE, "");
    } else if (REGEX_IPV4_2_MATCH.test(myIP)) {
      myIP = myIP.replace(REGEX_IPV4_2_REPLACE, "");
    }

    let ipType = net.isIP(myIP);

    if (ipType == 0) {
      loadMesg(data, MSG_INVALID_IP);
      return data;
    } else if (
      !this.#binFile ||
      this.#binFile == "" ||
      !fs.existsSync(this.#binFile) // don't use async equivalent to test, not recommended by Node.js as it leads to race conditions
    ) {
      loadMesg(data, MSG_MISSING_FILE);
      return data;
    } else if (this.#myDB.dbType == 0) {
      loadMesg(data, MSG_MISSING_FILE);
      return data;
    } else if (ipType == 6 && this.#myDB.dbCountIPV6 == 0) {
      loadMesg(data, MSG_IPV6_UNSUPPORTED);
      return data;
    } else {
      await this.geoQueryDataAsync(myIP, ipType, data, mode);
      return data;
    }
  }

  // Return the API version
  getAPIVersion() {
    return VERSION;
  }

  // Return the package version
  getPackageVersion() {
    return this.#myDB.dbType;
  }

  // Return the IP database version
  getDatabaseVersion() {
    return (
      "20" +
      this.#myDB.dbYear +
      "." +
      this.#myDB.dbMonth +
      "." +
      this.#myDB.dbDay
    );
  }

  // Return a string for the country code
  getCountryShort(myIP) {
    let data = this.geoQuery(myIP, MODES.COUNTRY_SHORT);
    return data.countryShort;
  }

  // Return a string for the country code async
  async getCountryShortAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.COUNTRY_SHORT);
    return data.countryShort;
  }

  // Return a string for the country name
  getCountryLong(myIP) {
    let data = this.geoQuery(myIP, MODES.COUNTRY_LONG);
    return data.countryLong;
  }

  // Return a string for the country name async
  async getCountryLongAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.COUNTRY_LONG);
    return data.countryLong;
  }

  // Return a string for the region name
  getRegion(myIP) {
    let data = this.geoQuery(myIP, MODES.REGION);
    return data.region;
  }

  // Return a string for the region name async
  async getRegionAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.REGION);
    return data.region;
  }

  // Return a string for the city name
  getCity(myIP) {
    let data = this.geoQuery(myIP, MODES.CITY);
    return data.city;
  }

  // Return a string for the city name async
  async getCityAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.CITY);
    return data.city;
  }

  // Return a string for the ISP name
  getISP(myIP) {
    let data = this.geoQuery(myIP, MODES.ISP);
    return data.isp;
  }

  // Return a string for the ISP name async
  async getISPAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.ISP);
    return data.isp;
  }

  // Return a float for the latitude
  getLatitude(myIP) {
    let data = this.geoQuery(myIP, MODES.LATITUDE);
    return data.latitude;
  }

  // Return a float for the latitude async
  async getLatitudeAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.LATITUDE);
    return data.latitude;
  }

  // Return a float for the longitude
  getLongitude(myIP) {
    let data = this.geoQuery(myIP, MODES.LONGITUDE);
    return data.longitude;
  }

  // Return a float for the longitude async
  async getLongitudeAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.LONGITUDE);
    return data.longitude;
  }

  // Return a string for the domain
  getDomain(myIP) {
    let data = this.geoQuery(myIP, MODES.DOMAIN);
    return data.domain;
  }

  // Return a string for the domain async
  async getDomainAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.DOMAIN);
    return data.domain;
  }

  // Return a string for the ZIP code
  getZIPCode(myIP) {
    let data = this.geoQuery(myIP, MODES.ZIP_CODE);
    return data.zipCode;
  }

  // Return a string for the ZIP code async
  async getZIPCodeAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.ZIP_CODE);
    return data.zipCode;
  }

  // Return a string for the time zone
  getTimeZone(myIP) {
    let data = this.geoQuery(myIP, MODES.TIME_ZONE);
    return data.timeZone;
  }

  // Return a string for the time zone async
  async getTimeZoneAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.TIME_ZONE);
    return data.timeZone;
  }

  // Return a string for the net speed
  getNetSpeed(myIP) {
    let data = this.geoQuery(myIP, MODES.NET_SPEED);
    return data.netSpeed;
  }

  // Return a string for the net speed async
  async getNetSpeedAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.NET_SPEED);
    return data.netSpeed;
  }

  // Return a string for the IDD code
  getIDDCode(myIP) {
    let data = this.geoQuery(myIP, MODES.IDD_CODE);
    return data.iddCode;
  }

  // Return a string for the IDD code async
  async getIDDCodeAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.IDD_CODE);
    return data.iddCode;
  }

  // Return a string for the area code
  getAreaCode(myIP) {
    let data = this.geoQuery(myIP, MODES.AREA_CODE);
    return data.areaCode;
  }

  // Return a string for the area code async
  async getAreaCodeAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.AREA_CODE);
    return data.areaCode;
  }

  // Return a string for the weather station code
  getWeatherStationCode(myIP) {
    let data = this.geoQuery(myIP, MODES.WEATHER_STATION_CODE);
    return data.weatherStationCode;
  }

  // Return a string for the weather station code async
  async getWeatherStationCodeAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.WEATHER_STATION_CODE);
    return data.weatherStationCode;
  }

  // Return a string for the weather station name
  getWeatherStationName(myIP) {
    let data = this.geoQuery(myIP, MODES.WEATHER_STATION_NAME);
    return data.weatherStationName;
  }

  // Return a string for the weather station name async
  async getWeatherStationNameAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.WEATHER_STATION_NAME);
    return data.weatherStationName;
  }

  // Return a string for the MCC
  getMCC(myIP) {
    let data = this.geoQuery(myIP, MODES.MCC);
    return data.mcc;
  }

  // Return a string for the MCC async
  async getMCCAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.MCC);
    return data.mcc;
  }

  // Return a string for the MNC
  getMNC(myIP) {
    let data = this.geoQuery(myIP, MODES.MNC);
    return data.mnc;
  }

  // Return a string for the MNC async
  async getMNCAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.MNC);
    return data.mnc;
  }

  // Return a string for the mobile brand
  getMobileBrand(myIP) {
    let data = this.geoQuery(myIP, MODES.MOBILE_BRAND);
    return data.mobileBrand;
  }

  // Return a string for the mobile brand async
  async getMobileBrandAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.MOBILE_BRAND);
    return data.mobileBrand;
  }

  // Return a string for the elevation
  getElevation(myIP) {
    let data = this.geoQuery(myIP, MODES.ELEVATION);
    return data.elevation;
  }

  // Return a string for the elevation async
  async getElevationAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.ELEVATION);
    return data.elevation;
  }

  // Return a string for the usage type
  getUsageType(myIP) {
    let data = this.geoQuery(myIP, MODES.USAGE_TYPE);
    return data.usageType;
  }

  // Return a string for the usage type async
  async getUsageTypeAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.USAGE_TYPE);
    return data.usageType;
  }

  // Return a string for the address type
  getAddressType(myIP) {
    let data = this.geoQuery(myIP, MODES.ADDRESS_TYPE);
    return data.addressType;
  }

  // Return a string for the address type async
  async getAddressTypeAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.ADDRESS_TYPE);
    return data.addressType;
  }

  // Return a string for the category
  getCategory(myIP) {
    let data = this.geoQuery(myIP, MODES.CATEGORY);
    return data.category;
  }

  // Return a string for the category async
  async getCategoryAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.CATEGORY);
    return data.category;
  }

  // Return a string for the district name
  getDistrict(myIP) {
    let data = this.geoQuery(myIP, MODES.DISTRICT);
    return data.district;
  }

  // Return a string for the district name async
  async getDistrictAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.DISTRICT);
    return data.district;
  }

  // Return a string for the autonomous system number (ASN)
  getASN(myIP) {
    let data = this.geoQuery(myIP, MODES.ASN);
    return data.asn;
  }

  // Return a string for the autonomous system number (ASN) async
  async getASNAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.ASN);
    return data.asn;
  }

  // Return a string for the autonomous system (AS)
  getAS(myIP) {
    let data = this.geoQuery(myIP, MODES.AS);
    return data.as;
  }

  // Return a string for the autonomous system (AS) async
  async getASAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.AS);
    return data.as;
  }

  // Return all results
  getAll(myIP) {
    let data = this.geoQuery(myIP, MODES.ALL);
    return data;
  }

  // Return all results async
  async getAllAsync(myIP) {
    let data = await this.geoQueryAsync(myIP, MODES.ALL);
    return data;
  }
}

// Convert IPv4 address to number
function dot2Num(ipV4) {
  let d = ipV4.split(".");
  return ((+d[0] * 256 + +d[1]) * 256 + +d[2]) * 256 + +d[3];
}

// Convert IPv6 address to number
function ip2No(ipV6) {
  let maxSections = 8; // should have 8 sections
  let sectionBits = 16; // 16 bits per section
  let m = ipV6.split("::");

  let total = BigInt(0); // zero

  if (m.length == 2) {
    let myArrLeft = m[0] != "" ? m[0].split(":") : [];
    let myArrRight = m[1] != "" ? m[1].split(":") : [];
    let myArrMid = maxSections - myArrLeft.length - myArrRight.length;

    for (let x = 0; x < myArrLeft.length; x++) {
      total =
        total +
        (BigInt(parseInt("0x" + myArrLeft[x])) <<
          BigInt((maxSections - (x + 1)) * sectionBits));
    }

    for (let x = 0; x < myArrRight.length; x++) {
      total =
        total +
        (BigInt(parseInt("0x" + myArrRight[x])) <<
          BigInt((myArrRight.length - (x + 1)) * sectionBits));
    }
  } else if (m.length == 1) {
    let myArr = m[0].split(":");

    for (let x = 0; x < myArr.length; x++) {
      total =
        total +
        (BigInt(parseInt("0x" + myArr[x])) <<
          BigInt((maxSections - (x + 1)) * sectionBits));
    }
  }

  return total;
}

function loadMesg(data, mesg) {
  for (let key in data) {
    if (REGEX_TEXT_FIELD.test(key) === false) {
      data[key] = mesg;
    }
  }
}

// API query class
class IP2LocationWebService {
  #apiKey = "";
  #apiPackage = "";
  #useSSL = true;

  constructor() {}

  // Set the API key and package to query
  open(apiKey, apiPackage, useSSL = true) {
    this.#apiKey = apiKey;
    this.#apiPackage = apiPackage;
    this.#useSSL = useSSL;

    this.checkParams();
  }

  // Validate API key and package
  checkParams() {
    if (REGEX_API_KEY.test(this.#apiKey) === false) {
      throw new Error(MSG_INVALID_API_KEY);
    }

    if (REGEX_API_PACKAGE.test(this.#apiPackage) === false) {
      throw new Error(MSG_INVALID_API_PACKAGE);
    }
  }

  // Query web service to get geolocation information by IP address
  lookup(myIP, addOn, lang, callback) {
    this.checkParams(); // check here in case user haven't called open yet

    let data = {
      key: this.#apiKey,
      package: this.#apiPackage,
      ip: myIP,
    };
    if (addOn) {
      data.addon = addOn;
    }
    if (lang) {
      data.lang = lang;
    }

    let protocol = this.#useSSL ? "https" : "http";
    let url = protocol + "://" + BASE_URL + "?";

    Object.keys(data).forEach(function (key, index) {
      if (this[key] != "") {
        url += key + "=" + encodeURIComponent(this[key]) + "&";
      }
    }, data);

    url = url.substring(0, url.length - 1);

    let d = "";
    let req = https.get(url, function (res) {
      res.on("data", (chunk) => (d = d + chunk));
      res.on("end", function () {
        callback(null, JSON.parse(d));
      });
    });

    req.on("error", function (e) {
      callback(e);
    });
  }

  // Check web service credit balance
  getCredit(callback) {
    this.checkParams(); // check here in case user haven't called open yet

    let data = {
      key: this.#apiKey,
      check: "true",
    };

    let protocol = this.#useSSL ? "https" : "http";
    let url = protocol + "://" + BASE_URL + "?";

    Object.keys(data).forEach(function (key, index) {
      if (this[key] != "") {
        url += key + "=" + encodeURIComponent(this[key]) + "&";
      }
    }, data);

    url = url.substring(0, url.length - 1);

    let d = "";
    let req = https.get(url, function (res) {
      res.on("data", (chunk) => (d = d + chunk));
      res.on("end", function () {
        callback(null, JSON.parse(d));
      });
    });

    req.on("error", function (e) {
      callback(e);
    });
  }
}

// IPTools class
class IPTools {
  constructor() {}

  // Check if IP is IPv4 address
  isIPV4(myIP) {
    return net.isIPv4(myIP);
  }

  // Check if IP is IPv6 address
  isIPV6(myIP) {
    return net.isIPv6(myIP);
  }

  // Convert IPv4 address to IP number
  ipV4ToDecimal(myIP) {
    if (!this.isIPV4(myIP)) {
      return null;
    }

    return dot2Num(myIP);
  }

  // Convert IPv6 address to IP number
  ipV6ToDecimal(myIP) {
    if (!this.isIPV6(myIP)) {
      return null;
    }

    return ip2No(myIP);
  }

  // Convert IP number to IPv4 address
  decimalToIPV4(ipNum) {
    if (ipNum < 0 || ipNum > 4294967295) {
      return null;
    }
    let v4 =
      Math.floor((ipNum / 16777216) % 256) +
      "." +
      Math.floor((ipNum / 65536) % 256) +
      "." +
      Math.floor((ipNum / 256) % 256) +
      "." +
      Math.floor(ipNum % 256);

    return v4;
  }

  // Convert IP number to IPv6 address
  decimalToIPV6(ipNum) {
    if (typeof ipNum == "string" || typeof ipNum == "number") {
      ipNum = BigInt(ipNum);
    }

    if (ipNum < BigInt(0) || ipNum > MAX_IPV6_RANGE) {
      return null;
    }

    let x = ipNum.toString(16);
    x = x.padStart(32, "0");
    let matches = x.matchAll(REGEX_IPV6_SEGMENT_MATCH);

    // trim leading zeroes from each segment
    x = Array.from(matches).map((match) => {
      let m = match[0].replace(/^0+/, "");
      m = m == "" ? "0" : m;
      return m;
    });

    let v6 = x.join(":");

    return v6;
  }

  // Compress IPv6 address
  compressIPV6(myIP) {
    if (!this.isIPV6(myIP)) {
      return null;
    }

    myIP = this.decimalToIPV6(this.ipV6ToDecimal(myIP)); // to format the IPv6 so that we can easily match below

    let v6 = myIP;

    if (REGEX_IPV6_ZERO_1_MATCH.test(v6)) {
      v6 = v6.replace(REGEX_IPV6_ZERO_1_MATCH, "::");
    } else if (REGEX_IPV6_ZERO_2_MATCH.test(v6)) {
      v6 = v6.replace(REGEX_IPV6_ZERO_2_MATCH, "::");
    } else if (REGEX_IPV6_ZERO_3_MATCH.test(v6)) {
      v6 = v6.replace(REGEX_IPV6_ZERO_3_MATCH, "::");
    }
    v6 = v6.replace(/::0$/, "::"); // special case

    return v6;
  }

  // Expand IPv6 address
  expandIPV6(myIP) {
    if (!this.isIPV6(myIP)) {
      return null;
    }

    let ipNum = this.ipV6ToDecimal(myIP);
    let x = ipNum.toString(16);
    x = x.padStart(32, "0");
    let matches = x.matchAll(REGEX_IPV6_SEGMENT_MATCH);
    x = Array.from(matches).map((match) => match[0]);
    let v6 = x.join(":");

    return v6;
  }

  // Convert IPv4 range to CIDR
  ipV4ToCIDR(ipFrom, ipTo) {
    if (!this.isIPV4(ipFrom) || !this.isIPV4(ipTo)) {
      return null;
    }

    let startIP = this.ipV4ToDecimal(ipFrom);
    let endIP = this.ipV4ToDecimal(ipTo);
    let result = [];

    while (endIP >= startIP) {
      let maxSize = 32;

      while (maxSize > 0) {
        let mask = Math.pow(2, 32) - Math.pow(2, 32 - (maxSize - 1));
        let maskBase = startIP & mask;

        if (maskBase != startIP) {
          break;
        }

        maxSize -= 1;
      }

      let x = Math.log(endIP - startIP + 1) / Math.log(2);
      let maxDiff = 32 - Math.floor(x);

      if (maxSize < maxDiff) {
        maxSize = maxDiff;
      }

      let ip = this.decimalToIPV4(startIP);
      result.push(ip + "/" + maxSize);
      startIP += Math.pow(2, 32 - maxSize);
    }
    return result;
  }

  // Convert IPv6 to binary string representation
  ipToBinary(myIP) {
    if (!this.isIPV6(myIP)) {
      return null;
    }
    let ipNum = this.ipV6ToDecimal(myIP);
    let x = ipNum.toString(2);
    x = x.padStart(128, "0");

    return x;
  }

  // Convert binary string representation to IPv6
  binaryToIP(myBin) {
    if (!REGEX_IPV6_BIN_MATCH.test(myBin)) {
      return null;
    }

    let ipNum = BigInt("0b" + myBin);
    let v6 = this.decimalToIPV6(ipNum);

    return v6;
  }

  // Convert IPv6 range to CIDR
  ipV6ToCIDR(ipFrom, ipTo) {
    if (!this.isIPV6(ipFrom) || !this.isIPV6(ipTo)) {
      return null;
    }

    let ipFromBin = this.ipToBinary(ipFrom);
    let ipToBin = this.ipToBinary(ipTo);

    if (ipFromBin == null || ipToBin == null) {
      return null;
    }
    let result = [];
    let networkSize = 0;
    let shift = 0;

    let padded = "";
    let unpadded = "";
    let networks = [];
    let n = 0;

    if (ipFromBin == ipToBin) {
      result.push(ipFrom + "/128");
      return result;
    }

    if (ipFromBin > ipToBin) {
      let tmp = ipFromBin;
      ipFromBin = ipToBin;
      ipToBin = tmp;
    }

    do {
      if (ipFromBin.charAt(ipFromBin.length - 1) == "1") {
        unpadded = ipFromBin.substring(networkSize, 128);
        padded = unpadded.padEnd(128, "0");
        networks[padded] = 128 - networkSize;
        n = ipFromBin.lastIndexOf("0");
        ipFromBin = (n == 0 ? "" : ipFromBin.substring(0, n)) + "1";
        ipFromBin = ipFromBin.padEnd(128, "0");
      }

      if (ipToBin.charAt(ipToBin.length - 1) == "0") {
        unpadded = ipToBin.substring(networkSize, 128);
        padded = unpadded.padEnd(128, "0");
        networks[padded] = 128 - networkSize;
        n = ipToBin.lastIndexOf("1");
        ipToBin = (n == 0 ? "" : ipToBin.substring(0, n)) + "0";
        ipToBin = ipToBin.padEnd(128, "1");
      }

      if (ipToBin < ipFromBin) {
        continue;
      }

      shift =
        128 - Math.max(ipFromBin.lastIndexOf("0"), ipToBin.lastIndexOf("1"));

      unpadded = ipFromBin.substring(0, 128 - shift);
      ipFromBin = unpadded.padStart(128, "0");
      unpadded = ipToBin.substring(0, 128 - shift);
      ipToBin = unpadded.padStart(128, "0");

      networkSize += shift;

      if (ipFromBin == ipToBin) {
        unpadded = ipFromBin.substring(networkSize, 128);
        padded = unpadded.padEnd(128, "0");
        networks[padded] = 128 - networkSize;
      }
    } while (ipFromBin < ipToBin);

    let k = Object.keys(networks).sort();

    for (const val of k) {
      result.push(
        this.compressIPV6(this.binaryToIP(val)) + "/" + networks[val]
      );
    }

    return result;
  }

  // Convert CIDR to IPv4 range
  cidrToIPV4(cidr) {
    if (!cidr.includes("/")) {
      return null;
    }

    let ip = "";
    let prefix = 0;
    let arr = cidr.split("/");
    let ipStart = "";
    let ipEnd = "";
    let ipStartLong = 0;
    let ipEndLong = 0;
    let total = 0;

    if (
      arr.length != 2 ||
      !this.isIPV4(arr[0]) ||
      !REGEX_IPV4_PREFIX_MATCH.test(arr[1]) ||
      parseInt(arr[1]) > 32
    ) {
      return null;
    }

    ip = arr[0];
    prefix = parseInt(arr[1]);

    ipStartLong = this.ipV4ToDecimal(ip);
    ipStartLong = ipStartLong & (-1 << (32 - prefix));
    ipStart = this.decimalToIPV4(ipStartLong);

    total = 1 << (32 - prefix);

    ipEndLong = ipStartLong + total - 1;

    if (ipEndLong > 4294967295) {
      ipEndLong = 4294967295;
    }

    ipEnd = this.decimalToIPV4(ipEndLong);

    return [ipStart, ipEnd];
  }

  // Convert CIDR to IPv6 range
  cidrToIPV6(cidr) {
    if (!cidr.includes("/")) {
      return null;
    }

    let ip = "";
    let prefix = 0;
    let arr = cidr.split("/");

    if (
      arr.length != 2 ||
      !this.isIPV6(arr[0]) ||
      !REGEX_IPV6_PREFIX_MATCH.test(arr[1]) ||
      parseInt(arr[1]) > 128
    ) {
      return null;
    }

    ip = arr[0];
    prefix = parseInt(arr[1]);

    let parts = this.expandIPV6(ip).split(":");

    let bitStart = "1".repeat(prefix) + "0".repeat(128 - prefix);
    let bitEnd = "0".repeat(prefix) + "1".repeat(128 - prefix);

    let floors = bitStart.match(/.{1,16}/g) ?? [];
    let ceilings = bitEnd.match(/.{1,16}/g) ?? [];

    let start = [];
    let end = [];

    for (let x = 0; x < 8; x++) {
      start.push(
        (
          parseInt(parts[x], 16) &
          parseInt(this.baseConvert(floors[x], 2, 16), 16)
        ).toString(16)
      );
      end.push(
        (
          parseInt(parts[x], 16) |
          parseInt(this.baseConvert(ceilings[x], 2, 16), 16)
        ).toString(16)
      );
    }

    return [this.expandIPV6(start.join(":")), this.expandIPV6(end.join(":"))];
  }

  baseConvert(num, fromBase, toBase) {
    // Parse the num from the source base to base 10
    let base10Number = parseInt(num, fromBase);

    // Convert the base 10 number to the target base
    let result = base10Number.toString(toBase);

    return result;
  }
}

// Country class
class Country {
  #fields = Array();
  #records = {};
  #fd;
  #ready = false;

  constructor(csvFile) {
    if (!fs.existsSync(csvFile)) {
      throw new Error("The CSV file " + csvFile + " is not found.");
    }
    try {
      fs.createReadStream(csvFile)
        .pipe(csv(true))
        .on("data", (data) => {
          if (data.country_code) {
            this.#records[data.country_code] = data;
          } else {
            throw new Error("Invalid country information CSV file.");
          }
        })
        .on("end", () => {
          this.#ready = true;
        });
    } catch (err) {
      throw new Error("Unable to read " + csvFile + ".");
    }
  }

  // Get country information
  async getCountryInfo(countryCode = "") {
    while (!this.#ready) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    countryCode = countryCode.trim();
    let results = Array();
    if (Object.keys(this.#records).length === 0) {
      throw new Error("No record available.");
    }
    if (countryCode != "") {
      if (this.#records[countryCode]) {
        results.push(this.#records[countryCode]);
      }
    } else {
      for (const elem in this.#records) {
        results.push(this.#records[elem]);
      }
    }
    return results;
  }
}

// Region class
class Region {
  #fields = Array();
  #records = {};
  #fd;
  #ready = false;

  constructor(csvFile) {
    if (!fs.existsSync(csvFile)) {
      throw new Error("The CSV file " + csvFile + " is not found.");
    }
    try {
      fs.createReadStream(csvFile)
        .pipe(csv(true))
        .on("data", (data) => {
          if (data.subdivision_name) {
            if (!this.#records[data.country_code]) {
              this.#records[data.country_code] = Array();
            }
            this.#records[data.country_code].push({
              code: data.code,
              name: data.subdivision_name,
            });
          } else {
            throw new Error("Invalid region information CSV file.");
          }
        })
        .on("end", () => {
          this.#ready = true;
        });
    } catch (err) {
      throw new Error("Unable to read " + csvFile + ".");
    }
  }

  // Get region code
  async getRegionCode(countryCode = "", regionName = "") {
    while (!this.#ready) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    countryCode = countryCode.trim();
    regionName = regionName.trim();
    if (Object.keys(this.#records).length === 0) {
      throw new Error("No record available.");
    }
    if (this.#records[countryCode]) {
      for (let x = 0; x < this.#records[countryCode].length; x++) {
        let elem = this.#records[countryCode][x];
        if (regionName.toUpperCase() == elem.name.toUpperCase()) {
          return elem.code;
        }
      }
      return null;
    } else {
      return null;
    }
  }
}

module.exports = {
  IP2Location: IP2Location,
  IP2LocationWebService: IP2LocationWebService,
  IPTools: IPTools,
  Country: Country,
  Region: Region,
};
