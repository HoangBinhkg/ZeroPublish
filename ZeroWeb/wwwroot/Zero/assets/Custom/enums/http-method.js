class HttpMethod {
    static #mapping = new Map();

    static #initData = {
        DELETE: HttpMethod.DELETE,
        GET: HttpMethod.GET,
        PATCH: HttpMethod.PATCH,
        POST: HttpMethod.POST,
        PUT: HttpMethod.PUT,
    };

    static get GET() { return 1; }
    static get POST() { return 2; }
    static get PUT() { return 3; }
    static get PATCH() { return 4; }
    static get DELETE() { return 5; }

    static getName(value) {
        if (!this.#mapping.size) {
            Object.keys(this.#initData).forEach(k => { this.#mapping.set(this.#initData[k], k); });
        }

        if (this.#mapping.has(value)) {
            return this.#mapping.get(value);
        }
    }
};