class Validation {
    #control;
    #options;

    get Control() {
        return this.#control;
    }

    constructor(control, options = {}) {
        this.#control = control;
        this.#options = options;
    }

    valid() {
        return this.#control.valid();
    }

    clear() {
        this.#control.validate(this.#options).resetForm();
        this.#control.find('.is-invalid').removeClass("is-invalid");
        this.#control.find('.is-valid').removeClass("is-valid");
        this.#control.find('.invalid-feedback').remove();
        this.#control.find('.valid-feedback').remove();
    }
}