/// <reference path="../../../assets/Custom/_reference.js" />

class ReportDetail {
    #gridMain;
    #gridTicket;
    
    #btnExportCSV;
    #btnExportAllCSV;
    #modalLoading;
    #data;
    #ticketNumber;
    constructor() {
        this.#modalLoading = $('#modal-loading');
        this.#btnExportCSV = $('#btnExportCSV');
        this.#btnExportAllCSV = $('#btnExportAllCSV');
    }

    async #register() {


        this.#btnExportCSV.off('click').on('click', e => {
            Controls.toggleModal(this.#modalLoading, true);
            if (this.#data.length > 0) {
                this.#exportCSV(this.#data);
            }
            Controls.toggleModal(this.#modalLoading, false);
        });

        this.#btnExportAllCSV.off('click').on('click', async e => {
            Controls.toggleModal(this.#modalLoading, true);
            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'LoadTicketData' }, content: {
                    TicketNumber: this.#ticketNumber,
                    TicketDetailId: -1
                }
            });
            let data = await client.sendRequest(true);
            if (data.OK) {
                if (data.Result.length > 0) {
                    this.#exportCSV(data.Result);
                }
            }
            Controls.toggleModal(this.#modalLoading, false);
        });
    }


    async initial() {
        this.#initGrid();
        this.#register();
        var url = new URL(window.location);
        this.#ticketNumber = url.searchParams.get("TicketNumber");
        this.#loadGridTicket(this.#ticketNumber);
    }

    #exportCSV(dt) {
        if (dt.length < 0) return;
        let header = [];
        let data = [];
        let rows = [];
        Object.keys(dt[0]).forEach(function (key) {
            header.push(key);
        });
        data.push(header.join("\",\""));
        dt.forEach(v => {
            rows = [];
            header.forEach(i => {
                rows.push(v[i].toString().replace("\"", ""));
            })
            data.push(rows.join("\",\""));
        });

        let dataExport = data.join("\r\n");

        let link = document.createElement('a')
        link.id = 'download-csv'
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataExport));
        link.setAttribute('download', 'Download Report.csv');
        document.body.appendChild(link)
        document.querySelector('#download-csv').click()
    }

    #initGrid() {
        this.#gridMain = new dhtmlXGridObject('gridMain');
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
        this.#gridMain.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
        this.#gridMain.setColSorting("int,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str");
        this.#gridMain.enableAutoWidth(true);
        this.#gridMain.enableSmartRendering(true);
        this.#gridMain.init();


        this.#gridTicket = new dhtmlXGridObject('gridTicket');
        this.#gridTicket.setImagePath("../dist/dhx/codebase/imgs/");
        this.#gridTicket.setHeader(`
                No,
                Production Line, 
                Status, 
                Start, 
                End, 
                RM Cost, 
                Remark
            `);
        this.#gridTicket.setInitWidths("40,100,60,70,70,70,*");
        this.#gridTicket.setColumnMinWidth("60,100,60,70,70,70,200");
        this.#gridTicket.setColAlign("right,center,center,center,center,center,center");
        this.#gridTicket.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro");
        this.#gridTicket.setColSorting("int,str,str,str,str,str,str");
        this.#gridTicket.enableAutoWidth(true);
        this.#gridTicket.enableSmartRendering(true);
        this.#gridTicket.init();

        this.#gridTicket.attachEvent("onRowSelect", (id, ind) => {
            this.#loadGridTicketData(this.#ticketNumber, id);
        });
    }

    async #loadGridTicket(ticketNumber) {

        const client = new Client({
            method: HttpMethod.POST, query: { handler: 'LoadTicketDetail' }, content: {
                TicketNumber: this.#ticketNumber
            }
        });
        let data = await client.sendRequest(true);
        if (data.OK) {
            this.#data = data.Result;
            let optGrid = {
                Id: "TicketDetailId",
                Increase: true,
                Header: ["ProductionLine", "Status", "StartDate", "EndDate", "RMCostYM", "Remark"],
                Button: [

                ]
            };

            let rows = data.Result.convertTableGrid(optGrid);
            //console.log(rows);
            this.#gridTicket.clearAll();
            this.#gridTicket.parse(rows, "json");
        }
    };


    async #loadGridTicketData(ticketNumber, ticketdetailid) {
        Controls.toggleModal(this.#modalLoading, true);


        const client = new Client({
            method: HttpMethod.POST, query: { handler: 'LoadTicketData' }, content: {
                TicketNumber: this.#ticketNumber,
                TicketDetailId: ticketdetailid
            }
        });
        let data = await client.sendRequest(true);
        if (data.OK) {
            this.#data = data.Result;
            this.#gridMain.clearAll();
            let optGrid = {
                Id: "TicketDataId",
                Increase: true,
                Header: ["ProductionLine",
                    "FGItem",
                    "MaterialCode",
                    "MaterialType",
                    "UOM",
                    "UnitMaterialCost",
                    "UnitMaterialSetupCost",
                    "UnitMaterialRunningCost",
                    "UnitMaterialQuantity",
                    "UnitMaterialSetupQuantity",
                    "UnitMaterialRunningQuantity",
                    "MaterialCost",
                    "UOMOracle",
                    "MaterialDescription",
                    "JobJacket",
                    "JobJacketQuantity",
                    "Remark"],
                Button: [

                ]
            };

            let rows = data.Result.convertTableGrid(optGrid);
            this.#gridMain.clearAll();
            this.#gridMain.parse(rows, "json");
        }
        Controls.toggleModal(this.#modalLoading, false);

    };
}

$(async () => {
    const main = new ReportDetail();
    main.initial();
})