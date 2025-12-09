/// <reference path="../../../assets/Custom/_reference.js" />

class DepartmentManagement {
    #modalLoading;
    #modalDepartment;
    #modalApprover;
    #modalDocumentType;

    #btnOpenDepartment;
    #btnOpenApprover;
    #btnOpenDocumentType;

    #btnUpdateDepartment;
    #btnUpdateApprover;

    #txtDepartmentIdForDepartment;
    #txtDepartmentCode;
    #txtDepartmentEN;
    #txtDepartmentVN;
    #cbIsActiveDepartment;

    #txtDepartmentIdForApprover;
    #txtDepartmentApproverId;
    #ddlApprover;
    #ddlDocumentType;
    #cbIsActiveApprover;


    #txtDocumentTypeId;
    #txtDocumentTypeCode;
    #txtDocumentTypeName;
    #ddlDocumentTypeCode;
    #cbIsActiveDocumentType;
    #btnUpdateDocumentType;

    #gridDepartment;
    #gridApprover;
    #gridDocumentType;

    constructor() {
        this.#modalLoading = $('#modal-loading');
        this.#modalDepartment = $('#modal-department');
        this.#modalApprover = $('#modal-approver');
        this.#modalDocumentType = $('#modal-documenttype');

        this.#btnOpenDepartment = $('#btnOpenDepartment');
        this.#btnOpenApprover = $('#btnOpenApprover');
        this.#btnOpenDocumentType = $("#btnOpenDocumentType");
        this.#btnUpdateDepartment = $('#btnUpdateDepartment');
        this.#btnUpdateApprover = $('#btnUpdateApprover');
        this.#btnUpdateDocumentType = $('#btnUpdateDocumentType');

        this.#txtDepartmentIdForDepartment = $('#txtDepartmentIdForDepartment');
        this.#txtDepartmentApproverId = $('#txtDepartmentApproverId');
        this.#txtDepartmentIdForApprover = $('#txtDepartmentIdForApprover');
        this.#txtDepartmentCode = $('#txtDepartmentCode');
        this.#txtDepartmentEN = $('#txtDepartmentEN');
        this.#txtDepartmentVN = $('#txtDepartmentVN');
        this.#cbIsActiveDepartment = $('#cbIsActiveDepartment');

        this.#txtDocumentTypeId = $('#txtDocumentTypeId');
        this.#txtDocumentTypeCode = $('#txtDocumentTypeCode');
        this.#txtDocumentTypeName = $('#txtDocumentTypeName');
        this.#ddlDocumentTypeCode = $('#ddlDocumentTypeCode');
        this.#cbIsActiveDocumentType = $('#cbIsActiveDocumentType');

        this.#ddlApprover = $('#ddlApprover');
        this.#ddlDocumentType = $('#ddlDocumentType');
        this.#cbIsActiveApprover = $('#cbIsActiveApprover');
    }

    async initial() {
        try {
            Controls.toggleModal(this.#modalLoading, true);
            this.#registerEvents();
            this.#initGrid();
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
        this.#loadGridDepartment();
        this.#loadGridDocumentType();
        //this.#loadDropDown();
    }

    #registerEvents() {

        this.#btnOpenDepartment.off("click").on("click", async e => {
            Controls.toggleModal(this.#modalDepartment, true);
            this.#txtDepartmentIdForDepartment.val(-1);
            this.#txtDepartmentCode.val("");
            this.#txtDepartmentVN.val("");
            this.#txtDepartmentEN.val("");
            this.#cbIsActiveDepartment.prop("checked", true);
            this.#btnUpdateDepartment.html("Add Department");
        });


        this.#btnOpenDocumentType.off("click").on("click", async e => {
            Controls.toggleModal(this.#modalDocumentType, true);
            this.#txtDocumentTypeId.val(-1);
            this.#txtDocumentTypeName.val("");
            this.#txtDepartmentCode.val("");
            this.#ddlDocumentTypeCode.val("Main");
            this.#cbIsActiveDocumentType.prop("checked", true);
            this.#btnUpdateDocumentType.html("Add Document Type");
        });

