class ControlStatus {
    static #mapping = new Map();

    static #initData = {
        None: ControlStatus.None,
        Checked: ControlStatus.Checked,
        Disabled: ControlStatus.Disabled,
        ReadOnly: ControlStatus.ReadOnly,
    };

    static get Checked() { return 1; }
    static get Disabled() { return 2; }
    static get ReadOnly() { return 3; }

    static getName(value) {
        if (!this.#mapping.size) {
            Object.keys(this.#initData).forEach(k => { this.#mapping.set(this.#initData[k], k); });
        }

        if (this.#mapping.has(value)) {
            return this.#mapping.get(value);
        }
    }
}