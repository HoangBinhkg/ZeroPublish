class Helpers {
    static parseFormToObject(form) {
        const obj = {};
        const formArray = form.serializeArray();
        formArray.forEach(x => obj[x['name']] = x['value']);
        return obj;
    }

    static isInArray(array, value) {
        return array.indexOf(value) > -1;
    }

    static getInArray(array, value) {
        if (this.isInArray(array, value)) {
            return value;
        }
    }

    static parseBoolean(value) {
        const result = parseInt(value);
        if (result === 0) {
            return false;
        }
        if (result === 1) {
            return true;
        }
    }

    static buildHttpError(response, message = '', name = '', stack = '') {
        message = message || [response.status, response.statusText].join(' - ');
        return this.buildError(message, name, stack);
    }

    static buildError(message, name = '', stack = '') {
        return {
            name,
            message,
            stack
        };
    }
}