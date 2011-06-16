JavaScript Utilities Library
============================

A library of common, highly reusable JavaScript utility functions.

Most of the functions deal with extending JavaScript's native data types, which I am doing by default at the end of the file.

Usage
-----

By default, data type extensions are applied automatically. So you can call `"test".count('t')`, for instance, right out of the box.
If you wish to change this behavior simply comment out (or delete) the last section of the code.

Beyond that, all functions live nested in the `UTIL` object under the `JMM` object for the time being&mdash;this is a holdover from my legacy code which will eventually go away.
You can, of course, alias the functions to whatever name you would like (e.g. `formatDate = JMM.UTIL.dateFormat;`).

Unit Tests
----------

Using [JasmineBDD](http://pivotal.github.com/jasmine/) I have built unit tests for this library. All tests can be found under the `spec/` directory.

i18n
----

Localization can be accomplished for `dateFormat` by setting the names as a hash on the function object. To implement Spanish, for example:

	JMM.UTIL.dateFormat.i18n = {
		dayNames: [
			"dom", "lun", "mar", "mié", "jue", "vie", "sáb",
			"domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"
		],
		monthNames: [
			"enero", "feb", "marzo", "abr", "mayo", "jun", "jul", "agosto", "set", "oct", "nov", "dic",
			"enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
		]
	};

Localization of the `strToDate` function is slightly more involved, but should be fairly flexible.
First, add to the `i18n` hash on the `strToDate` function a hash with the month names as the keys and a 0-based index as the value.

	JMM.UTIL.strToDate.i18n = {
		months: {
			'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5, 'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
			, 'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'sept': 8, 'oct': 9, 'nov': 10, 'dec': 11
		},
		meses: { // Spanish (which is included by default)
			'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 12
			, 'feb': 1, 'abr': 3, 'jun': 5, 'jul': 6, 'set': 8, 'oct': 9, 'nov': 10, 'dic': 11
		}
	};

Secondly, add a new hash to the `strToDate.patterns` hash which has a RegExp object (the "matcher") and a function to interpret matches (the "handler").

	JMM.UTIL.strToDate.patterns = {
		... // omitted
		, textual_es: { // Spanish (which is included by default)
			matcher: /(\d{1,2})[- ]?(Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre|Feb|Abr|Jun|Jul|Set|Oct|Nov|Dic)[- ]?(\d{4})/i
			, handler: function(matches, self) { return new Date(matches[3], self.i18n.meses[matches[2].toLowerCase()], matches[1]); }
		}
	};

Copyright information
---------------------

* Copyright &copy; 2011, Jeremy McDuffie, all rights reserved
* Dual-licensed under the BSD and MIT licenses