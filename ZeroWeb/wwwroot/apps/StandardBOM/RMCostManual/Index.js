/// <reference path="../../../assets/Custom/_reference.js" />

class RMCostManual {
    #gridMain;
    #txtItemCode;
    #btnDownloadTemplate;
    #btnOpenUploadFile;
    #btnUploadFile;
    #btnSearch;
    #ddlForMonth;
    #modalUploadFile;
    #modalLoading;

    constructor() {
        this.#modalLoading = $('#modal-loading');
        this.#modalUploadFile = $('#modal-upload');

        this.#btnDownloadTemplate = $('#btnDownloadTemplate');
        this.#btnOpenUploadFile = $('#btnOpenUploadFile');
        this.#btnUploadFile = $('#btnUploadFile');
        this.#ddlForMonth = $('#ddlForMonth');
        this.#txtItemCode = $('#txtItemCode');
        this.#btnSearch = $('#btnSearch');

    }

    initial() {

        try {
            Controls.toggleModal(this.#modalLoading, true);
            this.#loadDropDown();
            this.#registerEvents();
            this.#initGrid();
            this.#loadGrid();
        }
        catch (error) {
            Notify.showException(error);
        }
        finally {
            Controls.toggleModal(this.#modalLoading, false);
        }
    }

    async #registerEvents() {
        this.#btnDownloadTemplate.off("click").on("click", e => {
            window.open("/Template/Finance/RM Cost Template.xlsx");
        });

        this.#btnOpenUploadFile.off("click").on("click", e => {
            Controls.toggleModal(this.#modalUploadFile, true);
        });

        this.#btnSearch.off("click").on("click", e => {
            this.#loadGrid();
        });


        this.#btnUploadFile.off("click").on("click", async e => {
            Controls.toggleModal(this.#modalLoading, true);
            Controls.toggleModal(this.#modalUploadFile, false);

                const formData = new FormData();
                formData.append("forMonth", this.#ddlForMonth.val());
                formData.append("files", $('#fOrderTrackingManual')[0].files[0]);
                formData.append("__RequestVerificationToken", $('input:hidden[name="__RequestVerificationToken"]').val());

                const client = new Client({
                    method: HttpMethod.POST, query: { handler: 'UploadFile' }, content: formData
                });
                let data = await client.sendFileRequest();
                await data.text().then(e => {
                    alert(e);
                    this.#loadGrid();
                });

            Controls.toggleModal(this.#modalLoading, false);

        });
    }

    #initGrid() {
        this.#gridMain = new dhtmlXGridObject('gridbox');
        this.#gridMain.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridMain.setHeader("No,Entity,Item Code,Total Cost,Total Direct Cost, Buy/Make,PT Level 1,Inv Type,Commodity,UOM, Item Name, Update Date, For Month");
        this.#gridMain.setInitWidths("50,100,100,100,100,100,100,100,100,100,*,150,100");
        this.#gridMain.setColumnMinWidth("50,100,100,100,100,100,100,100,100,100,100,150,100");
        
        this.#gridMain.setColAlign("center,center,center,center,center,center,center,center,center,center,center,center,center");
        this.#gridMain.setColTypes("ro,ro,ed,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
        this.#gridMain.setColSorting("int,str,str,str,str,str,str,str,str,str,str,str,str");
        this.#gridMain.enableAutoWidth(true);
        this.#gridMain.enableMultiselect(true);
        this.#gridMain.attachEvent("onKeyPress", (code, ctrl, shift) => {
            if (code == 67 && ctrl) {
                if (this.#gridMain._selectionArea == null) return alert("You need to select a block area in grid first");
                this.#gridMain.setCSVDelimiter("\t");
                this.#gridMain.copyBlockToClipboard()
            }
            if (code == 86 && ctrl) {
                this.#gridMain.setCSVDelimiter("\t");
                this.#gridMain.pasteBlockFromClipboard()
            }
            return true;
        });
        this.#gridMain.enableBlockSelection();
        this.#gridMain.obj.className = "obj gridMain";
        this.#gridMain.entBox.id = "GridMain";
        this.#gridMain.init();
    }

    async #loadGrid() {
        const model = {
            ItemCode: this.#txtItemCode.val()
        }
        const client = new Client({ method: HttpMethod.POST, query: { handler: 'LoadRawMaterial' }, content: model });
        let data = await client.sendRequest();
        this.#gridMain.clearAll();
        let datarow = []
        data.json().then(e => {
            if (e.OK) {
                e.Result.forEach((r, i) => {
                    datarow.push({
                        id: i + 1,
                        data: [
                            i + 1,
                            r.Entity,
                            r.ItemCode,
                            r.Totalcost,
                            r.TotalDirectCost,
                            r.BuyMake,
                            r.PLTLevel1,
                            r.InvType,
                            r.Commodity,
                            r.UOM,
                            r.ItemName,
                            r.UpdatedDate,
                            r.DateYM
                        ]
                    });
                })
                this.#gridMain.parse({ rows: datarow }, "json");
            }
        });
    }

    #onKeyPressed(code, ctrl, shift) {
        this.#gridMain.clearAll();
        if (code == 67 && ctrl) {
            if (this.#gridMain._selectionArea) return alert("You need to select a block area in grid first");
            this.#gridMain.setCSVDelimiter("\t");
            this.#gridMain.copyBlockToClipboard()
        }
        if (code == 86 && ctrl) {
            this.#gridMain.setCSVDelimiter("\t");
            this.#gridMain.pasteBlockFromClipboard()
        }
        return true;
    }

    async #loadDropDown() {
        let dateNow = new Date();
        let thisMonth = dateNow.yyyyMM();
        let nextMonth = dateNow.addMonths(1).yyyyMM();
        let prevMonth = dateNow.addMonths(-1).yyyyMM();

        this.#ddlForMonth.append("<option value='" + nextMonth + "'>" + nextMonth + "</option>");
        //this.#ddlForMonth.append("<option value='" + thisMonth + "' selected>" + thisMonth + "</option>");
        for (let i = 0; i < 12; i++)  this.#ddlForMonth.append("<option value='" + dateNow.addMonths(-i).yyyyMM() + "'>" + dateNow.addMonths(-i).yyyyMM() + "</option>");


    }
}

$(async () => {
    const main = new RMCostManual();
    main.initial();
})