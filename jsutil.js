/*
 * Import the UTIL package into the JMM object
 */
var JMM = JMM || {};
JMM.UTIL = JMM.UTIL || {};

/**
 * Retrieves a value from the query string based on the specified key
 * @author Jeremy McDuffie (http://jmmcduffie.com)
 * @version 1.0
 * @param {String} n the key of the value to retrieve
 * @return {String} the value of the passed-in key or an empty string
 */
JMM.UTIL.getUrlVal=function(n){n=n.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");var r=new RegExp("[\\?&]"+n+"=([^&#]*)");var v=r.exec(window.location.href);if(v==null)return"";else return v[1];}

/**
 * Pads a string to the specified length by the specified character or "0" by default
 * @author Jeremy McDuffie (http://jmmcduffie.com)
 * @version 1.1
 * @param {String} string If called as a static method, the string to pad or object to be converted to a string and padded
 * @param {Number} len The desired length
 * @param {String} ch The character with which to pad or "0" by default
 * @param {String} right If true the padding will be done on the right side of the string
 * @return {String} The newly padded string
 */

JMM.UTIL.pad = function(str, len, ch, right) {
	
	var str = str.toString()
		, len = parseInt(len,10) || 2
		, ch = ch || 0;
	
	if (!str) throw SyntaxError('Invalid string');
	if (!len) throw SyntaxError('Length must be a valid number');
	
	while (str.length < len) {
		if (right) str += ch;
		else str = ch + str;
		// Trim the string if it's too long
		if (str.length > len) {
			if (right) str = str.slice(0, len);
			else str = str.slice(str.length - len);
		}
	}
	
	return str;
	
};

/**
 * Converts a string into a Date object
 * @author Jeremy McDuffie (http://jmmcduffie.com)
 * @version 1.0
 * @param {String} str The string to be converted into a date
 * @return {Object} A date object created from the specified string
 */
JMM.UTIL.strToDate = function() {
	// Hand back the conversion function
	return function(str) {
		var self = JMM.UTIL.strToDate;
		for (var p in self.patterns) {
			if (matches = self.patterns[p].matcher.exec(str)) return self.patterns[p].handler(matches, self);
		}
		return null;
	};
	
}();

JMM.UTIL.strToDate.patterns = {
	numeric_standard: {
		matcher: /(\d{4})[-\/\.](\d{1,2})(?:[-\/\.](\d{1,2}))?/
		, handler: function(matches) { return new Date(matches[1], matches[2] - 1 || 0, matches[3] || 1); }
	}
	, numeric_american: {
		matcher: /(\d{1,2})[-\/\.](\d{1,2})[-\/\.](\d{4})/
		, handler: function(matches) { return new Date(matches[3], matches[1] - 1, matches[2]); }
	}
	, textual_en_standard: {
		matcher: /(?:(\d{1,2})[- ])?(January|Febraury|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[- ]?(\d{4})/i
		, handler: function(matches, self) { return new Date(matches[3], self.i18n.months[matches[2].toLowerCase()], matches[1] || 1); }
	}
	, textual_en_american: {
		matcher: /(January|Febraury|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec) (\d{1,2}) (\d{4})/i
		, handler: function(matches, self) { return new Date(matches[3], self.i18n.months[matches[1].toLowerCase()], matches[2]); }
	}
	, textual_es: {
		matcher: /(\d{1,2})[- ]?(Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre|Feb|Abr|Jun|Jul|Set|Oct|Nov|Dic)[- ]?(\d{4})/i
		, handler: function(matches, self) { return new Date(matches[3], self.i18n.meses[matches[2].toLowerCase()], matches[1]); }
	}
};

JMM.UTIL.strToDate.i18n = {
	months: {
		'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5, 'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
		, 'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'sept': 8, 'oct': 9, 'nov': 10, 'dec': 11
	},
	meses: {
		'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 12
		, 'feb': 1, 'abr': 3, 'jun': 5, 'jul': 6, 'set': 8, 'oct': 9, 'nov': 10, 'dic': 11
	}
};

/**
 * Counts the number of occurrences of one string in another
 * @author Jeremy McDuffie (http://jmmcduffie.com)
 * @version 1.0
 * @param {Object} str The source string (or object than can be converted to a string)
 * @param {String} chs The character(s) to search for in the string
 * @return {Number} The count
 */
JMM.UTIL.stringCount = function(str, chs) {
	if (str == undefined || chs == undefined) throw new SyntaxError('Required parameters are missing');
	str = str.toString(); chs = chs.toString();
	if (chs.length === 0) return 0;
    return parseInt((str.length - str.replace(new RegExp(JMM.UTIL.regExpEscape(chs),"g"), '').length) / chs.length, 10);
};

/**
 * Formats a number using the provided mask
 * @author Jeremy McDuffie (http://jmmcduffie.com)
 * @version 1.1
 * @param {Number} num The number to be formatted
 * @param {Object} mask The criteria for formatting the number.
 * @return {String} The newly formatted number
 */
JMM.UTIL.numberFormat = function(num, mask) {
	
	var format = /^(\+|\-|\()?(\$)?(\,)?(\.0*)?\)?$/
		, comma_pattern = /(\d+)(\d{3})/;
	
	return function(num, mask){
		
		// only accepts numbers
		if (Number(num).toString() != num.toString() || isNaN(num)) throw new SyntaxError('Non-numeric input');
		
		// mask must match the RegExp pattern
		var mask = (mask != undefined) ? mask : ','
			, matches = format.exec(mask);
		if (!matches) throw new SyntaxError('Illegal character(s) or improperly formatted mask');
		
		// set up the different formatting rules
		var s = num.toString().replace('-','')
			, signed = matches[1] || false
			, currency = matches[2] || false
			, commas = matches[3] || false
			, fixed = matches[4] || false
		
		// Handle decimal place setting
		if (fixed) s = num.toFixed(JMM.UTIL.stringCount(fixed, '0'));
		
		// Handle comma separation
		if (commas) {
			var pieces = s.split('.');
			while (comma_pattern.test(pieces[0])) pieces[0] = pieces[0].replace(comma_pattern, "$1,$2");
			s = pieces.join('.');
		}
		
		// Handle currency
		if (currency) s = (num < 0) ? '-$' + s.replace('-','') : '$' + s;
		
		// Handle signed numbers
		if (signed) s = s.replace('-','');
		if (signed == '+') s = (num > 0) ? '+' + s : (num < 0) ? '-' + s : ' ' + s;
		else if (signed == '-') s = (num >= 0) ? ' ' + s : '-' + s;
		else if (signed == '(') s = (num >= 0) ? ' ' + s + ' ' : '(' + s + ')';
		
		return s;
	};
}();

/**
 * Changes the specified part of a date by the specified increment
 * @author Jeremy McDuffie (http://jmmcduffie.com)
 * @version 1.1
 * @param {Date} date If called as a static method, the object on which to perform the change
 * @param {String} part The part of the date to change as a member of the set (y|m|d|h|n|s|l|w) with n=minute and l=millisecond
 * @param {Number} num The increment by which to change the date as an integer value
 * @return {Date} If called as a static method, a copy of the supplied date with the changes applied. If called on an instance, that instance with the changes applied.
 */
JMM.UTIL.dateAdd = function(date, part, num) {
	
	if (arguments.length == 2 && !(date instanceof Date))
		var num = part, part = date, date = new Date();
	
	num = parseInt(num, 10);
	if(!(date instanceof Date) || date.toString() == 'Invalid Date') throw SyntaxError('Invalid date');
	if(!/^(y|m|d|h|n|s|l|w)$/.test(part)) throw SyntaxError('Invalid datepart');
	if(!num) throw SyntaxError('Invalid number');
		
	if (this instanceof Date) date = this;
	else date = new Date(date.getTime());
	
	switch (part) {
		case 'y': date.setFullYear(date.getFullYear() + num);         break;
		case 'm': date.setMonth(date.getMonth() + num);               break;
		case 'd': date.setDate(date.getDate() + num);                 break;
		case 'h': date.setHours(date.getHours() + num);               break;
		case 'n': date.setMinutes(date.getMinutes() + num);           break;
		case 's': date.setSeconds(date.getSeconds() + num);           break;
		case 'l': date.setMilliseconds(date.getMilliseconds() + num); break;
		case 'w': date.setDate(date.getDate() + num * 7);             break;
	}
	
	return date;
};

/**
 * @author Steven Levithan <stevenlevithan.com>, Scott Trenda <scott.trenda.net>, Kris Kowal <cixar.com/~kris.kowal/>
 * @version 1.2.3
 * @license MIT
 * @copyright 2007-2009
 * @param {Date} date The date to format, defaulting to the current date/time
 * @param {String} mask The mask to use, defaulting to dateFormat.masks.default
 * @param {Boolean} utc Whether to use UTC dates or not, defaulting to false
 * @return {String} A formatted version of the given date
 */
JMM.UTIL.dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = JMM.UTIL.dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
JMM.UTIL.dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
JMM.UTIL.dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

/**
 * Escapes any characters that have a special meaning in regular expressions
 * @author Jeremy McDuffie (http://jmmcduffie.com)
 * @version 1.0
 * @param {String} text The text to be sanitized
 * @return {String} The newly sanitized text
 */
JMM.UTIL.regExpEscape = function(text) {
    return String(text||'').replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

/*
 * Extend Native Objects
 */

// STRING
String.pad=JMM.UTIL.pad;String.prototype.pad=function(l,c,d){return JMM.UTIL.pad(this,l,c,d)};
String.count=JMM.UTIL.stringCount;String.prototype.count=function(c){return JMM.UTIL.stringCount(this,c)};
String.toDate=JMM.UTIL.strToDate;String.prototype.toDate=function(){return JMM.UTIL.strToDate(this)};

// NUMBER
Number.format=JMM.UTIL.numberFormat;Number.prototype.format=function(m){return JMM.UTIL.numberFormat(this,m)};

// DATE
Date.add=Date.prototype.add=JMM.UTIL.dateAdd;
Date.format=JMM.UTIL.dateFormat;Date.prototype.format=function(m,u){return Date.format(this,m,u)};

// REGEXP
RegExp.escape=JMM.UTIL.regExpEscape;