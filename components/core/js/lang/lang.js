'use strict';

var Lang = {
	localShortMonths: function(lang) {
		if (lang === undefined) {
			lang = navigator.language;
		}
		var formatter = null;
		
		if (window.Intl !== undefined) {
			formatter = new Intl.DateTimeFormat(lang, {
				month: 'short',
                timeZone: 'UTC'
			});
		} else {
			formatter = {
				format: function(date) {
					return date.toUTCString().split(' ')[2]
				}
			}
		}
		return Array.apply(null, Array(12)).map(function(_, i) {
			return formatter.format(new Date(Date.UTC(2014, i, 7)));
		});
	},
    localShortWeekday: function(lang) {
        if (lang === undefined) {
            lang = navigator.language;
        }
        var formatter = null;

        if (window.Intl !== undefined) {
            formatter = new Intl.DateTimeFormat(lang, {
                weekday: 'short',
                timeZone: 'UTC'
            });
        } else {
            formatter = {
            format: function(date) {
                return date.toUTCString().split(' ')[0].substring(0, 3)
            }
            }
        }
        return Array.apply(null, Array(7)).map(function(_, i) {
            return formatter.format(new Date(Date.UTC(2014, 1, i+2)));
        });
    }	    	
};

if (typeof module !== 'undefined' && module.exports) { module.exports = Lang; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return Lang; }); } // AMD
