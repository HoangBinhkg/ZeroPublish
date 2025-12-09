/// <reference path="../../../assets/Custom/_reference.js" />

class DocumentDetailReleased {
    #modalLoading;

    #gridDepartment;
    #gridDocumentSupport;
    #gridHistory;

    #dEffectiveDate;
    #dPeriodicReview;

    #txtDocumentCode;
    #txtVersionNumber;
    #txtDocumentName;
    #txtAuthor;
    #txtAuthorId;
    #txtPDFFile;
    #txtSoftCopy;
    #txtStatus;
    #txtDocumentType;
    #txtTrainingRecord;
    #txtRemark;


    departmentApprovalList;
    documentId;
    approvalList;

    #btnComment;
    #btnPDFFiLe;
    #btnSoftSopy;
    #btnTrainingRecord;


    constructor() {
        this.#modalLoading = $('#modal-loading');

        this.#dEffectiveDate = $('#dEffectiveDate');
        this.#dPeriodicReview = $('#dPeriodicReview');

        this.#txtDocumentCode = $('#txtDocumentCode');
        this.#txtVersionNumber = $('#txtVersionNumber');
        this.#txtDocumentName = $('#txtDocumentName');
        this.#txtAuthor = $('#txtAuthor');
        this.#txtAuthorId = $('#txtAuthorId');
        this.#txtPDFFile = $('#txtPDFFile');
        this.#txtSoftCopy = $('#txtSoftCopy');
        this.#txtStatus = $('#txtStatus');
        this.#txtDocumentType = $('#txtDocumentType');
        this.#txtTrainingRecord = $('#txtTrainingRecord');
        this.#txtRemark = $('#txtRemark');

        this.#btnComment = $('#btnComment');

        this.#btnPDFFiLe = $('#btnPDFFiLe');
        this.#btnSoftSopy = $('#btnSoftSopy');
        this.#btnTrainingRecord = $('#btnTrainingRecord');
    }


    async initial() {
        try {
            Controls.toggleModal(this.#modalLoading, true);
            this.#registerEvents();
            this.#initGrid();
            await this.#loadData();
            await this.#loadDocumentSupport();
            await this.#loadDocumentApproval();
            await this.#loadHistory();
        }
        catch (error) {
            Notify.showException(error);
        }
        finally {
            Controls.toggleModal(this.#modalLoading, false);
        }
    }



    #registerEvents() {
        this.#btnComment.off('click').on('click', e => {
            let comment = prompt("Commnet");
            if (comment != "") {
                this.#addComment(comment);
            }
        });


