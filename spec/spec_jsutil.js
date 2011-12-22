describe('String.pad', function() {
	
	beforeEach(function() {
		old_string = 'test';
	});
	
	describe('when called as a static method', function() {
		
		it('should convert non-strings into strings before padding', function() {
			var new_string = String.pad(1234, 10);
			expect(new_string.length).toEqual(10);
			var newer_string = String.pad(new Date(), 60, 'X');
			expect(newer_string.length).toEqual(60);
		});
		
		it('should pad to two characters on the left with "0" by default', function() {
			var new_string = String.pad('t');
			expect(new_string.length).toEqual(2);
			expect(new_string[0]).toBe('0');
		});
		
		it('should pad to the specified length with the specified character on the specified side', function() {
			var new_string = String.pad(old_string,10,'X',true);
			expect(new_string.length).toEqual(10);
			expect(new_string.indexOf('X')).toEqual(4);
		});
		
	});

	describe('when called as an instance method', function() {
		
		it('should pad to two characters by default', function() {
			var short_string = "t"
				, new_string = short_string.pad();
			expect(new_string.length).toEqual(2);
		});
		
		it('should pad strings to a specified length', function() {
			var new_string = old_string.pad(10);
			expect(new_string.length).toEqual(10);
			new_string = old_string.pad(5);
			expect(new_string.length).toEqual(5);
		});
		
		it('should do nothing when the specified length is less than or equal to the string length', function() {
			var new_string = old_string.pad(3);
			expect(new_string.length).toEqual(4);
			var new_string = old_string.pad(1);
			expect(new_string.length).toEqual(4);
		});
		
		it('should make the string fit the specified length even if the padding string is too long', function() {
			var left_string = old_string.pad(10,'test');
			expect(left_string).toEqual('sttesttest');
			var right_string = old_string.pad(10,'test',true);
			expect(right_string).toEqual('testtestte');
		});
		
		it('should pad with "0" by default', function() {
			var new_string = old_string.pad(10);
			expect(new_string.indexOf('0')).toBeGreaterThan(-1);
		});
		
		it('should pad strings using a specified character', function() {
			var new_string = old_string.pad(10,'X');
			expect(new_string.indexOf('X')).toBeGreaterThan(-1);
		});
		
		it('should pad on the left by default', function() {
			var new_string = old_string.pad(10);
			expect(new_string[0]).toBe('0');
		});
		
		it('should pad on the right when specified', function() {
			var new_string = old_string.pad(10,'X',true);
			expect(new_string.indexOf('X')).toEqual(4);
		});
		
	});

});

describe('String.count', function() {
	
	var test = 'abcdefg1234567,abcdefg,0000000';
	
	it('counts the occurences of a single character spread out in a larger string', function() {
		var count = JSUTIL.stringCount(test, 'a');
		expect(count).toEqual(2);
	});
	
	it('counts the occurrences of a single character grouped together in a larger string', function() {
		var count = JSUTIL.stringCount(test, '0');
		expect(count).toEqual(7);
	});
	
	it('counts the occurrences of a phrase in a larger string', function () {
		var count = JSUTIL.stringCount(test, '00');
		expect(count).toEqual(3);
	});
	
	it('returns 0 when the character(s) is not found in the string', function() {
		var count = JSUTIL.stringCount(test, 'x');
		expect(count).toEqual(0);
	});
	
	it('is case sensitive', function() {
		var count = JSUTIL.stringCount(test, 'A');
		expect(count).toEqual(0);
	});
	
	it('ignores RegExp special character meanings', function() {
		var count = JSUTIL.stringCount(test, '.');
		expect(count).toEqual(0);
	});
	
	it('correctly counts characters with special meanings in a RegExp', function() {
		var count = JSUTIL.stringCount(test, ',');
		expect(count).toEqual(2);
	});
	
	it('converts numbers into strings', function() {
		var count = JSUTIL.stringCount(test, 0);
		expect(count).toEqual(7);
	});
	
	it('thows a SyntaxError when no parameters are passed in', function() {
		expect(function() {
			JSUTIL.stringCount();
		}).toThrow('Required parameters are missing');
	});
	
	if (String.count) {
		it('works when called as a static method on String', function() {
				var count = String.count(test, 'a');
				expect(count).toEqual(2);
		});
	}
	
	if (String.prototype.count) {
		it('works when called as an instance method', function() {
				var count = test.count('a');
				expect(count).toEqual(2);
		});
	}
	
});

