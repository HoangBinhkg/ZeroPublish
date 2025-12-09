/// <reference path="../../../assets/Custom/_reference.js" />

class CreateDocumentCode {
    #btnLocalDocument;
    #btnGlobalDocument;
    #modalLoading;
    #modalLocalDocument;
    #modalGlobalDocument;
    #txtGlobalDocumentName;
    #txtLocalDocumentName;
    #txtGlobalDocumentCode;
    #ddlDocumentType;
    #ddlDepartment;
    #btnGenerateLocal;
    #btnGenerateGlobal;

    constructor() {
        this.#modalLoading = $('#modal-loading');
        this.#modalLocalDocument = $('#modalLocalDocument');
        this.#modalGlobalDocument = $('#modalGlobalDocument');


        this.#btnLocalDocument = $('#btnLocalDocument');
        this.#btnGlobalDocument = $('#btnGlobalDocument');
        this.#btnGenerateLocal = $('#btnGenerateLocal');
        this.#btnGenerateGlobal = $('#btnGenerateGlobal');

        this.#ddlDepartment = $('#ddlDepartment');
        this.#ddlDocumentType = $('#ddlDocumentType');


        this.#txtGlobalDocumentName = $('#txtGlobalDocumentName');
        this.#txtLocalDocumentName = $('#txtLocalDocumentName');
        this.#txtGlobalDocumentCode = $('#txtGlobalDocumentCode');
    }

    async initial() {


        try {
            Controls.toggleModal(this.#modalLoading, true);
            this.#registerEvents();
            await this.#loadData();
        }
        catch (error) {
            Notify.showException(error);
        }
        finally {
            Controls.toggleModal(this.#modalLoading, false);
        }
    }

    #loadData() {

        this.#loadDropDown();
    }

    #registerEvents() {
        this.#btnLocalDocument.off('click').on('click', e => {
            Controls.toggleModal(this.#modalLocalDocument, true);
        });

        this.#btnGlobalDocument.off('click').on('click', e => {
            Controls.toggleModal(this.#modalGlobalDocument, true);
        });

        this.#btnGenerateLocal.off('click').on('click', async e => {
            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'GenerateCode' }, content: {
                    DocumentTypeId: this.#ddlDocumentType.val(),
                    DepartmentId: this.#ddlDepartment.val(),
                    DocumentName: this.#txtLocalDocumentName.val()
                }
            });
            let data = await client.sendRequest();
            data.json().then(e => {
                if (e.OK) {
                    if (confirm(e.Result + " has been created. Do you want update document information")) {
                        window.location.href = "../DocumentControl/DocumentDetail?D=" + e.Result;
                    }
                } else alert(e.Exeception.Message);
            });
        });

        this.#btnGenerateGlobal.off('click').on('click', async e => {
            let documentCode = this.#txtGlobalDocumentCode.val();
            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'AddCode' }, content: {
                    DocumentCode: documentCode,
                    DocumentName: this.#txtGlobalDocumentName.val()
                }
            });
            let data = await client.sendRequest();
            data.json().then(e => {
                if (e.OK) {
                    if (confirm(e.Result + " has been created. Do you want update document information")) {
                        window.location.href = "../DocumentControl/DocumentDetail?D=" + e.Result;
                    }
                } else alert(e.Exeception.Message);
            });
        });
    }

    async #loadDropDown() {
        const client = new Client({ method: HttpMethod.GET, query: { handler: 'Department' } });
        let data = await client.sendRequest();
        data.json().then(e => {
            e.forEach(val => {
                this.#ddlDepartment.append("<option value='" + val.id + "'>" + val.value + " - " + val.text + "</option>");
            })
        });

        const clientDocumentType = new Client({ path: "/DocumentControl/DepartmentManagement", method: HttpMethod.POST, query: { handler: 'DocumentType' }, content: { TypeCode: "Main", IsActive: true } });
        data = await clientDocumentType.sendRequest(true);
        data.Result.forEach(val => {
            this.#ddlDocumentType.append("<option value='" + val.DocumentTypeId + "'>" + val.DocumentTypeCode + " - " + val.DocumentTypeName + "</option>");
        })
    }
}

$(async () => {
    const main = new CreateDocumentCode();
    main.initial();
})