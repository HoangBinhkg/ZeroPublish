/// <reference path="../../../Zero/assets/Custom/_reference.js" />

class Material {
    //Modal
    #modalLoading;
    #modalMaterialDetail;
    //Textbox
    #txtMaterialCode;
    #txtDescription;

    #txtMaterialId_Detail;
    #txtMaterialCode_Detail;
    #txtDescription_Detail;
    #txtExchange_Detail;


    //button
    #btnSearch;
    #btnAddNew;
    #btnClear;

    #btnAddNew_Detail;
    #btnUpdate_Detail;
    #btnClear_Detail;

    //checkbox
    #cbIsActive_Detail;

    //dhx
    #gridMain;

    //select
    #ddlInspectionType;
    #ddlInspectionType_Detail;
    #ddlUnit_Detail;
    #ddlUnitExchange_Detail;

    constructor() {

        //Modal
        this.#modalLoading = $('#modal-loading');
        this.#modalMaterialDetail = $('#modalMaterialDetail');

        //Textbox
        this.#txtMaterialCode = $('#txtMaterialCode');
        this.#txtDescription = $('#txtDescription');


        this.#txtMaterialId_Detail = $('#txtMaterialId_Detail');
        this.#txtMaterialCode_Detail = $('#txtMaterialCode_Detail');
        this.#txtDescription_Detail = $('#txtDescription_Detail');
        this.#txtExchange_Detail = $('#txtExchange_Detail');

        //Button
        this.#btnAddNew = $('#btnAddNew');
        this.#btnSearch = $('#btnSearch');
        this.#btnClear = $('#btnClear');

        this.#btnAddNew_Detail = $('#btnAddNew_Detail');
        this.#btnUpdate_Detail = $('#btnUpdate_Detail');
        this.#btnClear_Detail = $('#btnClear_Detail');

        //Checkbox
        this.#cbIsActive_Detail = $('#cbIsActive_Detail');

        //select
        this.#ddlInspectionType = $('#ddlInspectionType');
        this.#ddlInspectionType_Detail = $('#ddlInspectionType_Detail');
        this.#ddlUnit_Detail = $('#ddlUnit_Detail');
        this.#ddlUnitExchange_Detail = $('#ddlUnitExchange_Detail');
    }

    initial() {
        this.#initJavascript();
        this.#initGrid();
        this.#initButton();
        this.#initDropDownList();
    }

