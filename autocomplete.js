'use strict';

const autocomplete = options => {
    const el = options.el;
    const url = options.url;
    let latestValue = '';
    let latestFetch;

    function debounce(func, delay) {
        let time;
        let timeout;

        return function() {
            let args = arguments;
            let timeelapsed = (Date.now() - time);

            if (time &&  timeelapsed < delay) {
                if (timeout) {
                    clearTimeout(timeout);
                }

                timeout = setTimeout(function() {
                    func.apply(null, args);
                }, timeelapsed - delay);
                time = Date.now();

                return;
            }

            func.apply(null, args);
            time = Date.now();
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
    }), 600);
}