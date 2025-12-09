/// <reference path="../../../assets/Custom/_reference.js" />

class RoutingMasterItem {
    #gridItemProcess;
    #gridItemResource;

    #txtItemCode;


    #btnDownloadTemplateProcess;
    #btnDownloadTemplateResource;
    #btnOpenUploadProcess;
    #btnOpenUploadResoucre;

    #btnUploadFileProcess;
    #btnUploadFileResoucre;
    #btnSearch;

    #ddlProduction;
    #ddlDateYM;

    #fProcess;
    #fResource;


    #btnUploadFile;
    #modalUploadProcess;
    #modalUploadResource;
    #modalLoading;

    constructor() {
        this.#modalLoading = $('#modal-loading');
        this.#modalUploadProcess = $('#modal-uploadprocess');
        this.#modalUploadResource = $('#modal-uploadresource');
        this.#txtItemCode = $('#txtItemCode');


        this.#btnDownloadTemplateProcess = $('#btnDownloadTemplateProcess');
        this.#btnDownloadTemplateResource = $('#btnDownloadTemplateResource');
        this.#btnOpenUploadProcess = $('#btnOpenUploadProcess');
        this.#btnOpenUploadResoucre = $('#btnOpenUploadResoucre');

        this.#btnUploadFileProcess = $('#btnUploadFileProcess');
        this.#btnUploadFileResoucre = $('#btnUploadFileResoucre ');

        this.#btnSearch = $('#btnSearch');
        this.#ddlProduction = $('#ddlProduction');
        this.#ddlDateYM = $('#ddlDateYM');

        this.#fProcess = $('#fProcess');
        this.#fResource = $('#fResource');
    }

