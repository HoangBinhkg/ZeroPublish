/// <reference path="../../../assets/Custom/_reference.js" />

class DocumentDetail {
    #modalLoading;
    #modalDocumentSupport;
    #modalChangeApprover;
    #modalChangeAuthor;

    #ddlDepartment;
    #ddlChangeAuthor;
    #ddlChangeApprover;

    #btnAddDocumentSupport;
    #btnGenerateSupport;
    #btnOpenChangeAuthor;

    #btnChangeApprover;
    #btnChangeAuthor;
    #txtDocumentApprovalId;

    #btnSubmitDocument;
    #btnSaveDocument;
    #btnReviewDocument;
    #btnReviewTrainingDocument;
    #btnApproveDocument;
    #btnConvertToDraft;
    #btnRejectDocument;
    #btnUpgradeRevision;

    #gridDepartment;
    #gridDocumentSupport;
    #gridHistory;

    #fPDFFiLe;
    #fSoftSopy;
    #fTrainingRecord;
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

    #txtDocumentSupportName;
    #ddlDocumentTypeSupport;

    departmentApprovalList;
    documentId;
    approvalList;

    userId;
    roleList;

    #divDepartmentList;

    #btnPDFFiLe;
    #btnSoftSopy;
    #btnTrainingRecord;
    #btnUpdatedTrainingRecord;
    #btnComment;






    showbtnOpenChangeAuthor;
    showbtnSubmitDocument;
    showbtnSaveDocument;
    showbtnReviewDocument;
    showbtnReviewTrainingDocument;
    showbtnConvertToDraft;
    showbtnApproveDocument;
    showbtnRejectDocument;
    showbtnUpdatedTrainingRecord;
    showbtnUpgradeRevision;
    showbtnAddDocumentSupport;
    showdivDepartmentList;


    constructor() {
        this.approvalList = [];
        this.departmentApprovalList = [];

        this.#modalLoading = $('#modal-loading');
        this.#modalDocumentSupport = $('#modalDocumentSupport')

        this.#modalChangeApprover = $('#modal-change-approver')
        this.#modalChangeAuthor = $('#modal-change-author');

        this.#ddlChangeAuthor = $('#ddlChangeAuthor');
        this.#ddlChangeApprover = $('#ddlChangeApprover');

        this.#btnChangeApprover = $('#btnChangeApprover');
        this.#btnChangeAuthor = $('#btnChangeAuthor');
        this.#btnComment = $('#btnComment');
        this.#btnOpenChangeAuthor = $('#btnOpenChangeAuthor');
        this.#btnReviewTrainingDocument = $('#btnReviewTrainingDocument');

        this.#btnUpgradeRevision = $('#btnUpgradeRevision');;
        this.#btnAddDocumentSupport = $('#btnAddDocumentSupport');;
        this.#btnGenerateSupport = $('#btnGenerateSupport');
        this.#btnSubmitDocument = $('#btnSubmitDocument');
        this.#btnSaveDocument = $('#btnSaveDocument');
        this.#btnReviewDocument = $('#btnReviewDocument');
        this.#btnRejectDocument = $('#btnRejectDocument');
        this.#btnApproveDocument = $('#btnApproveDocument');
        this.#btnConvertToDraft = $('#btnConvertToDraft');
        this.#btnPDFFiLe = $('#btnPDFFiLe');
        this.#btnSoftSopy = $('#btnSoftSopy');
        this.#btnTrainingRecord = $('#btnTrainingRecord');
        this.#btnUpdatedTrainingRecord = $('#btnUpdatedTrainingRecord');
        this.#ddlDocumentTypeSupport = $('#ddlDocumentTypeSupport');;


        this.#fPDFFiLe = $('#fPDFFiLe');
        this.#ddlDepartment = $('#ddlDepartment');
        this.#fSoftSopy = $('#fSoftSopy');;
        this.#fTrainingRecord = $('#fTrainingRecord');
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
        this.#txtDocumentSupportName = $('#txtDocumentSupportName');


        this.#txtDocumentApprovalId = $('#txtDocumentApprovalId');
        this.#divDepartmentList = $('#divDepartmentList');

        this.showbtnOpenChangeAuthor = false;
        this.showbtnSubmitDocument = false;
        this.showbtnSaveDocument = false;
        this.showbtnReviewDocument = false;
        this.showbtnReviewTrainingDocument = false;
        this.showbtnConvertToDraft = false;
        this.showbtnApproveDocument = false;
        this.showbtnRejectDocument = false;
        this.showbtnUpdatedTrainingRecord = false;
        this.showbtnUpgradeRevision = false;
        this.showbtnAddDocumentSupport = false;
        this.showdivDepartmentList = false;
    }