describe('String.toDate', function() {
	
	it('handles strings formatted like yyyy/m/d', function() {
		var date = '2011/4/1', result = JSUTIL.strToDate(date);
		expect(result.getFullYear()).toBe(2011);
		expect(result.getMonth()).toBe(3);
		expect(result.getDate()).toBe(1);
	});
	
	it('handles strings formatted like yyyy.mm.dd', function() {
		var date = '2011.04.01', result = JSUTIL.strToDate(date);
		expect(result.getFullYear()).toBe(2011);
		expect(result.getMonth()).toBe(3);
		expect(result.getDate()).toBe(1);
	});
	
	it('handles strings formatted like yyyy-mm or mmmm yyyy', function() {
		var date = '2011-04', result = JSUTIL.strToDate(date);
		expect(result.getFullYear()).toBe(2011);
		expect(result.getMonth()).toBe(3);
		date = 'April 2011', result = JSUTIL.strToDate(date);
		expect(result.getFullYear()).toBe(2011);
		expect(result.getMonth()).toBe(3);
	});
	
	it('handles strings formatted like d mmm yyyy', function() {
		var date = '1 Apr 2011', result = JSUTIL.strToDate(date);
		expect(result.getFullYear()).toBe(2011);
		expect(result.getMonth()).toBe(3);
		expect(result.getDate()).toBe(1);
	});
	
	it('handles strings formatted like ddmmmmyyyy', function() {
		var date = '01April2011', result = JSUTIL.strToDate(date);
		expect(result.getFullYear()).toBe(2011);
		expect(result.getMonth()).toBe(3);
		expect(result.getDate()).toBe(1);
	});
	
	it('handles strings formatted like dd-mmm-yyyy', function() {
		var date = '01-Apr-2011', result = JSUTIL.strToDate(date);
		expect(result.getFullYear()).toBe(2011);
		expect(result.getMonth()).toBe(3);
		expect(result.getDate()).toBe(1);
	});
	
	it('handles internationalized strings with the appropriate extensions', function() {
		var date = '01 Abril 2011', result = JSUTIL.strToDate(date);
		expect(result.getFullYear()).toBe(2011);
		expect(result.getMonth()).toBe(3);
		expect(result.getDate()).toBe(1);
	});
	
	it('handles a string with extra information like weekday or time', function() {
		var date = 'Fri, 01 Apr 2011 08:30 AM', result = JSUTIL.strToDate(date);
		expect(result.getFullYear()).toBe(2011);
		expect(result.getMonth()).toBe(3);
		expect(result.getDate()).toBe(1);
	});
	
	it('returns null if it doesn\'t understand the string', function() {
		var date = 'jellyfish', result = JSUTIL.strToDate(date);
		expect(result).toBe(null);
	});
	
	if (String.toDate) {
		it('works when called as a static method of String', function() {
			var date = 'Fri, 01 Apr 2011 08:30 AM', result = String.toDate(date);
			expect(result.getFullYear()).toBe(2011);
			expect(result.getMonth()).toBe(3);
			expect(result.getDate()).toBe(1);
		});
	}
	
	if (String.prototype.toDate) {
		it('works when called as an instance method', function() {
			var date = 'Fri, 01 Apr 2011 08:30 AM', result = date.toDate();
			expect(result.getFullYear()).toBe(2011);
			expect(result.getMonth()).toBe(3);
			expect(result.getDate()).toBe(1);
		});
	}
	
});

