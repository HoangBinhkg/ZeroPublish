/// <reference path="../../../assets/Custom/_reference.js" />

class Reporting {
    #gridMain;
    
    #btnLoad;
    #btnExportCSV;
    #modalLoading;
    #ddlProductionLine;
    #dFrom;
    #dTo;
    #txtRequestPath;
    #ddlRawMaterialCost;

    constructor() {
        this.#modalLoading = $('#modal-loading');
        this.#btnLoad = $('#btnLoad');
        this.#btnExportCSV = $('#btnExportCSV');
        this.#ddlProductionLine = $('#InspectionType');
        this.#dFrom = $('#DateCheckFrom');
        this.#dTo = $('#DateCheckTo');
        this.#ddlRawMaterialCost = $('#ddlRawMaterialCost');
    }

    initial() {
        this.#initGrid();
        this.#initLoadDropDown();
        this.#btnLoad.off('click').on('click', e => {
            Controls.toggleModal(this.#modalLoading, true);
            let dateFrom = this.#dFrom.val();
            let dateTo = this.#dTo.val();
            let rawMaterialCost = this.#ddlRawMaterialCost.val();
            this.#gridMain.clearAll();
            let prdLine = this.#ddlProductionLine.val();
            try {
                this.#gridMain.load("https://appdvn16.ap.averydennison.net:6789/api/Finance/Load" + prdLine + "?DateFrom=" + dateFrom + "&DateTo=" + dateTo + "&ExportType=1&DateYM=" + rawMaterialCost, "json").then(() => {
                    Controls.toggleModal(this.#modalLoading, false);
                });
            } catch {
                alert("Please try again");
            }
            // this.#gridMain.parse(data, "json");
        });

        this.#btnExportCSV.off('click').on('click', async e => {
            Controls.toggleModal(this.#modalLoading, true);
            let dateFrom = this.#dFrom.val();
            let dateTo = this.#dTo.val();
            let rawMaterialCost = this.#ddlRawMaterialCost.val();
            let prdLine = this.#ddlProductionLine.val();


            const client = new Client({
                path: "https://appdvn16.ap.averydennison.net:6789/api/Finance/Load" + prdLine, method: HttpMethod.GET, query: { handler: 'LoadRawMaterial' }, content: {
                    DateFrom: dateFrom,
                    DateTo: dateTo,
                    DateYM: rawMaterialCost,
                    ExportType: 0
                }
            });

            let data = await client.sendRequest();
            data.text().then(d => {
                let link = document.createElement('a')
                link.id = 'download-csv'
                link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(d));
                link.setAttribute('download', 'Download ' + prdLine + '.csv');
                document.body.appendChild(link)
                document.querySelector('#download-csv').click()

                Controls.toggleModal(this.#modalLoading, false);
            });


        });
    }

    async #initLoadDropDown() {
        const client = new Client({
            method: HttpMethod.GET, query: { handler: 'LoadRawMonth' }, content: {}
        });


        var productionList = [
            { text: "RFID Hangtag", value : "RFIDHT"},
            { text: "RFID SB", value : "RFIDSB"},
            { text: "Woven", value : "WOVEN"},
            { text: "PFL", value : "PFL"},
            { text: "PFL Thermal", value : "PFLThermal"},
            { text: "Thermal", value : "Thermal"},
            { text: "Offset Digital Combo", value : "PPCCombo"},
            { text: "Offset Digital NonCombo", value : "PPCNonCombo"},
            { text: "Offset Digital OS", value : "PPCOS"},
            { text: "IPPS PFL", value: "IPPSPFL"},
            { text: "PFL OS", value: "PFLOS"},
            { text: "FAPL", value: "FAPL" },
            { text: "Flexo", value: "FLEXO" },
            { text: "HTL", value: "HTL" },
            { text: "HTL Roll", value: "HTLROLL" }
        ];

        this.#ddlProductionLine.empty();
        productionList.forEach((v, i) => {
            this.#ddlProductionLine.append("<option value='" + v.value + "'>" + v.text + "</option>")
        })

        var dataRaw = await client.sendRequest(true);
        if (dataRaw.OK) dataRaw.Result.forEach(e => {
            this.#ddlRawMaterialCost.append("<option value='" + e.DateYM + "'>" + e.DateYM + "</option>");
        })
    }

    #initGrid() {
        this.#gridMain = new dhtmlXGridObject('gridbox');
        this.#gridMain.setImagePath("../dist/dhx/codebase/imgs/");
        this.#gridMain.setHeader(`
                No,
                Production Line, 
                FG Item, 
                Material Code, 
                Material Type, 
                UOM, 
                Unit Material Cost, 
                Unit Material Setup Cost, 
                Unit Material Running Cost, 
                Unit Material Quantity, 
                Unit Material Setup Quantity,
                Unit Material Running Quantity,
                UOM Oracle,
                Material Description,
                JobJacket,
                JobJacket Quantity,
                Remark
            `);
        this.#gridMain.setInitWidths("60,*,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100");
        this.#gridMain.setColumnMinWidth("60,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100");
        this.#gridMain.setColAlign("right,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center");
        this.#gridMain.attachHeader("&nbsp;,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,");
        this.#gridMain.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
        this.#gridMain.setColSorting("int,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str");
        this.#gridMain.enableAutoWidth(true);
        this.#gridMain.enableSmartRendering(true);
        this.#gridMain.init();
    }
}

$(async () => {
    const main = new Reporting();
    main.initial();
})