        this.#btnOpenApprover.off("click").on("click", async e => {
            if (this.#txtDepartmentIdForApprover.val() != "") {
                Controls.toggleModal(this.#modalApprover, true);
                this.#txtDepartmentApproverId.val(-1);
                this.#loadDropDown("", "");
                this.#cbIsActiveApprover.prop("checked", true);
                this.#btnUpdateApprover.html("Add Approver");
            } else alert("Please chose department to add approver");
        });

        this.#btnUpdateDocumentType.off("click").on("click", async e => {

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UpdateDocumentType' }, content: {
                    DocumentTypeId: this.#txtDocumentTypeId.val(),
                    DocumentTypeCode: this.#txtDocumentTypeCode.val(),
                    DocumentTypeName: this.#txtDocumentTypeName.val(),
                    TypeCode: this.#ddlDocumentTypeCode.val(),
                    IsActive: this.#cbIsActiveDocumentType.is(":checked")
                }
            });

            let data = await client.sendRequest();
            if (data.ok) {
                this.#loadGridDocumentType();
            }

            Controls.toggleModal(this.#modalDepartment, false);
        });

        this.#btnUpdateDepartment.off("click").on("click", async e => {

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UpdateDepartment' }, content: {
                    DepartmentId: this.#txtDepartmentIdForDepartment.val(),
                    DepartmentCode: this.#txtDepartmentCode.val(),
                    DepartmentEN: this.#txtDepartmentEN.val(),
                    DepartmentVN: this.#txtDepartmentVN.val(),
                    IsActive: this.#cbIsActiveDepartment.is(":checked")

                }
            });

            let data = await client.sendRequest();
            if (data.ok) {
                this.#loadGridDepartment();
            }

            Controls.toggleModal(this.#modalDepartment, false);
        });


        this.#btnUpdateApprover.off("click").on("click", async e => {

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UpdateApprover' }, content: {
                    DepartmentApproverId: this.#txtDepartmentApproverId.val(),
                    DepartmentId: this.#txtDepartmentIdForApprover.val(),
                    ApproverId: this.#ddlApprover.val(),
                    DocumentTypeId: this.#ddlDocumentType.val(),
                    IsActive: this.#cbIsActiveApprover.is(":checked")
                }
            });

            let data = await client.sendRequest();
            if (data.ok) {
                this.#loadGridApprover(this.#txtDepartmentIdForApprover.val());
            }

            Controls.toggleModal(this.#modalApprover, false);
        });
    }

    async #loadDropDown(userid, documentTypeId) {
        const clientAuthor = new Client({ path: "/DocumentControl/DocumentDetail/", method: HttpMethod.POST, query: { handler: 'GetUser' } });

        let data = await clientAuthor.sendRequest();
        data.json().then(e => {
            this.#ddlApprover.empty();
            e.Result.forEach(val => {
                let selection = "";
                if (val.UserId == userid) selection = "selected";
                this.#ddlApprover.append("<option value='" + val.UserId + "' " + selection + ">" + val.UserName + " - " + val.FullName + " - " + val.Email + "</option>");
            })
        });
        this.#ddlDocumentType.empty();



        const clientDocumentType = new Client({
            path: "/DocumentControl/DepartmentManagement", method: HttpMethod.POST, query: { handler: 'DocumentType' }, content: {
                TypeCode: "*",
                IsActive: true
            } });

        let dataDocumentType = await clientDocumentType.sendRequest(true);
        this.#ddlDocumentType.append("<option value='0'> ALL </option>");
        dataDocumentType.Result.forEach(t => {
            let selection = "";
            if (t.DocumentTypeId == documentTypeId) selection = "selected";
            this.#ddlDocumentType.append("<option value='" + t.DocumentTypeId + "' " + selection + "> " + t.DocumentTypeCode + " - " + t.DocumentTypeName + "</option>");
            console.log(t);

        })
    }

    async #initGrid() {
        this.#gridDepartment = new dhtmlXGridObject('gridDepartment');
        this.#gridDepartment.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridDepartment.setHeader("No,Code,Department Name (EN),Department Name (VN),Active,");
        this.#gridDepartment.setInitWidths("40,100,*,*,60,70");
        this.#gridDepartment.setColAlign("center,center,center,center,center,center");
        this.#gridDepartment.setColTypes("ro,ro,ro,ro,ch,ro");
        this.#gridDepartment.setColSorting("int,str,str,str,str,str");
        this.#gridDepartment.enableAutoWidth(true);
        this.#gridDepartment.enableMultiselect(true);
        this.#gridDepartment.enableBlockSelection();
        this.#gridDepartment.obj.className = "obj gridDepartment";
        this.#gridDepartment.entBox.id = "gridDepartment";
        this.#gridDepartment.init();


        this.#gridDepartment.attachEvent("onRowSelect", (id, ind) => {
            this.#loadGridApprover(id);
            this.#txtDepartmentIdForApprover.val(id);
        });

        this.#gridApprover = new dhtmlXGridObject('gridApprover');
        this.#gridApprover.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridApprover.setHeader("No,,Username,Name,Mail,,Document Type,Active,");
        this.#gridApprover.setInitWidths("50,0,100,150,*,0,100,60,70");
        this.#gridApprover.setColAlign("center,center,center,center,center,center,center,center,center");
        this.#gridApprover.setColTypes("ro,ro,ro,ro,ro,ro,ro,ch,ro");
        this.#gridApprover.setColSorting("int,str,str,str,str,str,str,str,str");
        this.#gridApprover.enableAutoWidth(true);
        this.#gridApprover.enableMultiselect(true);
        this.#gridApprover.enableBlockSelection();
        this.#gridApprover.obj.className = "obj gridApprover";
        this.#gridApprover.entBox.id = "gridApprover";
        this.#gridApprover.init();

        this.#gridDocumentType = new dhtmlXGridObject('gridDocumentType');
        this.#gridDocumentType.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridDocumentType.setHeader("No,Type Code,Type Name,Mail/Support,Active,");
        this.#gridDocumentType.setInitWidths("50,100,*,100,60,70");
        this.#gridDocumentType.setColAlign("center,center,center,center,center,center");
        this.#gridDocumentType.setColTypes("ro,ro,ro,ro,ch,ro");
        this.#gridDocumentType.setColSorting("int,str,str,str,str,str");
        this.#gridDocumentType.enableAutoWidth(true);
        this.#gridDocumentType.enableMultiselect(true);
        this.#gridDocumentType.enableBlockSelection();
        this.#gridDocumentType.obj.className = "obj gridDocumentType";
        this.#gridDocumentType.entBox.id = "gridDocumentType";
        this.#gridDocumentType.init();



    }


    async #loadGridDocumentType() {
        const clientDocumentType = new Client({
            method: HttpMethod.POST, query: { handler: 'DocumentType' }, content: {
                TypeCode: "*"
            }
        });

        let data = await clientDocumentType.sendRequest();
        if (data.ok) {
            data.json().then(e => {
                this.#gridDocumentType.clearAll();
                e.Result.forEach((r, i) => {
                    this.#gridDocumentType.addRow(r.DocumentTypeId, [i + 1, r.DocumentTypeCode, r.DocumentTypeName, r.TypeCode, r.IsActive, "<button  type='submit' data-documenttypeid='" + r.DocumentTypeId + "' name='btnEdit' class='btn btn-primary btn-sm'>Edit</button>"]);
                });


                Array.from($(".gridDocumentType").find('tr')).forEach(x => {
                    $(x).find('button[name="btnEdit"]').off('click').on('click', async b => {
                        console.log("XXXX")
                        Controls.toggleModal(this.#modalDocumentType, true);
                        let id = $(b.currentTarget).data('documenttypeid');
                        this.#txtDocumentTypeId.val(id);
                        this.#txtDocumentTypeCode.val(this.#gridDocumentType.cells(id, 1).getValue());
                        this.#txtDocumentTypeName.val(this.#gridDocumentType.cells(id, 2).getValue());
                        this.#ddlDocumentTypeCode.val(this.#gridDocumentType.cells(id, 3).getValue());
                        this.#cbIsActiveDocumentType.prop("checked", this.#gridDocumentType.cells(id, 4).getValue() == "1" ? true : false);
                        this.#btnUpdateDocumentType.html("Update Department");
                    });
                });

            });
        }
    }

    async #loadGridDepartment() {
        const client = new Client({
            method: HttpMethod.GET, query: { handler: 'Department' }
        });

        let data = await client.sendRequest();
        if (data.ok) {
            data.json().then(e => {
                this.#gridDepartment.clearAll();
                e.Result.forEach((r, i) => {
                    this.#gridDepartment.addRow(r.DepartmentId, [i + 1, r.DepartmentCode, r.DepartmentEN, r.DepartmentVN, r.IsActive, "<button  type='submit' data-departmentid='" + r.DepartmentId+ "' name='btnEdit' class='btn btn-primary btn-sm'>Edit</button>"]);
                });


                Array.from($(".gridDepartment").find('tr')).forEach(x => {
                    $(x).find('button[name="btnEdit"]').off('click').on('click', async b => {
                        Controls.toggleModal(this.#modalDepartment, true);
                        let id = $(b.currentTarget).data('departmentid');
                        this.#txtDepartmentIdForDepartment.val(id);
                        this.#txtDepartmentCode.val(this.#gridDepartment.cells(id, 1).getValue());
                        this.#txtDepartmentVN.val(this.#gridDepartment.cells(id, 2).getValue());
                        this.#txtDepartmentEN.val(this.#gridDepartment.cells(id, 3).getValue());
                        this.#cbIsActiveDepartment.prop("checked", this.#gridDepartment.cells(id, 4).getValue() == "1" ? true : false);
                        this.#btnUpdateDepartment.html("Update Department");
                    });
                });

            });
        }
    }

    async #loadGridApprover(departmentId) {
        const client = new Client({
            method: HttpMethod.POST, query: { handler: 'DepartmentApprover' }, content: {
                DepartmentId: departmentId
            }
        });

        let data = await client.sendRequest();
        if (data.ok) {
            data.json().then(e => {
                this.#gridApprover.clearAll();
                e.Result.forEach((r, i) => {
                    this.#gridApprover.addRow(r.DepartmentApproverId, [i + 1, r.UserId, r.UserName, r.FullName, r.Email, r.DocumentTypeId, r.DocumentTypeName || "All", r.IsActive, "<button  type='submit' data-departmentapproverid='" + r.DepartmentApproverId + "' name='btnEditApprover' class='btn btn-primary btn-sm'>Edit</button>"]);
                });


                Array.from($(".gridApprover").find('tr')).forEach(x => {
                    $(x).find('button[name="btnEditApprover"]').off('click').on('click', async b => {
                        Controls.toggleModal(this.#modalLoading, true);
                        Controls.toggleModal(this.#modalApprover, true);
                        let id = $(b.currentTarget).data('departmentapproverid');
                        this.#txtDepartmentApproverId.val(id);

                        await this.#loadDropDown(this.#gridApprover.cells(id, 1).getValue(), this.#gridApprover.cells(id, 5).getValue());

                        this.#cbIsActiveApprover.prop("checked", this.#gridApprover.cells(id, 7).getValue() == "1" ? true : false);
                        this.#btnUpdateApprover.html("Update Approver");
                        Controls.toggleModal(this.#modalLoading, false);
                    });
                });

            });
        }
    }
}

$(async () => {
    const main = new DepartmentManagement();
    main.initial();
})