describe('Number.format', function() {
	
	var num = 123456789.097531;
	
	it('signs a positive number with "+" when "+" is specified in the mask', function() {
		var formatted = JSUTIL.numberFormat(num, '+');
		expect(formatted[0]).toBe('+');
	});
	
	it('signs a negative number with "-" when "+" is specified in the mask', function() {
		var formatted = JSUTIL.numberFormat(num*-1, '+');
		expect(formatted[0]).toBe('-');
	});
	
	it('adds space before a positive number when "-" is specified in the mask', function() {
		var formatted = JSUTIL.numberFormat(num, '-');
		expect(formatted[0]).toBe(' ');
	});
	
	it('signs a negative number with "-" when "-" is specified in the mask', function() {
		var formatted = JSUTIL.numberFormat(num*-1, '-');
		expect(formatted[0]).toBe('-');
	});
	
	it('adds space before and after a positive number when "(" and optionally ")" is specified in the mask', function() {
		var formatted = JSUTIL.numberFormat(num, '(');
		expect(formatted[0]).toBe(' ');
		expect(formatted[formatted.length-1]).toBe(' ');
		expect(formatted.indexOf('-')).toEqual(-1);
	});
	
	it('signs a negative number with "()" when "(" and optionally ")" is specified in the mask', function() {
		var formatted = JSUTIL.numberFormat(num*-1, '()');
		expect(formatted[0]).toBe('(');
		expect(formatted[formatted.length-1]).toBe(')');
	});
	
	it('adds "$" before a number when "$" is specified in the mask', function() {
		var formatted = JSUTIL.numberFormat(num, '$');
		expect(formatted[0]).toBe('$');
	});
	
	it('adds commas as a thousands separator when "," is specified in the mask', function() {
		var formatted = JSUTIL.numberFormat(num, ',');
		expect(formatted.indexOf(',')).toBeGreaterThan(0);
		expect(formatted.length).toEqual(18);
	});
	
	it('trims off decimals when "." is specified without any zeroes', function() {
		var formatted = JSUTIL.numberFormat(num, '.');
		expect(formatted.length).toEqual(9);
	});
	
	it('fixes the number of decimal places when "." is specified followed by one or more zeroes', function() {
		var formatted_with_less = JSUTIL.numberFormat(num, '.00');
		expect(formatted_with_less.length).toEqual(12);
		var formatted_with_more = JSUTIL.numberFormat(num, '.00000000');
		expect(formatted_with_more.length).toEqual(18);
	});
	
	it('applies more than one formatting rule if multiple rules are specified in the mask', function() {
		var formatted = JSUTIL.numberFormat(num, '-$,.00');
		expect(formatted.length).toEqual(16);
	});
	
	it('adds commas as a thousands separator by default if no mask is specified', function() {
		var formatted = JSUTIL.numberFormat(num);
		expect(formatted.indexOf(',')).toBeGreaterThan(0);
		expect(formatted.length).toEqual(18);
	});
	
	it('throws an error when not given a mask in the correct format', function() {
		expect(function() {
			JSUTIL.numberFormat(num, 'jellyfish');
		}).toThrow('Illegal character(s) or improperly formatted mask');
	});
	
	it('throws an error when passed NaN', function() {
		expect(function() {
			JSUTIL.numberFormat(NaN, ',.00');
		}).toThrow('Non-numeric input');
	});
	
	if (Number.format) {
		it('works when called as a static method of Number', function() {
				var formatted = Number.format(num, '-$,.00');
				expect(formatted.length).toEqual(16);
		});
	}
	
	if (Number.prototype.format) {
		it('works when called as an instance method', function() {
				var formatted = num.format('-$,.00');
				expect(formatted.length).toEqual(16);
		});
	}
	
});

