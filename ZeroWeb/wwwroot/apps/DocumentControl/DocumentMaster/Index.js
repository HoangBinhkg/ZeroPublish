/// <reference path="../../../assets/Custom/_reference.js" />

class DocumentMaster {
    #gridMain;

    #btnSearch;
    #modalLoading;
    #txtAuthor;
    #txtDocumentName;
    #txtDocumentCode;
    #ddlDepartmentRelated;
    #ddlDocumentType;
    #btnExportToExcel;

    constructor() {
        this.#modalLoading = $('#modal-loading');
        this.#btnSearch = $('#btnSearch');

        this.#ddlDepartmentRelated = $('#ddlDepartmentRelated');
        this.#ddlDocumentType = $('#ddlDocumentType');
        this.#txtDocumentCode = $('#txtDocumentCode');
        this.#txtAuthor = $('#txtAuthor');
        this.#txtDocumentName = $('#txtDocumentName');
        this.#btnExportToExcel = $('#btnExportToExcel');
        
    }

    initial() {
        this.#initGrid();
        this.#loadDropDown();

        this.#btnSearch.off('click').on('click', e => {
            Controls.toggleModal(this.#modalLoading, true);
            this.#loadGrid();
            Controls.toggleModal(this.#modalLoading, false);
        });

        this.#btnSearch.off('click').on('click', e => {
            this.#loadGrid();
        });

        this.#btnExportToExcel.off('click').on('click', e => {
            this.#gridMain.toExcel("ExportExcel");
        });
    }


    #initGrid() {
        this.#gridMain = new dhtmlXGridObject('gridbox');
        this.#gridMain.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridMain.setHeader("No,Document Code, Document Name, Author, Effective Date, Periodic Review, Document Type, View Link, Soft File, Training Record, Status, Remark,");
        this.#gridMain.setInitWidths("50,150,200,100,150,150,200,70,70,70,100,*,100");
        this.#gridMain.setColumnMinWidth("50,150,200,100,150,150,200,70,70,70,100,100,100");
        this.#gridMain.setColAlign("center,center,center,center,center,center,center,center,center,center,center,center,center");
        this.#gridMain.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
        this.#gridMain.setColSorting("int,str,str,str,str,str,str,str,str,str,str,str,str");
        this.#gridMain.enableAutoWidth(true);
        this.#gridMain.enableMultiselect(true);
        this.#gridMain.enableBlockSelection();
        this.#gridMain.obj.className = "obj gridMain";
        this.#gridMain.entBox.id = "GridMain";
        this.#gridMain.init();

        this.#loadGrid();
    }

    async #loadGrid() {
        const model = {
            DocumentCode: this.#txtDocumentCode.val() || "",
            DocumentName: this.#txtDocumentName.val() || "",
            Author: this.#txtAuthor.val() || "",
            DepartmentRelated: this.#ddlDepartmentRelated.val() || - 1,
            DocumentType: this.#ddlDocumentType.val() || -1
        }
        const client = new Client({ method: HttpMethod.POST, query: { handler: 'LoadDocument' }, content: model });
        let data = await client.sendRequest();
        this.#gridMain.clearAll();
        data.json().then(e => {
            if (e.OK) e.Result.forEach((r, i) => {
                this.#gridMain.addRow(i + 1, [
                    i + 1,
                    r.DocumentCode,
                    r.DocumentName,
                    r.Author,
                    r.EffectiveDate,
                    r.PeriodicReview,
                    r.DocumentTypeName,
                    r.PdfFile != undefined && r.PdfFile != "" ? "<a target='_blank' href='/Files/DocumentControl/PDFFiles/" + r.PdfFile + "'>View</a>" : "",
                    r.SoftCopy != undefined && r.SoftCopy != "" ? "<a target='_blank' href='/Files/DocumentControl/SoftCopys/" + r.SoftCopy + "'>View</a>" : "",
                    r.TrainingRecord != undefined && r.TrainingRecord != "" ? "<a target='_blank' href='/Files/DocumentControl/TrainingRecords/" + r.TrainingRecord + "'>View</a>" : "",
                    r.Status,
                    r.Remark,
                    "<button class='btn btn-primary btn-sm' onClick='window.open(\"/DocumentControl/DocumentDetail?D=" + r.DocumentCode + "\")'>View Detail</button>"
                ])
            })
        });
    }


    async #loadDropDown() {
        const client = new Client({ path: "/DocumentControl/CreateDocumentCode", method: HttpMethod.GET, query: { handler: 'Department' } });
        let data = await client.sendRequest();
        data.json().then(e => {
            this.#ddlDepartmentRelated.append("<option value='-1'>All</option>");
            e.forEach(val => {
                this.#ddlDepartmentRelated.append("<option value='" + val.id + "'>" + val.value + " - " + val.text + "</option>");
            })
        });

        const clientDocumentType = new Client({ path: "/DocumentControl/DepartmentManagement", method: HttpMethod.POST, query: { handler: 'DocumentType' }, content: { TypeCode: "*", isActive: true } });
        data = await clientDocumentType.sendRequest(true);
        this.#ddlDocumentType.append("<option value='-1'>All</option>");
        data.Result.forEach(val => {
            this.#ddlDocumentType.append("<option value='" + val.DocumentTypeId + "'>" + val.DocumentTypeCode + " - " + val.DocumentTypeName + "</option>");
        })
    }
}

$(async () => {
    const main = new DocumentMaster();
    main.initial();
})