    async initial() {
        try {
            Controls.toggleModal(this.#modalLoading, true);
            await this.#registerEvents();
            await this.#initGrid();
            await this.#loadUser();
            await this.#loadData();
            await this.#loadDocumentSupport();
            await this.#loadDocumentApproval();
            await this.#loadDropDown();
            await this.#showHideButton();
            await this.#loadHistory();
        }
        catch (error) {
            Notify.showException(error);
        }
        finally {
            Controls.toggleModal(this.#modalLoading, false);
        }
    }

    async #loadUser() {
        const client = new Client({
            method: HttpMethod.POST, query: { handler: 'GetUserProfile' }
        });
        let result = await client.sendRequest();
        if (result.ok) {
            let user = await result.json();
            this.userId = user.UserId;
            this.roleList = user.roleList;
        }
    }

    async #showHideButton() {
        if (this.roleList.indexOf("TQ") !== -1) {
            this.showbtnOpenChangeAuthor = true;
        }

        if (this.#txtStatus.val() == "Draft") {
            this.#gridDepartment.setColumnHidden(6, false);
            if (this.#txtAuthorId.val() == this.userId) {
                this.showbtnSubmitDocument = true;
                this.showbtnSaveDocument = true;
                this.showbtnAddDocumentSupport = true;
                this.showdivDepartmentList = true;
                this.showbtnOpenChangeAuthor = true;



                this.#txtDocumentName.prop('readonly', false);
                this.#dEffectiveDate.prop('readonly', false);
                this.#dPeriodicReview.prop('readonly', false);
                this.#txtRemark.prop('readonly', false);

                this.#btnPDFFiLe.show();
                this.#btnSoftSopy.show();
            }
        } else if (this.#txtStatus.val() == "Submitted") {
            this.#gridDepartment.setColumnHidden(5, false);
            if (this.roleList.indexOf("TQ") !== -1) {
                this.showbtnReviewDocument = true;
            }
            if (this.#txtAuthorId.val() == this.userId) this.showbtnConvertToDraft = true;
        } else if (this.#txtStatus.val() == "Reviewed") {
            this.#gridDepartment.setColumnHidden(5, false);
            if (this.approvalList.indexOf(parseInt(this.userId)) !== -1) {
                this.showbtnApproveDocument = true;
                this.showbtnRejectDocument = true;
            }
            if (this.#txtAuthorId.val() == this.userId) this.showbtnConvertToDraft = true;

        } else if (this.#txtStatus.val() == "Approved") {
            this.#gridDepartment.setColumnHidden(5, false);

            if (this.#txtAuthorId.val() == this.userId) {
                this.showbtnConvertToDraft = true;
                this.showbtnUpdatedTrainingRecord = true;
                this.#btnTrainingRecord.show();
            }
        } else if (this.#txtStatus.val() == "Updated Training Record") {
            this.#gridDepartment.setColumnHidden(5, false);
            if (this.#txtAuthorId.val() == this.userId) this.showbtnConvertToDraft = true;
            if (this.roleList.indexOf("TQ") !== -1) this.showbtnReviewTrainingDocument = true;
        } else if (this.#txtStatus.val() == "Released") {
            this.#gridDepartment.setColumnHidden(5, false);
            if (this.#txtAuthorId.val() == this.userId) this.showbtnUpgradeRevision = true;
        }

        await this.#showButton();
    }

    #showButton() {
        if (this.showbtnOpenChangeAuthor) this.#btnOpenChangeAuthor.show();
        if (this.showbtnSubmitDocument) this.#btnSubmitDocument.show();
        if (this.showbtnSaveDocument) this.#btnSaveDocument.show();
        if (this.showbtnReviewDocument) this.#btnReviewDocument.show();
        if (this.showbtnReviewTrainingDocument) this.#btnReviewTrainingDocument.show();
        if (this.showbtnConvertToDraft) this.#btnConvertToDraft.show();
        if (this.showbtnApproveDocument) this.#btnApproveDocument.show();
        if (this.showbtnRejectDocument) this.#btnRejectDocument.show();
        if (this.showbtnUpdatedTrainingRecord) this.#btnUpdatedTrainingRecord.show();
        if (this.showbtnUpgradeRevision) this.#btnUpgradeRevision.show();
        if (this.showbtnAddDocumentSupport) this.#btnAddDocumentSupport.show();
        if (this.showdivDepartmentList) this.#divDepartmentList.show();
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
            //this.#dEffectiveDate.val(documentData.Result[0].EffectiveDate || dateNow.addDays(5).yyyyMMdd());
            //this.#dPeriodicReview.val(documentData.Result[0].PeriodicReview || dateNow.addDays(180).yyyyMMdd());
            this.#dEffectiveDate.datepicker('update', documentData.Result[0].EffectiveDate || dateNow.addDays(5).yyyyMMdd());
            this.#dPeriodicReview.datepicker('update', documentData.Result[0].dPeriodicReview || dateNow.addDays(180).yyyyMMdd());

            //this.#dPeriodicReview.data("DateTimePicker").date(documentData.Result[0].PeriodicReview || dateNow.addDays(180).yyyyMMdd());

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
                this.#gridDocumentSupport.addRow(i + 1, [i + 1, r.DocumentCode, r.DocumentName, r.Status, "<a target='_blank' href='/DocumentControl/DocumentDetail?D=" + r.DocumentCode + "'>View</a>"]);
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
            this.departmentApprovalList = [];
            data.json().then(e => {
                this.#gridDepartment.clearAll();
                e.Result.forEach((r, i) => {
                    let status = "Waiting Approval";
                    if (r.IsApproved == 1) status = "Approved";
                    else if (r.IsApproved == 2) status = "Rejected";
                    this.#gridDepartment.addRow(r.DepartmentId, [i + 1, r.DepartmentEN, r.UserId, r.EMail, status, r.ApprovalDate, this.#txtStatus.val() == "Draft" ? "<button  type='submit' data-DocumentApprovalId='" + r.DocumentApprovalId + "' name='btnEdit' class='btn btn-primary btn-sm'>Edit</button>" : ""]);
                    this.departmentApprovalList.push(r.DepartmentId);
                    if (!r.IsApproved) this.approvalList.push(parseInt(r.UserId));
                });


                Array.from($(".gridDepartment").find('tr')).forEach(x => {
                    console.log(x);
                    $(x).find('button[name="btnEdit"]').off('click').on('click', async b => {
                        Controls.toggleModal(this.#modalChangeApprover, true);
                        this.#txtDocumentApprovalId.val($(b.currentTarget).data('documentapprovalid'));
                        this.#loadDropDownApprover();
                    });
                });

            });
        }
    }

    async #addDocumentApproval(departmentid) {
        const client = new Client({
            method: HttpMethod.POST, query: { handler: 'AddDocumentApproval' }, content: {
                DocumentId: this.documentId,
                DepartmentId: parseInt(departmentid)
            }
        });
        let data = await client.sendRequest(true);
        if (data.OK == true && data.Result != "") {
            alert(data.Result);
            return false;
        } else return true;
    }

    async #removeDocumentApproval(departmentid) {
        const client = new Client({
            method: HttpMethod.POST, query: { handler: 'RemoveDocumentApproval' }, content: {
                DocumentId: this.documentId,
                DepartmentId: parseInt(departmentid)
            }
        });
        let data = await client.sendRequest();
    }

    async #saveDocument() {
        if (this.#dEffectiveDate.val() == "" || this.#dEffectiveDate.val() == null || this.#dPeriodicReview.val() == "" || this.#dPeriodicReview.val() == null) {
            alert("Please input Effective Date && Periodic Review");
            return false;
        }

        const client = new Client({
            method: HttpMethod.POST, query: { handler: 'DocumentUpdate' }, content: {
                DocumentId: this.documentId,
                DocumentName: this.#txtDocumentName.val(),
                PDFFile: this.#txtPDFFile.val(),
                SoftCopy: this.#txtSoftCopy.val(),
                TrainingRecord: this.#txtTrainingRecord.val(),
                Remark: this.#txtRemark.val(),
                EffectiveDate: this.#dEffectiveDate.val(),
                PeriodicReview: this.#dPeriodicReview.val(),
            }
        });
        let data = await client.sendRequest();

        return true;
    }

