/// <reference path="../../../assets/Custom/_reference.js" />


class ProcessManagement {
    #modalLoading;
    #modalProduction;
    #modalProcessCode;
    #modalResourceProcess;

    #btnOpenProduction;
    #btnOpenProcessCode;
    #btnOpenMapProcessResource;

    #btnUpdateProduction;
    #btnUpdateProcessCode;

    #txtProductionId;
    #txtProductionName;
    #txtProductionDescription;
    #cbIsActiveProduction;

    #ddlProduction;
    #ddlProcessConvert;
    #txtProcessId;
    #txtProcessCode;
    #txtProcessName;
    #txtProcessDescription;
    #cbIsActiveProcessCode;
    #cbProcessGroup;

    #gridProduction;
    #gridProcessCode;
    #gridResourceProcess;

    #ddlResource;
    #ddlProductionResource;
    #ddlProcess;
    #txtResourceProcessDescription;
    #txtUPS;
    #ddlConvertType;
    #txtResourceProcessId;
    #btnUpdateResourceProcess;
    #btnDeleteResourceProcess;
    #_processData;

    constructor() {
        this.#modalLoading = $('#modal-loading');

        this.#modalProduction = $('#modal-production');
        this.#modalProcessCode = $('#modal-processcode');
        this.#modalResourceProcess = $('#modal-resourceprocess');

        this.#btnOpenProduction = $('#btnOpenProduction');
        this.#btnOpenProcessCode = $('#btnOpenProcessCode');
        this.#btnOpenMapProcessResource = $('#btnOpenMapProcessResource');

        this.#btnUpdateProduction = $('#btnUpdateProduction');
        this.#btnUpdateProcessCode = $('#btnUpdateProcessCode');

        this.#txtProductionId = $('#txtProductionId');
        this.#txtProductionName = $('#txtProductionName');
        this.#txtProductionDescription = $('#txtProductionDescription');
        this.#cbIsActiveProduction = $('#cbIsActiveProduction');

        this.#ddlProduction = $('#ddlProduction');
        this.#ddlProcessConvert = $('#ddlProcessConvert');
        this.#txtProcessId = $('#txtProcessId');
        this.#txtProcessCode = $('#txtProcessCode');
        this.#txtProcessName = $('#txtProcessName');
        this.#txtProcessDescription = $('#txtProcessDescription');
        this.#cbIsActiveProcessCode = $('#cbIsActiveProcessCode');
        this.#cbProcessGroup = $('#cbProcessGroup');



        this.#ddlResource = $('#ddlResource');
        this.#ddlProductionResource = $('#ddlProductionResource');
        this.#ddlProcess = $('#ddlProcess');
        this.#txtResourceProcessDescription = $('#txtResourceProcessDescription');
        this.#txtUPS = $('#txtUPS');
        this.#ddlConvertType = $('#ddlConvertType');
        this.#txtResourceProcessId = $('#txtResourceProcessId');
        this.#btnUpdateResourceProcess = $('#btnUpdateResourceProcess');
        this.#btnDeleteResourceProcess = $('#btnDeleteResourceProcess');

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
        this.#loadGridProduction();
        //this.#loadGridDocumentType();
        //this.#loadDropDown();
    }

    #registerEvents() {