describe('Date.add', function() {
	
	beforeEach(function() {
		old_date = new Date();
	});
	
	describe('when called as a static method', function () {
		
		it('should not alter the date object passed in', function() {
			var new_date = Date.add(old_date,'m',1);
			expect(new_date).not.toBe(old_date);
		});
		
		it('should throw an error when given an invalid date object', function() {
			expect(function() {
				Date.add('jellyfish', 'm', 1);
			}).toThrow('Invalid date');
			expect(function() {
				Date.add(new Date('jellyfish'), 'm', 1);
			}).toThrow('Invalid date');
		});
		
		it('should change the year when datepart is "y"', function() {
			var new_date = Date.add(old_date, 'y', 3);
			expect(new_date.getFullYear()).not.toEqual(old_date.getFullYear());
		});
		
		it('should change the hours when datepart is "h"', function() {
			var new_date = Date.add(old_date, 'h', 3);
			expect(new_date.getHours()).not.toEqual(old_date.getHours());
		});
		
		it('should change the week when datepart is "w"', function() {
			var new_date = Date.add(old_date, 'w', 3);
			expect(new_date.getDate()).not.toEqual(old_date.getDate());
			expect(new_date.getDay()).toEqual(old_date.getDay());
		});
		
		it('should throw an error when given an invalid datepart', function() {
			expect(function () {
				Date.add(old_date, 'jellyfish', 1);
			}).toThrow('Invalid datepart');
		});
		
		it('should produce a later date when given a positive increment', function() {
			var new_date = Date.add(old_date, 'm', 5);
			expect(new_date).toBeGreaterThan(old_date);
		});
		
		it('should throw an error when given a non-numeric increment', function() {
			expect(function () {
				Date.add(old_date, 'm', 'jellyfish');
			}).toThrow('Invalid number');
		});
		
	});
	
	describe('when called as an instance method', function () {
		
		beforeEach(function() {
			original_date = new Date(old_date.getTime());
		});
		
		it('should alter the date object on which it was called', function() {
			var new_date = old_date.add('m', 1);
			expect(new_date).toBe(old_date);
		});
		
		it('should change the year when datepart is "y"', function() {
			old_date.add('y', 3);
			expect(old_date.getFullYear()).not.toEqual(original_date.getFullYear());
		});
		
		it('should change the month when datepart is "m"', function() {
			old_date.add('m', 3);
			expect(old_date.getMonth()).not.toEqual(original_date.getMonth());
		});
		
		it('should change the day when datepart is "d"', function() {
			old_date.add('d', 3);
			expect(old_date.getDate()).not.toEqual(original_date.getDate());
		});
		
		it('should change the hours when datepart is "h"', function() {
			old_date.add('h', 3);
			expect(old_date.getHours()).not.toEqual(original_date.getHours());
		});
		
		it('should change the minutes when datepart is "n"', function() {
			old_date.add('n', 3);
			expect(old_date.getMinutes()).not.toEqual(original_date.getMinutes());
		});
		
		it('should change the seconds when datepart is "s"', function() {
			old_date.add('s', 3);
			expect(old_date.getSeconds()).not.toEqual(original_date.getSeconds());
		});
		
		it('should change the milliseconds when datepart is "l"', function() {
			old_date.add('l', 3);
			expect(old_date.getMilliseconds()).not.toEqual(original_date.getMilliseconds());
		});
		
		it('should change the week when datepart is "w"', function() {
			old_date.add('w', 3);
			expect(old_date.getDate()).not.toEqual(original_date.getDate());
			expect(old_date.getDay()).toEqual(original_date.getDay());
		});
		
		it('should throw an error when given an invalid datepart', function() {
			expect(function () {
				old_date.add('jellyfish', 1);
			}).toThrow('Invalid datepart');
		});
		
		it('should produce a later date when given a positive increment', function() {
			old_date.add('m', 5);
			expect(old_date).toBeGreaterThan(original_date);
		});
		
		it('should produce an earlier date when given a negative increment', function() {
			old_date.add('m', -5);
			expect(old_date).toBeLessThan(original_date);
		});
		
		it('should throw an error when given a non-numeric increment', function() {
			expect(function () {
				old_date.add('m', 'jellyfish');
			}).toThrow('Invalid number');
		});
		
	});
	
});

describe('RegExp.escape', function() {
	
	var chars = new String("-[\]{}()*+?.,\\^$|#");
	
	it('escapes characters which have a special meaning in a RegExp', function() {
		var escaped = JSUTIL.regExpEscape(chars)
			, result = new RegExp(escaped).test(chars);
		expect(result).toBe(true);
	});
	
	it('converts numbers into strings', function() {
		var escaped = JSUTIL.regExpEscape(1234567890);
		expect(escaped).toEqual("1234567890");
	});
	
	it('returns an empty string if no arguments are supplied', function() {
		var escaped = JSUTIL.regExpEscape();
		expect(escaped).toBe('');
	});
	
	if (RegExp.escape) {
		it('works when called as a static method of RegExp', function() {
			var escaped = RegExp.escape(chars)
				, result = new RegExp(escaped).test(chars);
			expect(result).toBe(true);
		});
	}
	
});

describe('JSUTIL', function() {
	
	describe('getUrlVal', function() {
		
		it('should return bar when passed foo (if set)', function() {
			var val = JSUTIL.getUrlVal('foo');
			if (window.location.href && window.location.href.indexOf('foo=') >= 0)
				expect(val).toEqual('bar');
			else
				expect(val).toEqual('');
		});
		
		it('should return an empty string if the value does not exist', function() {
			var val = JSUTIL.getUrlVal('jellyfish');
			if (window.location.href && window.location.href.indexOf('jellyfish') < 0)
				expect(val).toEqual('');
		});
		
	});
	
});