    async #updateStatus(statusCode) {
        const client = new Client({
            method: HttpMethod.POST, query: { handler: 'DocumentStatusUpdate' }, content: {
                DocumentId: this.documentId,
                Status: statusCode,
                UpdatedBy: this.UserId
            }
        });
        let data = await client.sendRequest();
    }



    async #approveDocument(dp) {
        let remark = prompt("Please input remark");
        const client = new Client({
            method: HttpMethod.POST, query: { handler: 'ApproveDocument' }, content: {
                DocumentId: this.documentId,
                DepartmentIdList: dp.join(","),
                ApproverId: this.UserId,
                Remark: remark
            }
        });
        let data = await client.sendRequest();
        return data.ok;
    }


    async #RejectDocument(dp) {
        let remark = prompt("Please input remark");
        const client = new Client({
            method: HttpMethod.POST, query: { handler: 'RejectDocument' }, content: {
                DocumentId: this.documentId,
                DepartmentIdList: dp.join(","),
                ApproverId: this.UserId,
                Remark: remark
            }
        });
        let data = await client.sendRequest();
        return data.ok;
    }

    #registerEvents() {
        this.#ddlDepartment.on('change', async e => {
            if (!this.showdivDepartmentList) return;
            Controls.toggleModal(this.#modalLoading, true);
            let result = true;
            let departmentIDList = [];
            this.#ddlDepartment.val().forEach(d => {
                departmentIDList.push(parseInt(d));
            });
            let ListAdd = departmentIDList.filter(x => !this.departmentApprovalList.includes(x));
            let ListRemove = this.departmentApprovalList.filter(x => !departmentIDList.includes(x));


            if (ListAdd.length > 0) {
                await ListAdd.forEach(async l => { await this.#addDocumentApproval(l) });
            }


            if (ListRemove.length > 0) {
                await ListRemove.forEach(async l => { await this.#removeDocumentApproval(l) });
            }

            await setTimeout(() => {
                this.#loadDocumentApproval()
            }, 1000);
            Controls.toggleModal(this.#modalLoading, false);
            console.log(result);
            return result;

        });

        this.#btnComment.off('click').on('click', e => {
            let comment = prompt("Commnet");
            if (comment != "") {
                this.#addComment(comment);
            }
        });

        this.#btnAddDocumentSupport.off('click').on('click', e => {
            if (!this.showbtnAddDocumentSupport) return;
            Controls.toggleModal(this.#modalDocumentSupport, true);
        });

        this.#btnUpgradeRevision.off('click').on('click', async e => {
            if (!this.showbtnUpgradeRevision) return;
            Controls.toggleModal(this.#modalLoading, true);

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UpgradeRevision' }, content: {
                    DocumentId: this.documentId
                }
            });
            let data = await client.sendRequest();
            data.json().then(e => {
                if (e.OK) {
                    window.location.href = "/DocumentControl/DocumentDetail?D=" + e.Result;
                } else alert(e.Exeception.Message);
            });
            Controls.toggleModal(this.#modalLoading, false);
        });




        this.#txtPDFFile.off('dblclick').on('dblclick', e => {
            if (this.#txtPDFFile.val() != "") window.open("../Files/DocumentControl/PDFFiles/" + this.#txtPDFFile.val());
        });

        this.#txtSoftCopy.off('dblclick').on('dblclick', e => {
            if (this.#txtSoftCopy.val() != "") window.open("../Files/DocumentControl/SoftCopys/" + this.#txtSoftCopy.val());
        });

        this.#txtTrainingRecord.off('dblclick').on('dblclick', e => {
            if (this.#txtTrainingRecord.val() != "") window.open("../Files/DocumentControl/TrainingRecords/" + this.#txtTrainingRecord.val());
        });

        this.#btnSubmitDocument.off('click').on('click', async e => {
            if (!this.showbtnSubmitDocument) return;

            Controls.toggleModal(this.#modalLoading, true);
            let effectiveDateDiff = this.#dEffectiveDate.val().toDate().dayDiff(false);
            let periodicReviewDiff = this.#dPeriodicReview.val().toDate().dayDiff(false);
            if (effectiveDateDiff > 7 || effectiveDateDiff < 0) {
                alert("Effective date is more than 7 days from the current date or less than the current date.");
            } else if (periodicReviewDiff > 365 || periodicReviewDiff < 30) {
                alert("Periodic Review date is more than 365 days from the current date or less than the 30 dats from the current date.");
            } else if (this.#ddlDepartment.val() == "" || this.#gridDepartment.getRowsNum() == 0) {
                alert("Department relate is empty, please check again");
            } else {
                if (this.#saveDocument()) {
                    await this.#updateStatus(2);
                    await location.reload();
                }
            }
            Controls.toggleModal(this.#modalLoading, false);
        });

        this.#btnSaveDocument.off('click').on('click', e => {
            if (!this.showbtnSaveDocument) return;
            if (this.#saveDocument()) location.reload();
        });


        this.#btnConvertToDraft.off('click').on('click', e => {
            if (!this.showbtnConvertToDraft) return;
            this.#updateStatus(1);
            location.reload();
        });

        this.#btnReviewDocument.off('click').on('click', e => {
            if (!this.showbtnReviewDocument) return;
            this.#updateStatus(3);
            location.reload();
        });

        this.#btnReviewTrainingDocument.off('click').on('click', e => {
            this.#updateStatus(6);
            location.reload();
        });

        this.#btnRejectDocument.off('click').on('click', e => {
            if (!this.showbtnRejectDocument) return;
            let departmentApprove = [];
            this.#gridDepartment.forEachRow(id => {
                if (this.#gridDepartment.cellById(id, 2).getValue() == this.userId) departmentApprove.push(id);
            });
            if (this.#RejectDocument(departmentApprove)) location.reload();
            location.reload();
        });

        this.#btnUpdatedTrainingRecord.off('click').on('click', e => {
            if (!this.showbtnUpdatedTrainingRecord) return;
            if (this.#txtTrainingRecord.val() == "") {
                alert("Please upload Training Record");
            } else {
                if (this.#saveDocument()) {
                    this.#updateStatus(5);
                    location.reload();
                }
            }
        });

        this.#btnApproveDocument.off('click').on('click', e => {
            if (!this.showbtnApproveDocument) return;
            let departmentApprove = [];
            this.#gridDepartment.forEachRow(id => {
                if (this.#gridDepartment.cellById(id, 2).getValue() == this.userId) departmentApprove.push(id);
            });
            if (this.#approveDocument(departmentApprove)) location.reload();
        });

        this.#btnChangeApprover.off('click').on('click', async e => {
            if (!this.showbtnSaveDocument) return;

            Controls.toggleModal(this.#modalLoading, true);

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UpdateApprover' }, content: {
                    DocumentApprovalId: this.#txtDocumentApprovalId.val(),
                    UserId: this.#ddlChangeApprover.val(),
                }
            });
            let data = await client.sendRequest();
            data.json().then(e => {
                if (e.OK) {
                    this.#loadDocumentApproval();
                } else alert(e.Exeception.Message);
            });
            Controls.toggleModal(this.#modalChangeApprover, false);
            Controls.toggleModal(this.#modalLoading, false);
        });


        this.#btnChangeAuthor.off('click').on('click', async e => {
            if (!this.showbtnOpenChangeAuthor) return;

            Controls.toggleModal(this.#modalLoading, true);

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UpdateAuthor' }, content: {
                    DocumentId: this.documentId,
                    UserId: this.#ddlChangeAuthor.val(),
                }
            });
            let data = await client.sendRequest();
            data.json().then(e => {
                if (e.OK) {
                    location.reload();
                } else alert(e.Exeception.Message);
            });
            Controls.toggleModal(this.#modalChangeApprover, false);
            Controls.toggleModal(this.#modalLoading, false);
        });


        this.#btnOpenChangeAuthor.off('click').on('click', e => {
            if (!this.showbtnOpenChangeAuthor) return;
            Controls.toggleModal(this.#modalChangeAuthor, true);
        });



        this.#btnGenerateSupport.off('click').on('click', async e => {
            if (!this.showbtnAddDocumentSupport) return;
            Controls.toggleModal(this.#modalLoading, true);

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'GenerateSupportCode' }, content: {
                    DocumentTypeId: this.#ddlDocumentTypeSupport.val(),
                    DocumentMain: this.#txtDocumentCode.val().substring(0, 8),
                    DocumentName: this.#txtDocumentSupportName.val()
                }
            });
            let data = await client.sendRequest();
            data.json().then(e => {
                if (e.OK) {
                    this.#loadDocumentSupport();
                } else alert(e.Exeception.Message);
            });
            Controls.toggleModal(this.#modalDocumentSupport, false);
            Controls.toggleModal(this.#modalLoading, false);

        });

        this.#fPDFFiLe.off("change").on('change', async e => {

            const formData = new FormData();
            formData.append("files", e.currentTarget.files[0]);
            formData.append("FileType", "PDFFiles");
            formData.append("__RequestVerificationToken", $('input:hidden[name="__RequestVerificationToken"]').val());

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UploadFile' }, content: formData
            });
            let data = await client.sendFileRequest();
            await data.text().then(e => {
                this.#txtPDFFile.val(e);
            })

        })

        this.#fSoftSopy.off("change").on('change', async e => {

            const formData = new FormData();
            formData.append("files", e.currentTarget.files[0]);
            formData.append("FileType", "SoftCopys");

            formData.append("__RequestVerificationToken", $('input:hidden[name="__RequestVerificationToken"]').val());

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UploadFile' }, content: formData
            });
            let data = await client.sendFileRequest();
            data.text().then(e => {
                this.#txtSoftCopy.val(e);
            })

        })

        this.#fTrainingRecord.off("change").on('change', async e => {

            const formData = new FormData();
            formData.append("files", e.currentTarget.files[0]);
            formData.append("FileType", "TrainingRecords");
            formData.append("__RequestVerificationToken", $('input:hidden[name="__RequestVerificationToken"]').val());

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UploadFile' }, content: formData
            });
            let data = await client.sendFileRequest();
            data.text().then(e => {
                this.#txtTrainingRecord.val(e);
            })

        })
    }

    #initGrid() {
        this.#gridDepartment = new dhtmlXGridObject('gridDepartment');
        this.#gridDepartment.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridDepartment.setHeader("No,Department,,Approver,Status,Approval Date,");
        this.#gridDepartment.setInitWidths("40,150,0,*,100,100,60");
        this.#gridDepartment.setColAlign("center,center,center,center,center,center,center");
        this.#gridDepartment.setColTypes("ro,ro,ro,ro,ro,ro,ro");
        this.#gridDepartment.setColSorting("int,str,str,str,str,str,str");
        this.#gridDepartment.enableAutoWidth(true);
        this.#gridDepartment.enableMultiselect(true);
        this.#gridDepartment.enableBlockSelection();
        this.#gridDepartment.obj.className = "obj gridDepartment";
        this.#gridDepartment.entBox.id = "gridDepartment";
        this.#gridDepartment.init();
        this.#gridDepartment.setColumnHidden(5, true);
        this.#gridDepartment.setColumnHidden(6, true);



        this.#gridDocumentSupport = new dhtmlXGridObject('gridDocumentSupport');
        this.#gridDocumentSupport.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridDocumentSupport.setHeader("No,Document Code,Document Name,Status,");
        this.#gridDocumentSupport.setInitWidths("50,150,*,100,100");
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
        this.#gridHistory.setInitWidths("50,100,*,100,150");
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

    async #loadDropDown() {
        const client = new Client({ path: "/DocumentControl/CreateDocumentCode", method: HttpMethod.GET, query: { handler: 'Department' } });
        let data = await client.sendRequest();


        data.json().then(e => {
            e.forEach(val => {
                if (this.departmentApprovalList.indexOf(val.id) !== -1) this.#ddlDepartment.append("<option value='" + val.id + "' selected>" + val.text + "</option>");
                else this.#ddlDepartment.append("<option value='" + val.id + "'>" + val.text + "</option>");
            })
        });

        const clientDocumentType = new Client({
            path: "/DocumentControl/CreateDocumentCode", method: HttpMethod.POST, query: { handler: 'DocumentType' }, content: {
                TypeCode : "Support"
            }
        });

        data = await clientDocumentType.sendRequest();
        data.json().then(e => {
            e.forEach(val => {
                this.#ddlDocumentTypeSupport.append("<option value='" + val.id + "'>" + val.value + " - " + val.text + "</option>");
            })
        });



        const clientAuthor= new Client({ method: HttpMethod.POST, query: { handler: 'GetUser' }});

        data = await clientAuthor.sendRequest();
        data.json().then(e => {
            e.Result.forEach(val => {
                this.#ddlChangeAuthor.append("<option value='" + val.UserId + "'>" + val.UserName + " - " + val.FullName + " - " + val.Email + "</option>");
            })
        });
    }

    async #loadDropDownApprover() {
        const client = new Client({
            method: HttpMethod.POST, query: { handler: 'GetApprover' }, content: {
                DocumentApprovalId: this.#txtDocumentApprovalId.val()
            }
        });

        let data = await client.sendRequest();
        data.json().then(e => {
            this.#ddlChangeApprover.empty();
            e.Result.forEach(val => {
                this.#ddlChangeApprover.append("<option value='" + val.UserId + "'>" + val.UserName + " - " + val.FullName + " - " + val.Email + "</option>");
            })
        });
    }
}

$(async () => {
    const main = new DocumentDetail();
    main.initial();
})