    #initJavascript() {
      
    }

    async #initGrid() {
        Controls.toggleModal(this.#modalLoading, true);
        //Controls.toggleModal(this.#modalLoadingA, true);

        this.#gridMain = new dhtmlXGridObject('gridbox');
        this.#gridMain.setImagePath("/Zero/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridMain.setHeader("No,Material Code, Description, Unit, Unit Exchange, Exchange, Inspection Type Name, Updated Date, Updated By,Active,");
        this.#gridMain.setInitWidths("50,200,*,100,100,100,100,150,100,50,100");
        this.#gridMain.setColumnMinWidth("50,200,200,100,100,100,100,200,100,50,100");

        this.#gridMain.setColAlign("center,center,center,center,center,center,center,center,center,center,center");
        this.#gridMain.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ch,ro");
        this.#gridMain.setColSorting("int,str,str,str,str,str,str,str,str,str,str");
        this.#gridMain.enableAutoWidth(true);
        this.#gridMain.enableMultiselect(false);
        this.#gridMain.enableBlockSelection();
        this.#gridMain.obj.className = "obj gridMain";
        this.#gridMain.entBox.id = "GridMain";
        this.#gridMain.init();
        this.#loadGrid();
        Controls.toggleModal(this.#modalLoading, false);
    }

    async #loadGrid() {

        const model = {
            MaterialCode: this.#txtMaterialCode.val(),
            Description: this.#txtDescription.val(),
            Unit: "",
            UnitExchange: "",
            InspectionTypeCode: this.#ddlInspectionType.val() ?? ""
        }
        const client = new Client(
            {
                method: HttpMethod.GET,
                query: {
                    handler: 'ListMaterial'
                },
                content: model
            }
        );
        let data = await client.sendRequest();
        data.json().then(e => {
            if (e.isSuccess) {
                this.#gridMain.clearAll();
                e.items.forEach((r, index) => {
                    this.#gridMain.addRow(r.materialId, [
                        index + 1,
                        r.materialCode,
                        r.description,
                        r.unit,
                        r.unitExchange,
                        r.exchange,
                        r.inspectionTypeName,
                        r.updatedDate,
                        r.updatedBy,
                        r.isActive,
                        "<button name='ViewMaterialDetail' class='btn btn-primary btn-sm' data-materialId='" + r.materialId + "\'>View Detail</button>"
                    ])
                });

                Array.from($("#GridMain").find('tr')).forEach(x => {
                    $(x).find('button[name="ViewMaterialDetail"]').off('click').on('click', async b => {
                        let id = $(b.currentTarget).data('materialid');
                        let materialCode = this.#gridMain.cells(id, 1).getValue();
                        let description = this.#gridMain.cells(id, 2).getValue();
                        let unit = this.#gridMain.cells(id, 3).getValue();
                        let unitExchange = this.#gridMain.cells(id, 4).getValue();
                        let exchange = this.#gridMain.cells(id, 5).getValue();
                        let inspectionType = this.#gridMain.cells(id, 6).getValue();
                        let isActive = this.#gridMain.cells(id, 9).getValue();

                        this.#txtMaterialId_Detail.val(id);
                        this.#txtMaterialCode_Detail.val(materialCode);
                        this.#txtDescription_Detail.val(description);
                        this.#txtExchange_Detail.val(exchange);
                        Controls.setValueSingleDropDownList(this.#ddlInspectionType_Detail, inspectionType);
                        Controls.setValueSingleDropDownList(this.#ddlUnit_Detail, unit);
                        Controls.setValueSingleDropDownList(this.#ddlUnitExchange_Detail, unitExchange);

                        Controls.setControlStatus(this.#txtMaterialId_Detail, ControlStatus.ReadOnly, true);
                        Controls.setControlStatus(this.#txtMaterialCode_Detail, ControlStatus.ReadOnly, true);
                        Controls.setControlStatus(this.#cbIsActive_Detail, ControlStatus.Checked, isActive == 0 ? false : true);

                        this.#btnAddNew_Detail.hide();
                        this.#btnUpdate_Detail.show();
                        //Controls.setControlStatus(this.#txtUsername_Detail, ControlStatus.ReadOnly, true);
                        Controls.toggleModal(this.#modalMaterialDetail, true);
                    });
                });
            }
        });
    }

    #initButton() {
        this.#btnClear_Detail.off('click').on('click', e => {
            this.#txtDescription_Detail.val("");
            this.#txtExchange_Detail.val("");
        });

        this.#btnSearch.off('click').on('click', e => {
            Controls.toggleModal(this.#modalLoading, true);
            this.#loadGrid();
            Controls.toggleModal(this.#modalLoading, false);
        });

        this.#btnClear.off('click').on('click', e => {
            this.#txtMaterialCode.val("");
            this.#txtDescription.val("");
        });

        this.#btnAddNew.off('click').on('click', e => {
            this.#txtMaterialId_Detail.val("Add New");
            this.#txtMaterialCode_Detail.val("");
            this.#txtDescription_Detail.val("");
            this.#txtExchange_Detail.val(0);

            Controls.setControlStatus(this.#txtMaterialId_Detail, ControlStatus.ReadOnly, true);
            Controls.setControlStatus(this.#txtMaterialCode_Detail, ControlStatus.ReadOnly, false);
            Controls.setControlStatus(this.#cbIsActive_Detail, ControlStatus.Checked, true);

            this.#btnAddNew_Detail.show();
            this.#btnUpdate_Detail.hide();
            Controls.toggleModal(this.#modalMaterialDetail, true);
        });


        this.#btnAddNew_Detail.off('click').on('click', e => {
            this.#updateMaterial("Add New");
        });

        this.#btnUpdate_Detail.off('click').on('click', e => {
            this.#updateMaterial("Update");
        });
    }

    async #updateMaterial(action) {
        const client = new Client(
            {
                method: HttpMethod.POST,
                query: {
                    handler: 'Update'
                },
                content: {
                    MaterialId: action == "Add New" ? 0 : this.#txtMaterialId_Detail.val(),
                    MaterialCode: this.#txtMaterialCode_Detail.val(),
                    Description: this.#txtDescription_Detail.val(),
                    Unit: this.#ddlUnit_Detail.val(),
                    UnitExchange: this.#ddlUnitExchange_Detail.val(),
                    Exchange: this.#txtExchange_Detail.val(),
                    InspectionTypeCode: this.#ddlInspectionType_Detail.val(),
                    IsActive: Controls.isChecked(this.#cbIsActive_Detail)
                }
            }
        );
        let data = await client.sendRequest();
        data.json().then(e => {
            if (e.isSuccess) {
                this.#loadGrid();
                Controls.toggleModal(this.#modalMaterialDetail, false);
            }
        });
    }

    async #initDropDownList() {
        const client = new Client(
            {
                method: HttpMethod.GET,
                query: {
                    handler: 'ListInspectionType'
                },
                content: {}
            }
        );
        let data = await client.sendRequest();
        data.json().then(e => {
            if (e.isSuccess) {
                this.#ddlInspectionType.empty();
                this.#ddlInspectionType_Detail.empty();
                this.#ddlInspectionType.append(new Option("All", ""));
                e.items.forEach((v, i) => {
                    this.#ddlInspectionType.append(new Option(v.inspectionTypeName, v.inspectionTypeCode));
                    this.#ddlInspectionType_Detail.append(new Option(v.inspectionTypeName, v.inspectionTypeCode));
                });

                this.#ddlInspectionType.select2();
                this.#ddlInspectionType_Detail.select2();
            }
        });

        const clientUnit = new Client(
            {
                method: HttpMethod.GET,
                query: {
                    handler: 'ListUnit'
                },
                content: {
                    GroupType : "Unit"
                }
            }
        );
        let dataUnit = await clientUnit.sendRequest();
        dataUnit.json().then(e => {
            if (e.isSuccess) {
                this.#ddlUnit_Detail.empty();
                this.#ddlUnitExchange_Detail.empty();
                e.items.forEach((v, i) => {
                    this.#ddlUnit_Detail.append(new Option(v.valueString, v.valueString));
                    this.#ddlUnitExchange_Detail.append(new Option(v.valueString, v.valueString));
                });

                this.#ddlUnit_Detail.select2();
                this.#ddlUnitExchange_Detail.select2();
            }
        });
    }

}

$(async () => {
    const main = new Material();
    main.initial();
})