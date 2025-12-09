/// <reference path="../../../assets/Custom/_reference.js" />

class OrderTrackingManual {
    #gridMain;

    #btnDownloadTemplate;
    #btnOpenUploadFile;
    #btnUploadFile;
    #modalUploadFile;
    #modalLoading;
    #btnSearch;
    #txtItemCode;

    constructor() {
        this.#modalLoading = $('#modal-loading');
        this.#modalUploadFile = $('#modal-upload');

        this.#btnDownloadTemplate = $('#btnDownloadTemplate');
        this.#btnOpenUploadFile = $('#btnOpenUploadFile');
        this.#btnUploadFile = $('#btnUploadFile');
        this.#btnSearch = $('#btnSearch');
        this.#txtItemCode = $('#txtItemCode');
    }

    initial() {

        try {
            Controls.toggleModal(this.#modalLoading, true);
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
            window.open("/Template/Finance/HTL, FAPL Consolidated Order Tracking_Template.xlsx");
        });

        this.#btnOpenUploadFile.off("click").on("click", e => {
            Controls.toggleModal(this.#modalUploadFile, true);
        });


        this.#btnSearch.off("click").on("click", e => {
            Controls.toggleModal(this.#modalLoading, true);
            this.#loadGrid();
            Controls.toggleModal(this.#modalLoading, false);

        });

        this.#btnUploadFile.off("click").on("click", async e => {
            Controls.toggleModal(this.#modalLoading, true);
            Controls.toggleModal(this.#modalUploadFile, false);
            const formData = new FormData();
            formData.append("files", $('#fOrderTrackingManual')[0].files[0]);
            formData.append("__RequestVerificationToken", $('input:hidden[name="__RequestVerificationToken"]').val());

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UploadFile' }, content: formData
            });
            let data = await client.sendFileRequest();
            await data.text().then(e => {
                alert(e);
                this.#loadGrid();
            })
            Controls.toggleModal(this.#modalLoading, false);
        });



    }

    #initGrid() {
        this.#gridMain = new dhtmlXGridObject('gridbox');
        this.#gridMain.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridMain.setHeader("No,ProductionLine,ItemCode,FGQty,ProductionOrder,MaterialLocal,MaterialType,MaterialUOM,MaterialQuantity,SetupRound,PrintSheet,PrintScrap,FinishScrap,Length,NumSize,SideNo,RBO,Comment,Master,Created Date");
        //this.#gridMain.attachHeader("#text_search,#text_search,#text_search,#text_search,#text_search,#text_search,#text_search,#text_search,#text_search,#text_search");
        this.#gridMain.setInitWidths("50,150,150,100,100,150,200,100,100,100,100,100,100,100,100,100,100,100,100,150");
        this.#gridMain.setColAlign("center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center");
        this.#gridMain.setColSorting("int,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str");
        //this.#gridMain.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
        //this.#gridMain.setColSorting("int,str,str,str,str,str,str,str,str,str");
        this.#gridMain.enableAutoWidth(true);
        this.#gridMain.enableSmartRendering(true);
        this.#gridMain.enableMultiselect(true);
        this.#gridMain.enableBlockSelection();
        this.#gridMain.obj.className = "obj gridMain";
        this.#gridMain.entBox.id = "GridMain";
        this.#gridMain.init();
    }

    async #loadGrid() {
        const model = {
            ItemCode: this.#txtItemCode.val()
        }
        const client = new Client({ method: HttpMethod.POST, query: { handler: 'LoadOrderTracking' }, content: model });
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
                            r.ProductionLine,
                            r.ItemCode,
                            r.FGQty,
                            r.ProductionOrder,
                            r.MaterialLocal,
                            r.MaterialType,
                            r.MaterialUOM,
                            r.MaterialQuantity,
                            r.SetupRound,
                            r.PrintSheet,
                            r.PrintScrap,
                            r.FinishScrap,
                            r.Length,
                            r.NumSize,
                            r.SideNo,
                            r.RBO,
                            r.Comment,
                            r.Master,
                            r.CreationDate
                        ]
                    });
                })
                this.#gridMain.parse({ rows: datarow }, "json");
            }
        });
    }
}

$(async () => {
    const main = new OrderTrackingManual();
    main.initial();
})