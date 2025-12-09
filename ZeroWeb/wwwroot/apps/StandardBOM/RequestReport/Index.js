/// <reference path="../../../assets/Custom/_reference.js" />

class RequestReport {
    #gridMain;
    #txtRemark;
    #txtTicketNumber;
    #btnRequest;
    #btnSearch;
    #btnOpenRequestTicket;
    #modalRequest;
    #modalLoading;
    #gridRequest;
    #dateYM;

    constructor() {
        this.#modalLoading = $('#modal-loading');
        this.#modalRequest = $('#modal-request');

        this.#btnOpenRequestTicket = $('#btnOpenRequestTicket');
        this.#btnRequest = $('#btnRequest');
        this.#btnSearch = $('#btnSearch');
        this.#txtRemark = $('#txtRemark');
        this.#txtTicketNumber = $('#txtTicketNumber');
    }

    async initial() {

        try {
            Controls.toggleModal(this.#modalLoading, true);
            await this.#registerEvents();
            await this.#initGrid();
            await this.#loadGrid();
        }
        catch (error) {
            Notify.showException(error);
        }
        finally {
            Controls.toggleModal(this.#modalLoading, false);
        }
    }

    async #registerEvents() {
      

        this.#btnOpenRequestTicket.off("click").on("click", e => {
            Controls.toggleModal(this.#modalRequest, true);
            this.#loadGrid();
        });


        this.#btnSearch.off("click").on("click", e => {
            this.#loadGrid();
        });


        this.#btnRequest.off("click").on("click", async e => {
            Controls.toggleModal(this.#modalLoading, true);

            let dataTicket = [];
            this.#gridRequest.forEachRow(id => {
                if (this.#gridRequest.cells(id, 1).getValue() == 1) {
                    dataTicket.push({
                        ProductionLine: this.#gridRequest.cells(id, 2).getValue(),
                        StartDate: this.#gridRequest.cells(id, 3).getValue(),
                        EndDate: this.#gridRequest.cells(id, 4).getValue(),
                        RMCostYM: this.#gridRequest.cells(id, 5).getValue(),
                        Remark: this.#gridRequest.cells(id, 6).getValue()
                    })
                }
            })

            if (dataTicket.length > 0) {
                const client = new Client({
                    method: HttpMethod.POST, query: { handler: 'CreateTicket' }, content: {
                        Remark: this.#txtRemark.val(),
                        DataTicket: JSON.stringify(dataTicket)
                    }
                });
                let data = await client.sendRequest();
                data.text().then(e => {
                    alert(e);
                    this.#loadGrid();
                });
            }
            Controls.toggleModal(this.#modalLoading, false);

        });
    }

    async #initGrid() {
        this.#gridMain = new dhtmlXGridObject('gridbox');
        this.#gridMain.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridMain.setHeader("No,Ticket Number,Request By,Status,Remark,,");
        this.#gridMain.setInitWidths("50,150,100,100,*,100,100");
        this.#gridMain.setColumnMinWidth("50,150,100,100,100,100,100");
        this.#gridMain.setColAlign("center,center,center,center,center,center,center");
        this.#gridMain.setColTypes("ro,ro,ro,ro,ro,ro,ro");
        this.#gridMain.setColSorting("int,str,str,str,str,str,str");
        this.#gridMain.enableAutoWidth(true);
        this.#gridMain.enableMultiselect(true);
        this.#gridMain.enableBlockSelection();
        this.#gridMain.obj.className = "obj gridMain";
        this.#gridMain.entBox.id = "gridMain";
        this.#gridMain.init();

        this.#gridRequest = new dhtmlXGridObject('gridRequest');
        this.#gridRequest.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridRequest.setHeader("No,,Production Line,From Date,To Date,RM Cost YM,Remark");
        this.#gridRequest.setInitWidths("50,50,150,150,150,100,*");
        this.#gridRequest.setColAlign("center,center,center,center,center,center,center");
        this.#gridRequest.setColTypes("ro,ch,ro,dhxCalendarA,dhxCalendarA,coro,txt");
        this.#gridRequest.setColSorting("int,str,str,str,str,str,str");
        this.#gridRequest.enableAutoWidth(true);
        this.#gridRequest.enableSmartRendering(true);
        this.#gridRequest.enableMultiselect(true);
        this.#gridRequest.enableBlockSelection();
        this.#gridRequest.obj.className = "obj gridRequest";
        this.#gridRequest.entBox.id = "gridRequest";
        this.#gridRequest.setDateFormat("%Y-%m-%d", "%Y-%m-%d");
        this.#gridRequest.init();
        //let dateFrom = setDateFormat("%d.%m.%Y");
        let combobox = this.#gridRequest.getCombo(5);




        const client = new Client({ method: HttpMethod.POST, query: { handler: 'LoadRMMonth' }, content: {} });
        let data = await client.sendRequest(true);
        if (data.OK) {
            data.Result.forEach(e => {
                if (this.#dateYM == "" || this.#dateYM == undefined) this.#dateYM = e.DateYM;
                combobox.put(e.DateYM, e.DateYM);
            });
        }



        let dateNow = new Date();
        this.#gridRequest.addRow(1, [1, 1, "RFID HT", dateNow.addDays(-90).yyyyMM() + "-01", dateNow.addDays(0).yyyyMMdd(), this.#dateYM, ""]);
        this.#gridRequest.addRow(2, [2, 1, "RFID SB", dateNow.addDays(-90).yyyyMM() + "-01", dateNow.addDays(0).yyyyMMdd(), this.#dateYM, ""]);
        this.#gridRequest.addRow(3, [3, 1, "Woven", dateNow.addDays(-90).yyyyMM() + "-01", dateNow.addDays(0).yyyyMMdd(), this.#dateYM, ""]);
        this.#gridRequest.addRow(4, [4, 1, "PFL", dateNow.addDays(-90).yyyyMM() + "-01", dateNow.addDays(0).yyyyMMdd(), this.#dateYM, ""]);
        this.#gridRequest.addRow(5, [5, 1, "PFL Thermal", dateNow.addDays(-90).yyyyMM() + "-01", dateNow.addDays(0).yyyyMMdd(), this.#dateYM, ""]);
        this.#gridRequest.addRow(6, [6, 1, "Thermal", dateNow.addDays(-90).yyyyMM() + "-01", dateNow.addDays(0).yyyyMMdd(), this.#dateYM, ""]);
        this.#gridRequest.addRow(7, [7, 1, "Offset Digital Combo", dateNow.addDays(-90).yyyyMM() + "-01", dateNow.addDays(0).yyyyMMdd(), this.#dateYM, ""]);
        this.#gridRequest.addRow(8, [8, 1, "Offset Digital NonCombo", dateNow.addDays(-90).yyyyMM() + "-01", dateNow.addDays(0).yyyyMMdd(), this.#dateYM, ""]);

        this.#gridRequest.addRow(9, [9, 1, "Offset Digital OS", dateNow.addDays(-90).yyyyMM() + "-01", dateNow.addDays(0).yyyyMMdd(), this.#dateYM, ""]);
        this.#gridRequest.addRow(10, [10, 1, "IPPS PFL", dateNow.addDays(-90).yyyyMM() + "-01", dateNow.addDays(0).yyyyMMdd(), this.#dateYM, ""]);
        this.#gridRequest.addRow(11, [11, 1, "PFL OS", dateNow.addDays(-90).yyyyMM() + "-01", dateNow.addDays(0).yyyyMMdd(), this.#dateYM, ""]);

        this.#gridRequest.addRow(12, [12, 1, "FAPL", dateNow.addDays(-90).yyyyMM() + "-01", dateNow.addDays(0).yyyyMMdd(), this.#dateYM, ""]);
        this.#gridRequest.addRow(13, [13, 1, "Flexo", dateNow.addDays(-90).yyyyMM() + "-01", dateNow.addDays(0).yyyyMMdd(), this.#dateYM, ""]);
        this.#gridRequest.addRow(14, [14, 1, "HTL", dateNow.addDays(-90).yyyyMM() + "-01", dateNow.addDays(0).yyyyMMdd(), this.#dateYM, ""]);
        this.#gridRequest.addRow(15, [15, 1, "HTL Roll", dateNow.addDays(-90).yyyyMM() + "-01", dateNow.addDays(0).yyyyMMdd(), this.#dateYM, ""]);
    }

    async #loadGrid() {
        const model = {
            TicketNumber: this.#txtTicketNumber.val()
        }
        const client = new Client({ method: HttpMethod.POST, query: { handler: 'LoadTicket' }, content: model });
        let data = await client.sendRequest(true);
        this.#gridMain.clearAll();
        let datarow = []
        if (data.OK) {
            data.Result.forEach((r, i) => {
                datarow.push({
                    id: r.TicketId,
                    data: [
                        i + 1,
                        r.TicketNumber,
                        r.FullName,
                        r.TicketStatus,
                        r.Remark,
                        r.TicketStatus.toUpperCase() == "DONE" ? "<button  type='submit' data-ticketnumber='" + r.TicketNumber + "' name='btnView' class='btn btn-primary btn-sm'>View Report</button>" : "",
                        "<button  type='submit' data-ticketid='" + r.TicketId + "' name='btnCancel' class='btn btn-primary btn-sm'>Cancel Report</button>"
                    ]
                });
            })
            this.#gridMain.parse({ rows: datarow }, "json");
        }

        Array.from($(".gridMain").find('tr')).forEach(x => {
            $(x).find('button[name="btnView"]').off('click').on('click', async b => {
                let id = $(b.currentTarget).data('ticketnumber');
                window.open("ReportDetail?TicketNumber=" + id);
            });

            $(x).find('button[name="btnCancel"]').off('click').on('click', async b => {
                let id = $(b.currentTarget).data('ticketid');
                console.log(id);
                const client = new Client({
                    method: HttpMethod.POST, query: { handler: 'UpdateTicket' }, content: {
                        TicketId: id,
                        TicketNumber: this.#gridMain.cells(id,1).getValue(),
                        Reamark: ""//this.#gridMain.cells(id,4).getValue()
                    }
                });
                let data = await client.sendRequest(true);
                if (data.OK) {
                    alert(data.Result);
                    this.#loadGrid();
                }
            });
        });

    }
}

$(async () => {
    const main = new RequestReport();
    main.initial();
})