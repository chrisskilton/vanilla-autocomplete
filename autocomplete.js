'use strict';

const autocomplete = options => {
    const el = options.el;
    const url = options.url;
    let latestValue = '';
    let latestFetch;

    function debounce(func, wait, immediate) {
        var timeout,
            args,
            context,
            timestamp,
            result;

        var later = function() {
          var last = Date.now() - timestamp;

          if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
          } else {
            timeout = null;
            if (!immediate) {
              result = func.apply(context, args);
              if (!timeout) context = args = null;
            }
          }
        };

        return function() {
          context = this;
          args = arguments;
          timestamp = Date.now();
          var callNow = immediate && !timeout;
          if (!timeout) timeout = setTimeout(later, wait);
          if (callNow) {
            result = func.apply(context, args);
            context = args = null;
          }

          return result;
        };
    }

    function renderResults(data) {
        let results;

        if (Array.isArray(data) && data.length) {
            results = data;
        } else if (typeof data === 'string') {
            results = data;
        } else {
            results = 'No results';
        }

        document.getElementById('results').innerHTML = results;
    }

    el.addEventListener('keyup', debounce(e => {
        let value = e.target.value;

        if (value === '') {
            latestValue = value;
            return renderResults('Start typing to filter results');
        }

        if(value === latestValue) {
            return;
        }

        if (latestFetch) {
            latestFetch.abort();
        }

        latestValue = value;

        latestFetch = new XMLHttpRequest();
        latestFetch.overrideMimeType('application/json');
        latestFetch.open('GET', url + value, true);

        latestFetch.onload  = () => {
            renderResults(JSON.parse(latestFetch.responseText));
        };

        latestFetch.send(null);
    }), 600, true);
}