        this.#ddlProductionResource.off("change").on("change", async e => {
            this.#ddlProcess.empty();
            this.#_processData.forEach(d => {
                console.log(d);
                if (d.ProductionId == this.#ddlProductionResource.val()) {
                    this.#ddlProcess.append("<option value='" + d.ProcessId + "' >" + d.ProcessCode + " - " + d.ProcessName + "</option>");
                }
                return true;
            })
        });

        this.#btnOpenProduction.off("click").on("click", async e => {
            Controls.toggleModal(this.#modalProduction, true);
            this.#txtProductionId.val(-1);
            this.#txtProductionName.val("");
            this.#txtProductionDescription.val("");
            this.#cbIsActiveProduction.prop("checked", true);
            this.#btnUpdateProduction.html("Add New Production");
        });

        this.#btnOpenMapProcessResource.off("click").on("click", async e => {
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
                this.#ddlProductionResource.empty();
                this.#ddlProcess.empty();
                this.#_processData.forEach(d => {
                    if (ProductionIDList.indexOf(d.ProductionId) === -1) {
                        ProductionIDList.push(d.ProductionId);
                        this.#ddlProductionResource.append("<option value='" + d.ProductionId + "' " + (ProductionIDList.length == 0 ? "selected" : "") + " >" + d.ProductionName + "</option>");
                    }

                    if (d.ProductionId == this.#ddlProductionResource.val()) {
                        this.#ddlProcess.append("<option value='" + d.ProcessId + "' >" + d.ProcessCode + " - " + d.ProcessName + "</option>");
                    }
                })
            }

            const clientResource = new Client({
                method: HttpMethod.GET, query: { handler: 'LoadResource' }, content: {
                    IsActive: -1
                }
            });

            data = await clientResource.sendRequest(true);
            if (data.OK) {
                this.#ddlResource.empty();
                data.Result.forEach(e => {
                    this.#ddlResource.append("<option value='" + e.ResourceId + "'>" + e.ResourceName + "</option>")
                });
            }
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
                this.#loadGridResourceProcess(this.#gridProcessCode.getSelectedRowId());
                Controls.sendMessage(data.Result);
            } else Controls.sendAlert(data.Exeception.Message);

            Controls.toggleModal(this.#modalResourceProcess, false);
        });


        this.#btnUpdateProduction.off("click").on("click", async e => {

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UpdateProduction' }, content: {
                    ProductionId: this.#txtProductionId.val(),
                    ProductionName: this.#txtProductionName.val(),
                    Description: this.#txtProductionDescription.val(),
                    IsActive: Controls.isChecked(this.#cbIsActiveProduction, true)
                }
            });

            let data = await client.sendRequest(true);
            if (data.OK) {
                Controls.sendMessage(data.Result);
                this.#loadGridProduction();
            }
            else Controls.sendAlert(data.Exeception.Message);

            Controls.toggleModal(this.#modalProduction, false);
        });



        this.#btnOpenProcessCode.off("click").on("click", async e => {
            Controls.toggleModal(this.#modalProcessCode, true);

            let id = this.#gridProduction.getSelectedRowId();
            this.#ddlProduction.empty();
            console.log(id);
            this.#gridProduction.forEachRow(uid => {
                this.#ddlProduction.append("<option value='" + uid + "' " + (id == uid ? "selected" : "") +">" + this.#gridProduction.cells(uid,1).getValue() + "</option>")
            });
            

            this.#txtProcessId.val(-1);
            this.#txtProcessCode.val("");
            this.#txtProcessName.val("");
            this.#txtProcessDescription.val("");
            this.#cbIsActiveProcessCode.prop("checked", true);
            this.#cbProcessGroup.prop("checked", false);
            this.#btnUpdateProcessCode.html("Add New Process Code");
        });


        this.#btnUpdateProcessCode.off("click").on("click", async e => {

            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UpdateProcessCode' }, content: {
                    ProcessId: this.#txtProcessId.val(),
                    ProcessCode: this.#txtProcessCode.val(),
                    ProcessName: this.#txtProcessName.val(),
                    ProcessConvert: this.#ddlProcessConvert.val(),
                    Description: this.#txtProcessDescription.val(),
                    ProductionId: this.#ddlProduction.val(),
                    IsActive: Controls.isChecked(this.#cbIsActiveProcessCode, true),
                    ProcessGroup: Controls.isChecked(this.#cbProcessGroup, true)
                }
            });

            let data = await client.sendRequest(true);
            if (data.OK) {
                this.#loadGridProcessCode(this.#ddlProduction.val());
                Controls.sendMessage(data.Result);
            } else Controls.sendAlert(data.Exeception.Message);

            Controls.toggleModal(this.#modalProcessCode, false);
        
        });


        //this.#cbProcessGroup.off("click").on("click", async e => {
        //    if (Controls.isChecked(this.#cbProcessGroup, true) == 1) {
        //        this.#ddlProcessConvert.val("_");
        //    }
        //});

    }

    async #initGrid() {
        this.#gridProduction = new dhtmlXGridObject('gridProduction');
        this.#gridProduction.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridProduction.setHeader("No,Production Name,Description,Active,");
        this.#gridProduction.setInitWidths("40,120,*,50,70");
        this.#gridProduction.setColAlign("center,center,center,center,center");
        this.#gridProduction.setColTypes("ro,ro,ro,ch,ro");
        this.#gridProduction.setColSorting("int,str,str,str,str");
        this.#gridProduction.enableAutoWidth(true);
        this.#gridProduction.enableMultiselect(true);
        this.#gridProduction.enableBlockSelection();
        this.#gridProduction.obj.className = "obj gridProduction";
        this.#gridProduction.entBox.id = "gridProduction";
        this.#gridProduction.init();


        this.#gridProduction.attachEvent("onRowSelect", async (id, ind) => {
            this.#loadGridProcessCode(id);
            
            //this.#txtDepartmentIdForApprover.val(id);
        });

        this.#gridProcessCode = new dhtmlXGridObject('gridProcessCode');
        this.#gridProcessCode.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridProcessCode.setHeader("No,Process Code,Process Name,Process Convert,Description,Group,Active,");
        this.#gridProcessCode.setInitWidths("50,100,150,100,,*,60,60,70");
        this.#gridProcessCode.setColAlign("center,center,center,center,center,center,center,center");
        this.#gridProcessCode.setColTypes("ro,ro,ro,ro,ro,ch,ch,ro");
        this.#gridProcessCode.setColSorting("int,str,str,str,str,str,str,str");
        this.#gridProcessCode.enableAutoWidth(true);
        this.#gridProcessCode.enableMultiselect(true);
        this.#gridProcessCode.enableBlockSelection();
        this.#gridProcessCode.obj.className = "obj gridProcessCode";
        this.#gridProcessCode.entBox.id = "gridProcessCode";
        this.#gridProcessCode.init();




        this.#gridProcessCode.attachEvent("onRowSelect", async (id, ind) => {
            this.#loadGridResourceProcess(id);
        });


        this.#gridResourceProcess = new dhtmlXGridObject('gridResourceProcess');
        this.#gridResourceProcess.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridResourceProcess.setHeader("No,Resource Code,Resource Name, Resource Description,Convert Type,UPS,Active,");
        this.#gridResourceProcess.setInitWidths("50,100,150,*,100,100,60,70");
        this.#gridResourceProcess.setColAlign("center,center,center,center,center,center,center,center");
        this.#gridResourceProcess.setColTypes("ro,ro,ro,ro,ro,ro,ch,ro");
        this.#gridResourceProcess.setColSorting("int,str,str,str,str,str,str,str");
        this.#gridResourceProcess.enableAutoWidth(true);
        this.#gridResourceProcess.enableMultiselect(true);
        this.#gridResourceProcess.enableBlockSelection();
        this.#gridResourceProcess.obj.className = "obj gridResourceProcess";
        this.#gridResourceProcess.entBox.id = "gridResourceProcess";
        this.#gridResourceProcess.init();
    }


    async #loadGridResourceProcess(id) {
        const client = new Client({
            method: HttpMethod.GET, query: { handler: 'LoadResourceProcess' }, content: {
                IsActive: 1,
                ProcessId: id
            }
        });

        let data = await client.sendRequest(true);
        if (data.OK) {

            let optGrid = {
                Id: "ResourceProcessId",
                Increase: true,
                Header: ["ResourceCode", "ResourceName", "Description", "ConvertType", "UPS", "IsActive"],
                Button: [
                    { id: "btnEdit", name: "Edit" }
                ]
            };

            this.#gridResourceProcess.clearAll();
            let rows = data.Result.convertTableGrid(optGrid);
            console.log(rows);
            this.#gridResourceProcess.parse(rows, "json");

            Array.from($(".gridResourceProcess").find('tr')).forEach(x => {
                $(x).find('button[name="btnEdit"]').off('click').on('click', async b => {

                    Controls.toggleModal(this.#modalResourceProcess, true);
                    let id = Controls.getDataRowTable(b, optGrid.Id);
                    this.#txtResourceProcessId.val(id);
                    this.#txtResourceProcessDescription.val(this.#gridResourceProcess.cells(id, 3).getValue());
                    this.#ddlConvertType.val(this.#gridResourceProcess.cells(id, 4).getValue());
                    this.#txtUPS.val(this.#gridResourceProcess.cells(id, 5).getValue());


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
                        this.#ddlProductionResource.empty();
                        this.#ddlProcess.empty();
                        this.#_processData.forEach(d => {
                            if (ProductionIDList.indexOf(d.ProductionId) === -1) {
                                ProductionIDList.push(d.ProductionId);
                                this.#ddlProductionResource.append("<option value='" + d.ProductionId + "' " + (d.ProductionId == this.#gridProduction.getSelectedRowId() ? "selected" : "") + " >" + d.ProductionName + "</option>");
                            }

                            if (d.ProductionId == this.#ddlProductionResource.val()) {
                                this.#ddlProcess.append("<option value='" + d.ProcessId + "' " + (d.ProcessId == this.#gridProcessCode.getSelectedRowId() ? "selected" : "") + ">" + d.ProcessCode + " - " + d.ProcessName + "</option>");
                            }
                        })
                    }

                    const clientResource = new Client({
                        method: HttpMethod.GET, query: { handler: 'LoadResource' }, content: {
                            IsActive: -1
                        }
                    });

                    data = await clientResource.sendRequest(true);
                    if (data.OK) {
                        this.#ddlResource.empty();
                        data.Result.forEach(e => {
                            this.#ddlResource.append("<option value='" + e.ResourceId + "' " + (e.ResourceName == this.#gridResourceProcess.cells(id, 1).getValue() ? "selected" : "") + ">" + e.ResourceName + "</option>")
                        });
                    }

                    this.#btnUpdateProcessCode.html("Update Process Code");
                });
            });
        }
    }

    async #loadGridProduction() {
        const client = new Client({
            method: HttpMethod.GET, query: { handler: 'LoadProduction' }, content: {
                IsActive: -1
            }
        });

        let data = await client.sendRequest(true);
        if (data.OK) {
            this.#gridProduction.clearAll();
            let optGrid = {
                Id: "ProductionId",
                Increase: true,
                Header: ["ProductionName", "Description", "IsActive"],
                Button: [
                    { id: "btnEdit", name: "Edit" }
                ]
            };

            let rows = data.Result.convertTableGrid(optGrid);

            this.#gridProduction.parse(rows, "json");

            Array.from($(".gridProduction").find('tr')).forEach(x => {
                $(x).find('button[name="btnEdit"]').off('click').on('click', async b => {
                    Controls.toggleModal(this.#modalProduction, true);
                    let id = Controls.getDataRowTable(b, optGrid.Id);

                    Controls.setValueCheckBox(this.#cbIsActiveProduction, this.#gridProduction.cells(id, 3).isChecked());

                    this.#txtProductionId.val(id);
                    this.#txtProductionName.val(this.#gridProduction.cells(id, 1).getValue());
                    this.#txtProductionDescription.val(this.#gridProduction.cells(id, 2).getValue().decodeHTML());
                    this.#btnUpdateProduction.html("Update Production");
                });
            });
        }
    }

    async #loadGridProcessCode(id) {
        const client = new Client({
            method: HttpMethod.GET, query: { handler: 'LoadProcessCode' }, content: {
                IsActive: -1,
                ProductionId: id,
                ProcessGroup: -1
            }
        });

        let data = await client.sendRequest(true);
        if (data.OK) {

            this.#ddlProcessConvert.empty();
            this.#ddlProcessConvert.append("<option value=''>_</option>");
            data.Result.forEach(e => {
                if(e.ProcessGroup == 1) this.#ddlProcessConvert.append("<option value='" + e.ProcessCode + "'>" + e.ProcessCode + " - " + e.ProcessName + "</option>");
            });


            let optGrid = {
                Id: "ProcessId",
                Increase: true,
                Header: ["ProcessCode", "ProcessName", "ProcessConvert", "Description", "ProcessGroup", "IsActive"],
                Button: [
                    { id: "btnEdit", name: "Edit" }
                ]
            };

            this.#gridProcessCode.clearAll();
            let rows = data.Result.convertTableGrid(optGrid);
            console.log(rows);
            this.#gridProcessCode.parse(rows, "json");

            Array.from($(".gridProcessCode").find('tr')).forEach(x => {
                $(x).find('button[name="btnEdit"]').off('click').on('click', async b => {

                    Controls.toggleModal(this.#modalProcessCode, true);
                    let id = Controls.getDataRowTable(b, optGrid.Id);
                    this.#txtProcessId.val(id);
                    this.#txtProcessCode.val(this.#gridProcessCode.cells(id, 1).getValue());
                    this.#txtProcessName.val(this.#gridProcessCode.cells(id, 2).getValue());
                    this.#txtProcessDescription.val(this.#gridProcessCode.cells(id, 4).getValue());

                    Controls.setValueCheckBox(this.#cbProcessGroup, this.#gridProcessCode.cells(id, 5).isChecked());
                    Controls.setValueCheckBox(this.#cbIsActiveProcessCode, this.#gridProcessCode.cells(id, 4).isChecked());

                    let idProduction = this.#gridProduction.getSelectedRowId();
                    this.#ddlProduction.empty();
                    this.#gridProduction.forEachRow(uid => {
                        this.#ddlProduction.append("<option value='" + uid + "' " + (idProduction == uid ? "selected" : "") + ">" + this.#gridProduction.cells(uid, 1).getValue() + "</option>")
                    });

                    this.#btnUpdateProcessCode.html("Update Process Code");
                });
            });
        }
    }

    //async #loadGridDepartment() {
    //    const client = new Client({
    //        method: HttpMethod.GET, query: { handler: 'Department' }
    //    });

    //    let data = await client.sendRequest();
    //    if (data.ok) {
    //        data.json().then(e => {
    //            this.#gridDepartment.clearAll();
    //            e.Result.forEach((r, i) => {
    //                this.#gridDepartment.addRow(r.DepartmentId, [i + 1, r.DepartmentCode, r.DepartmentEN, r.DepartmentVN, r.IsActive, "<button  type='submit' data-departmentid='" + r.DepartmentId+ "' name='btnEdit' class='btn btn-primary btn-sm'>Edit</button>"]);
    //            });


    //            Array.from($(".gridDepartment").find('tr')).forEach(x => {
    //                $(x).find('button[name="btnEdit"]').off('click').on('click', async b => {
    //                    Controls.toggleModal(this.#modalDepartment, true);
    //                    let id = $(b.currentTarget).data('departmentid');
    //                    this.#txtDepartmentIdForDepartment.val(id);
    //                    this.#txtDepartmentCode.val(this.#gridDepartment.cells(id, 1).getValue());
    //                    this.#txtDepartmentVN.val(this.#gridDepartment.cells(id, 2).getValue());
    //                    this.#txtDepartmentEN.val(this.#gridDepartment.cells(id, 3).getValue());
    //                    this.#cbIsActiveDepartment.prop("checked", this.#gridDepartment.cells(id, 4).getValue() == "1" ? true : false);
    //                    this.#btnUpdateDepartment.html("Update Department");
    //                });
    //            });

    //        });
    //    }
    //}

    //async #loadGridApprover(departmentId) {
    //    const client = new Client({
    //        method: HttpMethod.POST, query: { handler: 'DepartmentApprover' }, content: {
    //            DepartmentId: departmentId
    //        }
    //    });

    //    let data = await client.sendRequest();
    //    if (data.ok) {
    //        data.json().then(e => {
    //            this.#gridApprover.clearAll();
    //            e.Result.forEach((r, i) => {
    //                this.#gridApprover.addRow(r.DepartmentApproverId, [i + 1, r.UserId, r.UserName, r.FullName, r.Email, r.DocumentTypeId, r.DocumentTypeName || "All", r.IsActive, "<button  type='submit' data-departmentapproverid='" + r.DepartmentApproverId + "' name='btnEditApprover' class='btn btn-primary btn-sm'>Edit</button>"]);
    //            });


    //            Array.from($(".gridApprover").find('tr')).forEach(x => {
    //                $(x).find('button[name="btnEditApprover"]').off('click').on('click', async b => {
    //                    Controls.toggleModal(this.#modalLoading, true);
    //                    Controls.toggleModal(this.#modalApprover, true);
    //                    let id = $(b.currentTarget).data('departmentapproverid');
    //                    this.#txtDepartmentApproverId.val(id);

    //                    await this.#loadDropDown(this.#gridApprover.cells(id, 1).getValue(), this.#gridApprover.cells(id, 5).getValue());

    //                    this.#cbIsActiveApprover.prop("checked", this.#gridApprover.cells(id, 7).getValue() == "1" ? true : false);
    //                    this.#btnUpdateApprover.html("Update Approver");
    //                    Controls.toggleModal(this.#modalLoading, false);
    //                });
    //            });

    //        });
    //    }
    //}
}

$(async () => {
    const main = new ProcessManagement();
    main.initial();
})