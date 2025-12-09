/// <reference path="../../../assets/Custom/_reference.js" />

class ResourceManagement {
    #modalLoading;
    #modalResource;
    #modalResourceProcess;

    #btnOpenResource;
    #btnOpenResourceProcess;

    #btnUpdateResource;
    #btnUpdateResourceProcess;
    #btnDeleteResourceProcess;

    #txtResourceId;
    #txtResourceCode;
    #txtResourceName;
    #txtResourceDescription;
    #ddlUOM;
    #cbIsActiveResource;

    #ddlProduction;
    #ddlResource;
    #ddlProcess;
    #ddlResourceType;
    #txtResourceProcessId;
    #txtResourceProcessDescription;
    #ddlConvertType;
    #txtUPS;

    #gridResource;
    #gridResourceProcess;
    #gridResourceRate;

    #_processData;

    constructor() {
        this.#modalLoading = $('#modal-loading');

        this.#modalResource = $('#modal-resource');
        this.#modalResourceProcess = $('#modal-resourceprocess');

        this.#btnOpenResource = $('#btnOpenResource');
        this.#btnOpenResourceProcess = $('#btnOpenResourceProcess');


        this.#btnUpdateResource = $('#btnUpdateResource');;
        this.#btnUpdateResourceProcess = $('#btnUpdateResourceProcess');;
        this.#btnDeleteResourceProcess = $('#btnDeleteResourceProcess');;

        this.#btnDeleteResourceProcess = $('#btnDeleteResourceProcess');

        this.#txtResourceId = $('#txtResourceId');
        this.#txtResourceCode = $('#txtResourceCode');
        this.#txtResourceName = $('#txtResourceName');
        this.#txtResourceDescription = $('#txtResourceDescription');
        this.#ddlUOM = $('#ddlUOM');
        this.#cbIsActiveResource = $('#cbIsActiveResource');

        this.#ddlProduction = $('#ddlProduction');
        this.#ddlResource = $('#ddlResource');
        this.#ddlProcess = $('#ddlProcess');
        this.#ddlResourceType = $('#ddlResourceType');
        this.#txtResourceProcessId = $('#txtResourceProcessId');
        this.#txtResourceProcessDescription = $('#txtResourceProcessDescription');
        this.#ddlConvertType = $("#ddlConvertType");
        this.#txtUPS = $("#txtUPS");
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
        this.#loadGridResource();
        //this.#loadGridDocumentType();
        //this.#loadDropDown();
    }

    #registerEvents() {

