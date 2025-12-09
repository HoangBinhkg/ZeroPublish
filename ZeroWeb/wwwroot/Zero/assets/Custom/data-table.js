class DataColumn {
    name = '';
    css = ''
}

class DataTable {
    #control;
    #columns;
    #columnNames = [];
    #columnDefs = [];

    get Control() {
        return this.#control;
    }

    /**
     * control: the <table> element
     * columns: the specifying a type (DataColumn) in an array
    */
    constructor(control, columns = []) {
        this.#control = control;
        this.#columns = columns || [];

        this.#columns.forEach((x, i) => {
            this.#columnNames.push(x.name);

            if (x.css) {
                this.#columnDefs.push({
                    targets: i,
                    className: x.css
                });
            }
        });
    }

    /**
     * data: the array of items
    */
    addRows(data = []) {
        this.#control.DataTable({
            destroy: true,
            columnDefs: this.#columnDefs,
            columns: this.#columns,
            data: data
        });
    }

    clear() {
        this.#control.DataTable().clear().draw();
    }
}