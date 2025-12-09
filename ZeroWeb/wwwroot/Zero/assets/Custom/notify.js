class Notify {
    static showInfo(content, title = '') {
        this.#buildNotify(content, title, 'info');
    }

    static showSuccess(content, title = '') {
        this.#buildNotify(content, title, 'success');
    }

    static showWarning(content, title = '') {
        this.#buildNotify(content, title, 'warning');
    }

    static showError(content, title = '') {
        this.#buildNotify(content, title, 'danger');
    }

    static showException(error) {
        const headers = [];
        const messages = [];

        if (error) {
            headers.push(error.name);
            messages.push(error.message);
            messages.push(error.stack || '');
        }

        const title = headers.filter(x => x).join(' - ');
        const content = messages.filter(x => x).join(' - ');

        this.#buildNotify(content, title, 'danger');
    }

    static #buildNotify(content, title = '', type = 'info') {
        const lines = [];

        if (title) {
            lines.push(`<b>${title}</b>`);
            lines.push('<hr>');
        }
        if (content) {
            lines.push(content);
        }

        One.helpers('notify', {
            type,
            message: lines.join('')
        });

        $('div[data-notify="container"]').css('z-index', 9999999);
    }
}