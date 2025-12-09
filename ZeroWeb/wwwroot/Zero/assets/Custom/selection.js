class Selection {
    #control;
    #controlTagName = '';
    #controlData = {};
    #data = new Map();
    #path = '';
    #method = HttpMethod.GET;
    #query = {};
    #content = {};
    #searchKey = '';
    #processCallback;

    constructor(control, args, ajaxArgs) {
        this.#control = control;
        this.#controlTagName = control.get(0).tagName.toLowerCase();

        if (args) {
            this.#data = args.data || new Map();
        }

        if (ajaxArgs) {
            this.#path = ajaxArgs.path || '';
            this.#method = ajaxArgs.method || HttpMethod.GET;
            this.#query = ajaxArgs.query || {};
            this.#content = ajaxArgs.content || {};
            this.#searchKey = ajaxArgs.searchKey;
            this.#processCallback = ajaxArgs.processCallback;
        }

        this.#controlData = {
            width: '100%',
            allowClear: true,
            placeholder: I18Next.translate(control.data('placeholder')),
            pageSize: parseInt(control.data('pageSize')) || 10,
            minimumInputLength: parseInt(control.data('minimumInputLength')) || 0,
            maximumInputLength: parseInt(control.data('maximumInputLength')) || 250,
            delay: parseInt(control.data('delay')) || 250,
            scrollAfterSelect: Helpers.isInArray(['', 'multiple'], control.data('multiple')),
            multiple: Helpers.isInArray(['', 'multiple'], control.data('multiple')),
            cache: Helpers.isInArray(['', 'cache'], control.data('cache')),
        };

        this.format();
    }

    /**
     * Format selection.
     * @param {Map} data - an Map object.
     * @param {any} defaultValue - a value or an array of values.
     */
    format(defaultValue) {
        this.setSelectedValue(this.#control);

        if (!Helpers.isInArray(['select', 'input'], this.#controlTagName)) {
            return;
        }

        let options = this.#buildDefaultOptions();

        if (this.#controlTagName === 'input') {
            options = this.#buildInputOptions(options);
        }

        this.#control.select2(options);

        this.setSelectedValue(defaultValue);
    }

    /**
     * Format selection with API using ajax
     */
    formatWithAjax(defaultValue) {
        this.setSelectedValue(this.#control);

        if (!Helpers.isInArray(['input'], this.#controlTagName)) {
            return;
        }

        const client = new Client({ path: this.#path, method: this.#method, query: this.#query, content: this.#content });
        const defaultRequestUrl = client.buildRequestUrl();
        const defaultRequestOptions = client.buildRequestOptions();

        const options = this.#buildAjaxOptions(this.#buildDefaultOptions(), defaultRequestUrl, defaultRequestOptions);

        this.#control.select2(options);

        this.setSelectedValue(defaultValue);
    }

    /**
     * Get selected data of selection. The returned data is an object or an array of objects. The object contains two properties (id and text).
    */
    getSelectedItem() {
        return this.#control.select2('data');
    }

    /**
     * Get selected data of selection. The returned data is a value or an array of values.
     */
    getSelectedValue() {
        return this.#control.select2('val');
    }

    /**
     * Get first selected data of selection. The returned data is a value or an array of values.
     */
    getFirstValue() {
        const data = this.getDataset();
        if (data) {
            const [firstKey] = data.keys();
            return firstKey;
        }

        if (this.#controlTagName === 'select') {
            return this.#control.find('option[value]').val();
        }
    }

    /**
     * Get data of selection. The returned data is a Map object.
     */
    getDataset() {
        return this.#control.data("select2")?.opts?.data;
    }

    /**
     * Set selected data to selection.
     * @param {any} value - a value or an array of values.
     */
    setSelectedValue(value) {
        if (!value) {
            return this.#control.select2('val', value);
        }

        const data = this.getDataset();

        if (!data) {
            return this.#control.select2('val', value);
        }

        if (value.constructor.name === 'Array') {
            return this.#control.select2('data', value.map(x => data.has(x) ? { id: x, text: data.get(x) } : data.get(x)));
        }
        else {
            return this.#control.select2('data', data.has(value) ? { id: value, text: data.get(value) } : data.get(value));
        }
    }

    /**
     * Add data to selection by specific value.
     * @param {any} value - a value or an array of objects. The object contains two properties (id and text).
     */
    insertData(value) {
        if (!value) {
            return;
        }

        const data = this.getDataset();

        if (!data) {
            return;
        }

        if (value.constructor.name === 'Array') {
            value.forEach(x => data.set(x.id, x.text));
        }
        else if (value.constructor.name === 'Object') {
            data.set(value.id, value.text);
        }
        else {
            data.set(value, value);
        }
    }

    /**
     * Remove data from selection by specific value.
     * @param {any} value - a value or an array of values.
     */
    removeData(value) {
        if (!value) {
            return;
        }

        const data = this.getDataset();

        if (!data) {
            return;
        }

        if (value.constructor.name === 'Array') {
            value.forEach(x => data.delete(x));
        }
        else if (value.constructor.name === 'Object') {
            data.delete(value.id);
        }
        else {
            data.delete(value);
        }
    }

    #buildDefaultOptions() {
        return {
            width: this.#controlData.width,
            allowClear: this.#controlData.allowClear,
            placeholder: this.#controlData.placeholder,
            pageSize: this.#controlData.pageSize,
            minimumInputLength: this.#controlData.minimumInputLength,
            maximumInputLength: this.#controlData.maximumInputLength,
        };
    }

    #buildInputOptions(options) {
        return {
            ...options,
            scrollAfterSelect: this.#controlData.scrollAfterSelect,
            multiple: this.#controlData.multiple,
            data: this.#data,
            query: function (q) {
                const results = [];
                const items = [];

                Array.from(this.data.keys())
                    .map(k => { return { id: k, text: this.data.get(k)?.toString() } })
                    .filter(x => x.text)
                    .forEach(x => items.push(x));

                if (q.term && q.term !== '') {
                    const term = q.term.toUpperCase();
                    items.filter(x => x.text.startsWith(term))
                        .forEach(x => results.push(x));
                }
                else {
                    items.forEach(x => results.push(x));
                }

                q.callback({
                    results: results.slice((q.page - 1) * this.pageSize, q.page * this.pageSize),
                    more: results.length >= q.page * this.pageSize
                });
            }
        };
    }

    #buildAjaxOptions(options, defaultRequestUrl, defaultRequestOptions) {
        const request = {
            path: this.#path,
            method: this.#method,
            query: this.#query,
            content: this.#content,
            searchKey: this.#searchKey,
            callback: this.#processCallback,
        };

        const controlData = {
            pageSize: this.#controlData.pageSize,
            scrollAfterSelect: this.#controlData.scrollAfterSelect,
            multiple: this.#controlData.multiple,
            cache: this.#controlData.cache,
            delay: this.#controlData.delay,
        };

        return {
            ...options,
            scrollAfterSelect: controlData.scrollAfterSelect,
            multiple: controlData.multiple,
            cacheItem: {
                key: null,
                value: null,
                isCached: false,
            },
            query: function (query) {
                const searchText = query.term || '';
                const cacheItem = this.cacheItem;

                if (cacheItem.isCached && cacheItem.key?.toLowerCase() === searchText?.toLowerCase()) {
                    const results = cacheItem.value;

                    return query.callback({
                        results: results.slice((query.page - 1) * controlData.pageSize, query.page * controlData.pageSize),
                        more: results.length >= query.page * controlData.pageSize
                    });
                }

                const requestUrl = new URL(defaultRequestUrl);

                if (request.method === HttpMethod.GET && request.searchKey) {
                    requestUrl.searchParams.set(request.searchKey, searchText);
                }

                const requestData = {};

                if (request.method !== HttpMethod.GET) {
                    Object.assign(requestData, request.content);
                }

                if (request.method !== HttpMethod.GET && request.searchKey) {
                    requestData[request.searchKey] = searchText;
                }

                $.ajax({
                    url: requestUrl.toString(),
                    data: requestData,
                    dataType: 'json',
                    type: defaultRequestOptions.method,
                    headers: defaultRequestOptions.headers,
                    success: function (response) {
                        cacheItem.key = null;
                        cacheItem.value = null;
                        cacheItem.isCached = false;

                        const results = request.callback(response);

                        if (controlData.cache) {
                            cacheItem.key = searchText;
                            cacheItem.value = results;
                            cacheItem.isCached = true;
                        }

                        query.callback({
                            results: results.slice((query.page - 1) * controlData.pageSize, query.page * controlData.pageSize),
                            more: results.length >= query.page * controlData.pageSize
                        });
                    }
                });
            }
        };
    }
}