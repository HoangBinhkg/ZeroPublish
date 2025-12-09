/// <reference path="enums/http-method.js" />
/// <reference path="models/environment.js" />
/// <reference path="models/client-request.js" />
/// <reference path="helpers.js" />

class Client {
    #path = '';
    #method = HttpMethod.GET;
    #query = {};
    #content = {};

    constructor(clientRequest = new ClientRequest()) {
        if (!clientRequest) {
            throw Helpers.buildError('The constructor arguments is required.');
        }

        this.#path = clientRequest.path || '';
        this.#method = clientRequest.method || HttpMethod.GET;
        this.#query = clientRequest.query || {};
        this.#content = clientRequest.content || {};
    }

    sendRequest(json = false) {
        const url = this.buildRequestUrl();
        const options = this.buildRequestOptions();

        return fetch(url, options)
            .then(async response => {
                if (response.ok) {
                    return json ? response.json() : response;
                }
                if (response.status !== HttpStatusCode.BadRequest) {
                    return json ? response.json() : response;
                }
            });
    }

    sendFileRequest() {
        const url = this.buildRequestUrl();
        return fetch(url, {
            method: 'POST',
            headers: {
                "RequestVerificationToken": $('input:hidden[name="__RequestVerificationToken"]').val(),
                "X-Requested-With": "XMLHttpRequest"
            },
            body: this.#content
        })
            .then(async response => {
                if (response.ok) {
                    return response;
                }
                if (response.status !== HttpStatusCode.BadRequest) {
                    return response;
                }
            });
    }

    buildRequestUrl() {
        const url = new URL(this.#path, [location, ''].join('/'));

        if (Environment.basePath && !url.pathname.toLowerCase().startsWith(['/', Environment.basePath.toLowerCase()].join(''))) {
            url.pathname = ['/', Environment.basePath, url.pathname].join('');
        }

        if (this.#method === HttpMethod.GET) {
            url.search = new URLSearchParams({ ... this.#query, ... this.#content }).toString();
        }
        else {
            url.search = new URLSearchParams(this.#query).toString();
        }

        url.pathname = url.pathname.replace("//", "/");
        return url;
    }

    buildRequestOptions() {
        const options = {
            method: HttpMethod.getName(this.#method),
        };

        options.headers = new Headers();
        options.headers.set('RequestVerificationToken', $('input:hidden[name="__RequestVerificationToken"]').val() || '');
        options.headers.set('X-Requested-With', 'XMLHttpRequest');

        switch (this.#method) {

            case HttpMethod.GET:
            case HttpMethod.HEAD:
                return options;
            default:
                options.headers.set('Content-Type', 'application/json; charset=UTF-8');
                options.body = JSON.stringify(this.#content);
                return options;
        }
    }

    #verifyLogon() {
        const url = new URL('/Authentication/LogonSession', [location, ''].join('/'));
        if (Environment.basePath && !url.pathname.toLowerCase().startsWith(['/', Environment.basePath.toLowerCase()].join(''))) {
            url.pathname = ['/', Environment.basePath, url.pathname].join('');
        }

        const options = {
            method: HttpMethod.getName(HttpMethod.GET),
        };

        options.headers = new Headers();
        options.headers.set('RequestVerificationToken', $('input:hidden[name="__RequestVerificationToken"]').val() || '');

        return fetch(url, options);
    }
}