        this.#btnPDFFiLe.off('click').on('click', e => {
            if (this.#txtPDFFile.val() != "") window.open("~/Files/DocumentControl/PDFFiles/" + this.#txtPDFFile.val());
        });
        this.#btnSoftSopy.off('click').on('click', e => {
            if (this.#txtSoftCopy.val() != "") window.open("~/Files/DocumentControl/SoftCopys/" + this.#txtSoftCopy.val());
        });
        this.#btnTrainingRecord.off('click').on('click', e => {
            if (this.#txtTrainingRecord.val() != "") window.open("~/Files/DocumentControl/TrainingRecords/" + this.#txtTrainingRecord.val());

        });
    }

    async #loadData() {
        var url = new URL(window.location);
        let documentcode = url.searchParams.get("D");

        const client = new Client({
            method: HttpMethod.POST, query: { handler: 'LoadDocument' }, content: {
                DocumentCode: documentcode
            }
        });
        let result = await client.sendRequest();

        if (result.ok) {
            let dateNow = new Date();
            let documentData = await result.json();
            this.documentId = parseInt(documentData.Result[0].DocumentId);
            this.#txtDocumentCode.val(documentData.Result[0].DocumentCode);
            this.#txtVersionNumber.val(documentData.Result[0].VersionNumber);
            this.#txtDocumentName.val(documentData.Result[0].DocumentName);
            this.#txtAuthor.val(documentData.Result[0].Author);
            this.#txtAuthorId.val(documentData.Result[0].AuthorId);
            this.#txtPDFFile.val(documentData.Result[0].PdfFile);
            this.#txtSoftCopy.val(documentData.Result[0].SoftCopy);
            this.#txtStatus.val(documentData.Result[0].Status);
            this.#txtDocumentType.val(documentData.Result[0].DocumentTypeName);
            this.#txtTrainingRecord.val(documentData.Result[0].TrainingRecord);
            this.#txtRemark.val(documentData.Result[0].Remark);
            this.#dEffectiveDate.val(documentData.Result[0].EffectiveDate);
            this.#dPeriodicReview.val(documentData.Result[0].PeriodicReview);
        }
    }

    async #loadDocumentSupport() {
        const client = new Client({
            method: HttpMethod.POST, query: { handler: 'LoadDocumentSupport' }, content: {
                DocumentCode: this.#txtDocumentCode.val().substring(0, 8)
            }
        });
        let data = await client.sendRequest();
        this.#gridDocumentSupport.clearAll();
        data.json().then(e => {
            e.Result.forEach((r, i) => {
                if (r.Status == "Released") this.#gridDocumentSupport.addRow(i + 1, [i + 1, r.DocumentCode, r.DocumentName, r.Status, "<a target='_blank' href='/DocumentControl/DocumentDetailReleased?D=" + r.DocumentCode + "'>View</a>"]);
            });
        });
    }

    async #loadDocumentApproval() {
        const client = new Client({
            method: HttpMethod.POST, query: { handler: 'LoadDocumentApproval' }, content: {
                DocumentId: this.documentId
            }
        });

        let data = await client.sendRequest();
        if (data.ok) {
            data.json().then(e => {
                this.#gridDepartment.clearAll();
                e.Result.forEach((r, i) => {
                    if (r.IsApproved == 1) this.#gridDepartment.addRow(r.DepartmentId, [i + 1, r.DepartmentEN, r.UserId, r.EMail, "Approved", r.ApprovalDate]);
                });
            });
        }
    }


    #initGrid() {
        this.#gridDepartment = new dhtmlXGridObject('gridDepartment');
        this.#gridDepartment.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridDepartment.setHeader("No,Department,,Approver,Status,Approval Date");
        this.#gridDepartment.setInitWidths("40,150,0,*,100,130");
        this.#gridDepartment.setColumnMinWidth("40,150,0,100,100,130");
        this.#gridDepartment.setColAlign("center,center,center,center,center,center");
        this.#gridDepartment.setColTypes("ro,ro,ro,ro,ro,ro");
        this.#gridDepartment.setColSorting("int,str,str,str,str,str");
        this.#gridDepartment.enableAutoWidth(true);
        this.#gridDepartment.enableMultiselect(true);
        this.#gridDepartment.enableBlockSelection();
        this.#gridDepartment.obj.className = "obj gridDepartment";
        this.#gridDepartment.entBox.id = "gridDepartment";
        this.#gridDepartment.init();

        this.#gridDocumentSupport = new dhtmlXGridObject('gridDocumentSupport');
        this.#gridDocumentSupport.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridDocumentSupport.setHeader("No,Document Code,Document Name,Status,");
        this.#gridDocumentSupport.setInitWidths("50,150,*,100,100");
        this.#gridDocumentSupport.setColumnMinWidth("50,150,100,100,100");
        this.#gridDocumentSupport.setColAlign("center,center,center,center,center");
        this.#gridDocumentSupport.setColTypes("ro,ro,ro,ro,ro");
        this.#gridDocumentSupport.setColSorting("int,str,str,str,str");
        this.#gridDocumentSupport.enableAutoWidth(true);
        this.#gridDocumentSupport.enableMultiselect(true);
        this.#gridDocumentSupport.enableBlockSelection();
        this.#gridDocumentSupport.obj.className = "obj gridDocumentSupport";
        this.#gridDocumentSupport.entBox.id = "gridDocumentSupport";
        this.#gridDocumentSupport.init();


        this.#gridHistory = new dhtmlXGridObject('gridHistory');
        this.#gridHistory.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridHistory.setHeader("No,Updated By,Content,Type,Created Date");
        this.#gridHistory.setInitWidths("50,100,*,100,130");
        this.#gridHistory.setColumnMinWidth("50,100,100,100,130");
        this.#gridHistory.setColAlign("center,center,center,center,center");
        this.#gridHistory.setColTypes("ro,ro,txt,ro,ro");
        this.#gridHistory.setColSorting("int,str,str,str,str");
        this.#gridHistory.enableAutoWidth(true);
        this.#gridHistory.enableMultiselect(true);
        this.#gridHistory.enableBlockSelection();
        this.#gridHistory.obj.className = "obj gridHistory";
        this.#gridHistory.entBox.id = "gridHistory";
        this.#gridHistory.init();
        
    }

    async #addComment(comment) {
        const client = new Client({
            method: HttpMethod.POST, query: { handler: 'AddHistoryDocument' }, content: {
                DocumentId: this.documentId,
                HistoryType: "Comment",
                ContentText : comment
            }
        });
        let data = await client.sendRequest();
        this.#loadHistory();
    }

    async #loadHistory() {
        const client = new Client({
            method: HttpMethod.POST, query: { handler: 'LoadHistoryDocument' }, content: {
                DocumentId: this.documentId
            }
        });
        let data = await client.sendRequest();
        this.#gridHistory.clearAll();
        data.json().then(e => {
            e.Result.forEach((r, i) => {
                this.#gridHistory.addRow(i + 1, [i + 1, r.Name, r.ContentText, r.HistoryType, r.CreatedDate]);
            });
        });
    }
}

$(async () => {
    const main = new DocumentDetailReleased();
    main.initial();
})