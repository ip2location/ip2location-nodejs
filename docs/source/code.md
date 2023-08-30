# IP2Location Node.js API

## IP2Location Class

```{py:class} IP2Location()
Construct the IP2Location Class.
```

```{py:function} open(binPath)
Load the IP2Location BIN database for lookup.

:param str binPath: (Required) The file path links to IP2Location BIN databases.
```

```{py:function} openAsync(binPath)
Load the IP2Location BIN database for lookup asynchronously.

:param str binPath: (Required) The file path links to IP2Location BIN databases.
```

```{py:function} getAll(ipAddress)
Retrieve geolocation information for an IP address.

:param str ipAddress: (Required) The IP address (IPv4 or IPv6).
:return: Returns the geolocation information in array. Refer below table for the fields avaliable in the array
:rtype: array

**RETURN FIELDS**

| Field Name       | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| countryShort    |     Two-character country code based on ISO 3166. |
| countryLong     |     Country name based on ISO 3166. |
| region           |     Region or state name. |
| city             |     City name. |
| isp              |     Internet Service Provider or company\'s name. |
| latitude         |     City latitude. Defaults to capital city latitude if city is unknown. |
| longitude        |     City longitude. Defaults to capital city longitude if city is unknown. |
| domain           |     Internet domain name associated with IP address range. |
| zipCode          |     ZIP code or Postal code. [172 countries supported](https://www.ip2location.com/zip-code-coverage). |
| timeZone         |     UTC time zone (with DST supported). |
| netSpeed         |     Internet connection type. |
| iddCode         |     The IDD prefix to call the city from another country. |
| areaCode        |     A varying length number assigned to geographic areas for calls between cities. [223 countries supported](https://www.ip2location.com/area-code-coverage). |
| weatherStationCode     |     The special code to identify the nearest weather observation station. |
| weatherStationName     |     The name of the nearest weather observation station. |
| mcc              |     Mobile Country Codes (MCC) as defined in ITU E.212 for use in identifying mobile stations in wireless telephone networks, particularly GSM and UMTS networks. |
| mnc              |     Mobile Network Code (MNC) is used in combination with a Mobile Country Code(MCC) to uniquely identify a mobile phone operator or carrier. |
| mobileBrand     |     Commercial brand associated with the mobile carrier. You may click [mobile carrier coverage](https://www.ip2location.com/mobile-carrier-coverage) to view the coverage report. |
| elevation        |     Average height of city above sea level in meters (m). |
| usageType       |     Usage type classification of ISP or company. |
| addressType     |     IP address types as defined in Internet Protocol version 4 (IPv4) and Internet Protocol version 6 (IPv6). |
| category         |     The domain category based on [IAB Tech Lab Content Taxonomy](https://www.ip2location.com/free/iab-categories). |
| district         |     District or county name. |
| asn              |     Autonomous system number (ASN). BIN databases. |
| as          |     Autonomous system (AS) name. |
```

```{py:function} getAllAsync(ipAddress)
Retrieve geolocation information for an IP address asynchronously.

:param str ipAddress: (Required) The IP address (IPv4 or IPv6).
:return: Returns the geolocation information in a Promise of an array. Refer below table for the fields avaliable in the array
:rtype: Promise of an array

**RETURN FIELDS**

| Field Name       | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| countryShort    |     Two-character country code based on ISO 3166. |
| countryLong     |     Country name based on ISO 3166. |
| region           |     Region or state name. |
| city             |     City name. |
| isp              |     Internet Service Provider or company\'s name. |
| latitude         |     City latitude. Defaults to capital city latitude if city is unknown. |
| longitude        |     City longitude. Defaults to capital city longitude if city is unknown. |
| domain           |     Internet domain name associated with IP address range. |
| zipCode          |     ZIP code or Postal code. [172 countries supported](https://www.ip2location.com/zip-code-coverage). |
| timeZone         |     UTC time zone (with DST supported). |
| netSpeed         |     Internet connection type. |
| iddCode         |     The IDD prefix to call the city from another country. |
| areaCode        |     A varying length number assigned to geographic areas for calls between cities. [223 countries supported](https://www.ip2location.com/area-code-coverage). |
| weatherStationCode     |     The special code to identify the nearest weather observation station. |
| weatherStationName     |     The name of the nearest weather observation station. |
| mcc              |     Mobile Country Codes (MCC) as defined in ITU E.212 for use in identifying mobile stations in wireless telephone networks, particularly GSM and UMTS networks. |
| mnc              |     Mobile Network Code (MNC) is used in combination with a Mobile Country Code(MCC) to uniquely identify a mobile phone operator or carrier. |
| mobileBrand     |     Commercial brand associated with the mobile carrier. You may click [mobile carrier coverage](https://www.ip2location.com/mobile-carrier-coverage) to view the coverage report. |
| elevation        |     Average height of city above sea level in meters (m). |
| usageType       |     Usage type classification of ISP or company. |
| addressType     |     IP address types as defined in Internet Protocol version 4 (IPv4) and Internet Protocol version 6 (IPv6). |
| category         |     The domain category based on [IAB Tech Lab Content Taxonomy](https://www.ip2location.com/free/iab-categories). |
| district         |     District or county name. |
| asn              |     Autonomous system number (ASN). BIN databases. |
| as          |     Autonomous system (AS) name. |
```

## IPTools Class

