/// <reference path="../../../assets/Custom/_reference.js" />

class MasterItemManual {
    #gridMain;
    #btnSearch;
    #txtItemCode;
    #btnDownloadTemplate;
    #btnOpenUploadFile;
    #btnUploadFile;
    #modalUploadFile;
    #modalLoading;

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
            window.open("/Template/Finance/HTL, FAPL Consolidated Master_Template.xlsx");
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
            formData.append("files", $('#fMasterItemManual')[0].files[0]);
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
        this.#gridMain.setHeader("No,Production Line,Item Code,Material Local,Material Type Oracle, Pcs/Roll Or UPS,Setup Sheet,Scrap,Comment, Master");
        //this.#gridMain.attachHeader("#text_search,#text_search,#text_search,#text_search,#text_search,#text_search,#text_search,#text_search,#text_search,#text_search");
        this.#gridMain.setInitWidths("50,150,200,100,*,150,200,100,100,100");
        this.#gridMain.setColumnMinWidth("50,150,200,100,100,150,200,100,100,100");
        this.#gridMain.setColAlign("center,center,center,center,center,center,center,center,center,center");
        this.#gridMain.setColTypes("ro,ro,ed,ro,ro,ro,ro,ro,ro,ro");
        this.#gridMain.setColSorting("int,str,str,str,str,str,str,str,str,str");
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
        const client = new Client({ method: HttpMethod.POST, query: { handler: 'LoadItemMaster' }, content: model });
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
                            r.MaterialLocal,
                            r.MaterialOracle,
                            r.MaterialTypeOracle,
                            r.MaterialUOMOracle,
                            r.PcsPerRoll,
                            r.SetupSheet,
                            r.Scrap,
                            r.Comment,
                            r.Master
                        ]
                    });
                })
                this.#gridMain.parse({ rows: datarow }, "json");
            }
        });
    }
}

$(async () => {
    const main = new MasterItemManual();
    main.initial();
})