    initial() {
        try {
            Controls.toggleModal(this.#modalLoading, true);
            this.#registerEvents();
            this.#initGrid();
            this.#loadGridItemProcess();
            this.#loadGridItemResource();
            this.#loadDateYM();
            this.#loadProduction();
        }
        catch (error) {
            Notify.showException(error);
        }
        finally {
            Controls.toggleModal(this.#modalLoading, false);
        }
    }

    async #registerEvents() {
        this.#btnDownloadTemplateProcess.off("click").on("click", e => {
            window.open("/Template/Finance/Process_Item_Template.xlsx");
        });
        this.#btnDownloadTemplateResource.off("click").on("click", e => {
            window.open("/Template/Finance/Resource_Item_Template.xlsx");
        });

        this.#btnOpenUploadProcess.off("click").on("click", e => {
            Controls.toggleModal(this.#modalUploadProcess, true);
        });

        this.#btnOpenUploadResoucre.off("click").on("click", e => {
            Controls.toggleModal(this.#modalUploadResource, true);
        });

        //this.#btnSearch.off("click").on("click", e => {
        //    this.#loadGrid();
        //});

        this.#btnUploadFileResoucre.off("click").on("click", async e => {
            Controls.toggleModal(this.#modalLoading, true);

            const formData = new FormData();
            formData.append("files", $('#fResource')[0].files[0]);
            formData.append("DateYM", this.#ddlDateYM.val());
            formData.append("__RequestVerificationToken", $('input:hidden[name="__RequestVerificationToken"]').val());

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UploadFileResource' }, content: formData
            });
            let data = await client.sendFileRequest();
            await data.text().then(e => {
                alert(e);
                this.#loadGridItemProcess();
            })

            Controls.toggleModal(this.#modalLoading, false);
            Controls.toggleModal(this.#modalUploadResource, false);

        });

        this.#btnUploadFileProcess.off("click").on("click", async e => {
            Controls.toggleModal(this.#modalLoading, true);

            const formData = new FormData();
            formData.append("files", $('#fProcess')[0].files[0]);
            formData.append("ProductionId", this.#ddlProduction.val());
            formData.append("__RequestVerificationToken", $('input:hidden[name="__RequestVerificationToken"]').val());

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UploadFileProcess' }, content: formData
            });
            let data = await client.sendFileRequest();
            await data.text().then(e => {
                alert(e);
                this.#loadGridItemProcess();
            })

            Controls.toggleModal(this.#modalLoading, false);
            Controls.toggleModal(this.#modalUploadProcess, false);

        });



    }

    

    async #loadProduction() {
        const client = new Client({
            method: HttpMethod.GET, query: { handler: 'LoadProduction' }, content: {
                IsActive: 1
            }
        });

        let data = await client.sendRequest(true);
        if (data.OK) {
            data.Result.forEach(e => {
                this.#ddlProduction.append("<option value='" + e.ProductionId + "'>" + e.ProductionName + "</option>")
            });
        }
    }


    #initGrid() {
        this.#gridItemProcess = new dhtmlXGridObject('gridItemProcess');
        this.#gridItemProcess.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridItemProcess.setHeader("No,Item Code,Production Name,Revision,Process Flow,Update By,Update Date");
        this.#gridItemProcess.setInitWidths("50,150,150,*,300,100,150,150");
        this.#gridItemProcess.setColAlign("center,center,center,center,center,center,center,center");
        this.#gridItemProcess.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro");
        this.#gridItemProcess.setColSorting("int,str,str,str,str,str,str,str");
        this.#gridItemProcess.enableAutoWidth(true);
        this.#gridItemProcess.enableSmartRendering(true);
        this.#gridItemProcess.enableMultiselect(true);
        this.#gridItemProcess.enableBlockSelection();
        this.#gridItemProcess.obj.className = "obj gridItemProcess";
        this.#gridItemProcess.entBox.id = "gridItemProcess";
        this.#gridItemProcess.init();

        this.#gridItemResource = new dhtmlXGridObject('gridItemResource');
        this.#gridItemResource.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridItemResource.setHeader("No,Resource Code,UOM,Rate,Date YM,Updated By,Updated Date");
        this.#gridItemResource.setInitWidths("50,150,*,100,100,100,150");
        this.#gridItemResource.setColAlign("center,center,center,center,center,center,center");
        this.#gridItemResource.setColTypes("ro,ro,ro,ro,ro,ro,ro");
        this.#gridItemResource.setColSorting("int,str,str,str,str,str,str");
        this.#gridItemResource.enableAutoWidth(true);
        this.#gridItemResource.enableSmartRendering(true);
        this.#gridItemResource.enableMultiselect(true);
        this.#gridItemResource.enableBlockSelection();
        this.#gridItemResource.obj.className = "obj gridItemResource";
        this.#gridItemResource.entBox.id = "gridItemResource";
        this.#gridItemResource.init();
    }

    async #loadDateYM() {
        let dateNow = new Date();
        let thisMonth = dateNow.yyyyMM();
        let nextMonth = dateNow.addMonths(1).yyyyMM();
        let prevMonth = dateNow.addMonths(-1).yyyyMM();

        this.#ddlDateYM.append("<option value='" + nextMonth + "'>" + nextMonth + "</option>");
        //this.#ddlForMonth.append("<option value='" + thisMonth + "' selected>" + thisMonth + "</option>");
        for (let i = 0; i < 12; i++)  this.#ddlDateYM.append("<option value='" + dateNow.addMonths(-i).yyyyMM() + "'>" + dateNow.addMonths(-i).yyyyMM() + "</option>");


    }

    async #loadGridItemProcess() {
        const client = new Client({
            method: HttpMethod.GET, query: { handler: 'LoadProcessMasterItem' }, content: {
                //IsActive: -1
            }
        });

        let data = await client.sendRequest(true);
        if (data.OK) {
            this.#gridItemProcess.clearAll();
            let optGrid = {
                Id: "",
                Increase: true,
                Header: ["ItemCode", "ProductionName", "Revision", "ProcessFlow", "UpdatedBy", "UpdateDate"],
                Button: [

                ]
            };

            let rows = data.Result.convertTableGrid(optGrid);
            console.log(rows);
            this.#gridItemProcess.parse(rows, "json");
        }
    }


    async #loadGridItemResource() {
        const client = new Client({
            method: HttpMethod.GET, query: { handler: 'LoadProcessResource' }, content: {
                //IsActive: -1
            }
        });

        let data = await client.sendRequest(true);
        if (data.OK) {
            this.#gridItemResource.clearAll();
            let optGrid = {
                Id: "ResourceRateId",
                Increase: true,
                Header: ["ResourceCode" , "UOM" , "Rate", "DateYM", "UpdatedBy", "UpdatedDate"],
                Button: [

                ]
            };

            let rows = data.Result.convertTableGrid(optGrid);
            console.log(rows);
            this.#gridItemResource.parse(rows, "json");
        }
    }
}

$(async () => {
    const main = new RoutingMasterItem();
    main.initial();
})