```{py:class} IPTools ()
Initiate IPTools class.
```

```{py:function} isIPV4(ipAddress)
Verify if a string is a valid IPv4 address.

:param str ipAddress: (Required) IP address.
:return: Return True if the IP address is a valid IPv4 address or False if it isn't a valid IPv4 address.
:rtype: boolean
```

```{py:function} isIPV6(ipAddress)
Verify if a string is a valid IPv6 address

:param str ipAddress: (Required) IP address.
:return: Return True if the IP address is a valid IPv6 address or False if it isn't a valid IPv6 address.
:rtype: boolean
```

```{py:function} ipV4ToDecimal(ipAddress)
Translate IPv4 address from dotted-decimal address to decimal format.

:param str ipAddress: (Required) IPv4 address.
:return: Return the decimal format of the IPv4 address.
:rtype: int
```

```{py:function} decimalToIPV4(ipNumber)
Translate IPv4 address from decimal number to dotted-decimal address.

:param str ip_number: (Required) Decimal format of the IPv4 address.
:return: Returns the dotted-decimal format of the IPv4 address.
:rtype: string
```

```{py:function} ipV6ToDecimal(ipAddress)
Translate IPv6 address from hexadecimal address to decimal format.

:param str ipAddress: (Required) IPv6 address.
:return: Return the decimal format of the IPv6 address.
:rtype: int
```

```{py:function} decimalToIPV6(ipNumber)
Translate IPv6 address from decimal number into hexadecimal address.

:param str ip_number: (Required) Decimal format of the IPv6 address.
:return: Returns the hexadecimal format of the IPv6 address.
:rtype: string
```

```{py:function} ipV4ToCIDR(ip_from, ip_to)
Convert IPv4 range into a list of IPv4 CIDR notation.

:param str ip_from: (Required) The starting IPv4 address in the range.
:param str ip_to: (Required) The ending IPv4 address in the range.
:return: Returns the list of IPv4 CIDR notation.
:rtype: array
```

```{py:function} cidrToIPV4(cidr)
Convert IPv4 CIDR notation into a list of IPv4 addresses.

:param str cidr: (Required) IPv4 CIDR notation.
:return: Returns an list of IPv4 addresses.
:rtype: array
```

```{py:function} ipV6ToCIDR(ip_from, ip_to)
Convert IPv6 range into a list of IPv6 CIDR notation.

:param str ip_from: (Required) The starting IPv6 address in the range.
:param str ip_to: (Required) The ending IPv6 address in the range.
:return: Returns the list of IPv6 CIDR notation.
:rtype: array
```

```{py:function} cidrToIPV6(cidr)
Convert IPv6 CIDR notation into a list of IPv6 addresses.

:param str cidr: (Required) IPv6 CIDR notation.
:return: Returns an list of IPv6 addresses.
:rtype: array
```


```{py:function} compressIPV6(ipAddress)
Compress a IPv6 to shorten the length.

:param str ipAddress: (Required) IPv6 address.
:return: Returns the compressed version of IPv6 address.
:rtype: str
```

```{py:function} expandIPV6(ipAddress)
Expand a shorten IPv6 to full length.

:param str ipAddress: (Required) IPv6 address.
:return: Returns the extended version of IPv6 address.
:rtype: str
```

## Country Class

```{py:class} Country(csvFilePath)
Initiate Ip2locationCountry class and load the IP2Location Country Information CSV file. This database is free for download at <https://www.ip2location.com/free/country-information>.

:param str csvFilePath: (Required) The file path links to IP2Location Country Information CSV file.
```

```{py:function} getCountryInfo(countryCode)
Provide a ISO 3166 country code to get the country information in array. Will return a full list of countries information if country code not provided. 

:param str countryCode: (Required) The ISO 3166 country code of a country.
:return: Returns the country information in array. Refer below table for the fields avaliable in the array.
:rtype: array

**RETURN FIELDS**

| Field Name       | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| countryCode     | Two-character country code based on ISO 3166.                |
| countryAlpha3Code | Three-character country code based on ISO 3166.           |
| countryNumericCode | Three-character country code based on ISO 3166.          |
| capital          | Capital of the country.                                      |
| countryDemonym  | Demonym of the country.                                      |
| totalArea       | Total area in km{sup}`2`.                                    |
| population       | Population of year 2014.                                     |
| idd_code         | The IDD prefix to call the city from another country.        |
| currencyCode    | Currency code based on ISO 4217.                             |
| currencyName    | Currency name.                                               |
| currencySymbol  | Currency symbol.                                             |
| langCode        | Language code based on ISO 639.                              |
| langName        | Language name.                                               |
| cctld            | Country-Code Top-Level Domain.                               |
```

## Region Class

```{py:class} Region(csvFilePath)
Initiate Ip2locationRegion class and load the IP2Location ISO 3166-2 Subdivision Code CSV file. This database is free for download at <https://www.ip2location.com/free/iso3166-2>

:param str csvFilePath: (Required) The file path links to IP2Location ISO 3166-2 Subdivision Code CSV file.
```

```{py:function} getRegionCode(countryCode, regionName)
Provide a ISO 3166 country code and the region name to get ISO 3166-2 subdivision code for the region.

:param str countryCode: (Required) Two-character country code based on ISO 3166.
:param str regionName: (Required) Region or state name.
:return: Returns the ISO 3166-2 subdivision code of the region.
:rtype: str
```