        this.#btnOpenResource.off("click").on("click", async e => {
            Controls.toggleModal(this.#modalResource, true);
            this.#txtResourceId.val(-1);
            this.#txtResourceCode.val("");
            this.#txtResourceName.val("");
            this.#txtResourceDescription.val("");
            this.#ddlResourceType.val("");
            this.#ddlUOM.val("");
            this.#cbIsActiveResource.prop("checked", true);
            this.#btnUpdateResource.html("Add New Resource");
        });

        this.#ddlProduction.off("change").on("change", async e => {
            this.#ddlProcess.empty();
            this.#_processData.forEach(d => {
                console.log(d);
                if (d.ProductionId == this.#ddlProduction.val()) {
                    this.#ddlProcess.append("<option value='" + d.ProcessId + "' >" + d.ProcessCode + " - " + d.ProcessName + "</option>");
                }
                return true;
            })
        });

        this.#btnOpenResourceProcess.off("click").on("click", async e => {
            Controls.toggleModal(this.#modalResourceProcess, true);

            this.#txtResourceProcessId.val(-1);
            const client = new Client({
                method: HttpMethod.GET, query: { handler: 'LoadProcessCode' }, content: {
                    IsActive: -1,
                    ProductionId: -1
                }
            });



            let data = await client.sendRequest(true);
            if (data.OK) {
                this.#_processData = data.Result;
                let ProductionIDList = [];
                this.#ddlProduction.empty();
                this.#ddlProcess.empty();
                this.#_processData.forEach(d => {
                    if (ProductionIDList.indexOf(d.ProductionId) === -1) {
                        ProductionIDList.push(d.ProductionId);
                        this.#ddlProduction.append("<option value='" + d.ProductionId + "' " + (ProductionIDList.length == 0 ? "selected" : "") + " >" + d.ProductionName + "</option>");
                    }

                    if (d.ProductionId == this.#ddlProduction.val()) {
                        this.#ddlProcess.append("<option value='" + d.ProcessId + "' >" + d.ProcessCode + " - " + d.ProcessName + "</option>");
                    }
                })
            }

            let id = this.#gridResource.getSelectedRowId();
            this.#ddlResource.empty();
            this.#gridResource.forEachRow(uid => {
                this.#ddlResource.append("<option value='" + uid + "' " + (id == uid ? "selected" : "") + ">" + this.#gridResource.cells(uid, 1).getValue() + "</option>")
            });
        });


        this.#btnUpdateResource.off("click").on("click", async e => {

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UpdateResource' }, content: {
                    ResourceId: this.#txtResourceId.val(),
                    ResourceCode: this.#txtResourceCode.val(),
                    ResourceName: this.#txtResourceName.val(),
                    Description: this.#txtResourceDescription.val(),
                    ResourceType: this.#ddlResourceType.val(),
                    UOM: this.#ddlUOM.val(),
                    IsActive: Controls.isChecked(this.#cbIsActiveResource, true)
                }
            });

            let data = await client.sendRequest(true);
            if (data.OK) {
                Controls.sendMessage(data.Result);
                this.#loadGridResource();
            }
            else Controls.sendAlert(data.Exeception.Message);

            Controls.toggleModal(this.#modalResource, false);
        });


        this.#btnUpdateResourceProcess.off("click").on("click", async e => {

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UpdateResourceProcess' }, content: {
                    ResourceProcessId: this.#txtResourceProcessId.val(),
                    ProcessId: this.#ddlProcess.val(),
                    ResourceId: this.#ddlResource.val(),
                    Description: this.#txtResourceProcessDescription.val(),
                    UPS: this.#txtUPS.val(),
                    ConvertType: this.#ddlConvertType.val(),
                    IsActive: 1
                }
            });

            let data = await client.sendRequest(true);
            if (data.OK) {
                this.#loadGridResourceProcess(this.#ddlResource.val());
                Controls.sendMessage(data.Result);
            } else Controls.sendAlert(data.Exeception.Message);

            Controls.toggleModal(this.#modalResourceProcess, false);
        });

        this.#btnDeleteResourceProcess.off("click").on("click", async e => {

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UpdateResourceProcess' }, content: {
                    ResourceProcessId: this.#txtResourceProcessId.val(),
                    ProcessId: this.#ddlProcess.val(),
                    ResourceId: this.#ddlResource.val(),
                    Description: this.#txtResourceProcessDescription.val(),
                    ConvertType: this.#ddlConvertType.val(),
                    IsActive: 0
                }
            });

            let data = await client.sendRequest(true);
            if (data.OK) {
                this.#loadGridResourceProcess(this.#ddlProduction.val());
                Controls.sendMessage(data.Result);
            } else Controls.sendAlert(data.Exeception.Message);

            Controls.toggleModal(this.#modalResourceProcess, false);
        });


    }

    async #initGrid() {
        this.#gridResource = new dhtmlXGridObject('gridResource');
        this.#gridResource.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridResource.setHeader("No,Resource Code,Resource Name,Description,Resource Type,UOM,Active,");
        this.#gridResource.setInitWidths("40,120,150,,*,100,100,50,70");
        this.#gridResource.setColAlign("center,center,center,center,center,center,center,center");
        this.#gridResource.setColTypes("ro,ro,ro,ro,ro,ro,ch,ro");
        this.#gridResource.setColSorting("int,str,str,str,str,str,str,str");
        this.#gridResource.enableAutoWidth(true);
        this.#gridResource.enableMultiselect(true);
        this.#gridResource.enableBlockSelection();
        this.#gridResource.obj.className = "obj gridResource";
        this.#gridResource.entBox.id = "gridResource";
        this.#gridResource.init();


        this.#gridResource.attachEvent("onRowSelect", (id, ind) => {
            this.#loadGridResourceProcess(id);
            //this.#txtDepartmentIdForApprover.val(id);
        });

        this.#gridResourceProcess = new dhtmlXGridObject('gridResourceProcess');
        this.#gridResourceProcess.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridResourceProcess.setHeader("No,Process Code,Process Name,Description,Production,Convert Type,UPS,Active,");
        this.#gridResourceProcess.setInitWidths("50,100,150,*,100,100,100,60,70");
        this.#gridResourceProcess.setColAlign("center,center,center,center,center,center,center,center,center");
        this.#gridResourceProcess.setColTypes("ro,ro,ro,ro,ro,ro,ro,ch,ro");
        this.#gridResourceProcess.setColSorting("int,str,str,str,str,str,str,str,str");
        this.#gridResourceProcess.enableAutoWidth(true);
        this.#gridResourceProcess.enableMultiselect(true);
        this.#gridResourceProcess.enableBlockSelection();
        this.#gridResourceProcess.obj.className = "obj gridResourceProcess";
        this.#gridResourceProcess.entBox.id = "gridResourceProcess";
        this.#gridResourceProcess.init();



        this.#gridResourceRate = new dhtmlXGridObject('gridResourceRate');
        this.#gridResourceRate.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridResourceRate.setHeader("No,Date YM,UOM,Rate,Updated By,Updated Date");
        this.#gridResourceRate.setInitWidths("50,100,60,70,*,150");
        this.#gridResourceRate.setColAlign("center,center,center,center,center,center");
        this.#gridResourceRate.setColTypes("ro,ro,ro,ro,ro,ro");
        this.#gridResourceRate.setColSorting("int,str,str,str,str,str");
        this.#gridResourceRate.enableAutoWidth(true);
        this.#gridResourceRate.enableMultiselect(true);
        this.#gridResourceRate.enableBlockSelection();
        this.#gridResourceRate.obj.className = "obj gridResourceRate";
        this.#gridResourceRate.entBox.id = "gridResourceRate";
        this.#gridResourceRate.init();
    }


    async #loadGridResource() {
        const client = new Client({
            method: HttpMethod.GET, query: { handler: 'LoadResource' }, content: {
                IsActive: -1
            }
        });

        let data = await client.sendRequest(true);
        if (data.OK) {
            this.#gridResource.clearAll();
            let optGrid = {
                Id: "ResourceId",
                Increase: true,
                Header: ["ResourceCode", "ResourceName", "Description", "ResourceType", "UOM", "IsActive"],
                Button: [
                    { id: "btnEdit", name: "Edit" }
                ]
            };

            let rows = data.Result.convertTableGrid(optGrid);

            this.#gridResource.parse(rows, "json");

            Array.from($(".gridResource").find('tr')).forEach(x => {
                $(x).find('button[name="btnEdit"]').off('click').on('click', async b => {
                    Controls.toggleModal(this.#modalResource, true);
                    let id = Controls.getDataRowTable(b, optGrid.Id);

                    Controls.setValueCheckBox(this.#cbIsActiveResource, this.#gridResource.cells(id, 6).isChecked());

                    this.#txtResourceId.val(id);
                    this.#txtResourceCode.val(this.#gridResource.cells(id, 1).getValue());
                    this.#txtResourceName.val(this.#gridResource.cells(id, 2).getValue());
                    this.#txtResourceDescription.val(this.#gridResource.cells(id, 3).getValue());
                    this.#ddlResourceType.val(this.#gridResource.cells(id, 4).getValue());
                    this.#ddlUOM.val(this.#gridResource.cells(id, 5).getValue());
                    this.#cbIsActiveResource.prop("checked", true);
                    this.#btnUpdateResource.html("Update Resource");
                });
            });
        }
    }

    async #loadGridResourceProcess(id) {
        const client = new Client({
            method: HttpMethod.GET, query: { handler: 'LoadResourceProcess' }, content: {
                IsActive: 1,
                ResourceId: id
            }
        });

        let data = await client.sendRequest(true);
        if (data.OK) {

            let optGrid = {
                Id: "ResourceProcessId",
                Increase: true,
                Header: ["ProcessCode", "ProcessName", "Description", "ProductionName", "ConvertType", "UPS", "IsActive"],
                Button: [
                    { id: "btnEdit", name: "Edit" }
                ]
            };

            this.#gridResourceProcess.clearAll();
            let rows = data.Result.convertTableGrid(optGrid);
            console.log(rows);
            this.#gridResourceProcess.parse(rows, "json");

            Array.from($(".gridResourceProcess").find('tr')).forEach(x => {
                //$(x).find('button[name="btnEdit"]').off('click').on('click', async b => {

                //    Controls.toggleModal(this.#modalProcessCode, true);
                //    let id = Controls.getDataRowTable(b, optGrid.Id);
                //    this.#txtProcessId.val(id);
                //    this.#txtProcessCode.val(this.#gridProcessCode.cells(id, 1).getValue());
                //    this.#txtProcessName.val(this.#gridProcessCode.cells(id, 2).getValue());
                //    this.#txtProcessDescription.val(this.#gridProcessCode.cells(id, 3).getValue());

                //    Controls.setValueCheckBox(this.#cbIsActiveProcessCode, this.#gridProcessCode.cells(id, 4).isChecked());

                //    let idProduction = this.#gridResource.getSelectedRowId();
                //    this.#ddlProduction.empty();
                //    this.#gridResource.forEachRow(uid => {
                //        this.#ddlProduction.append("<option value='" + uid + "' " + (idProduction == uid ? "selected" : "") + ">" + this.#gridResource.cells(uid, 1).getValue() + "</option>")
                //    });

                //    this.#btnUpdateProcessCode.html("Update Process Code");
                //});
            });
        }
    }
}

$(async () => {
    const main = new ResourceManagement();
    main.initial();
})