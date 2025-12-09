/// <reference path="../../../Zero/assets/Custom/_reference.js" />

class Inspection {
    //alias
    loadGridSub;

    //Modal
    #modalLoading;
    #modalInspectTypeDetail;
    #modalInspectDetail;
    //Textbox



    //button
    #btnSearch;
    #btnClear;

    //checkbox

    //dhx
    #gridMain;
    #gridSub;

    //select

    constructor() {

        //Modal
        this.#modalLoading = $('#modal-loading');
        this.#modalInspectTypeDetail = $('#modalInspectTypeDetail');
        this.#modalInspectDetail = $('#modalInspectDetail');

        //Textbox


        //Button
        this.#btnSearch = $('#btnSearch');
        this.#btnClear = $('#btnClear');

        //Checkbox

        //select



        this.loadGridSub = this.#loadGridSub.bind(this); // bind giữ đúng this
    }

    initial() {
        this.#initJavascript();
        this.#initGrid();
        this.#initButton();
    }

    #initJavascript() {
      
    }

    async #initGrid() {
        Controls.toggleModal(this.#modalLoading, true);
        //Controls.toggleModal(this.#modalLoadingA, true);

        this.#gridMain = new dhtmlXGridObject('gridboxMain');
        this.#gridMain.setImagePath("/Zero/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridMain.setHeader("No,Inspection Type Code, Inspection Type Name, Mail, Updated Date, Updated By, Active,");
        this.#gridMain.setInitWidths("50,100,100,*,150,100,50,100");
        this.#gridMain.setColumnMinWidth("50,100,100,100,100,100,50,100");

        this.#gridMain.setColAlign("center,center,center,center,center,center,center,center");
        this.#gridMain.setColTypes("ro,ro,ro,ro,ro,ro,ch,ro");
        this.#gridMain.setColSorting("int,str,str,str,str,str,str,str");
        this.#gridMain.enableAutoWidth(true);
        this.#gridMain.enableMultiselect(false);
        this.#gridMain.enableBlockSelection();
        this.#gridMain.obj.className = "obj gridMain";
        this.#gridMain.entBox.id = "GridMain";
        this.#gridMain.init();

        this.#gridMain.attachEvent("onRowSelect", function (id, ind) {
            let inspectionTypeCode = this.cells(id, 1).getValue();
            window.loadGridSub(inspectionTypeCode);
            //this.#loadGridSub(inspectionTypeCode);
        });


        this.#gridSub = new dhtmlXGridObject('gridboxSub');
        this.#gridSub.setImagePath("/Zero/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridSub.setHeader("No,Inspection,Type Value, Updated Date, Updated By, Active,");
        this.#gridSub.setInitWidths("50,100,100,*,150,50,100");
        this.#gridSub.setColumnMinWidth("50,100,100,150,150,50,100");

        this.#gridSub.setColAlign("center,center,center,center,center,center,center");
        this.#gridSub.setColTypes("ro,ro,ro,ro,ro,ch,ro");
        this.#gridSub.setColSorting("int,str,str,str,str,str,str");
        this.#gridSub.enableAutoWidth(true);
        this.#gridSub.enableMultiselect(false);
        this.#gridSub.enableBlockSelection();
        this.#gridSub.obj.className = "obj gridMain";
        this.#gridSub.entBox.id = "GridSub";
        this.#gridSub.init();
        this.#loadGridMain();


        //const model = {
        //    ItemCode: "",
        //    PO: "",
        //    OrderNo: ""
        //}
        //const client = new Client(
        //    {
        //        method: HttpMethod.POST,
        //        query: {
        //            handler: 'ListPO'
        //        },
        //        content: model
        //    }
        //);
        //let data = await client.sendRequest();
        //data.json().then(e => {
        //    if (e.isSuccess) {
        //        let i = 0;
        //        e.items.forEach((r, index) => {
        //            this.#gridMain.addRow(r.detailID, [
        //                i + 1,
        //                r.detailID,
        //                r.itemCode,
        //                r.uom,
        //                r.quantity,
        //                r.status,
        //                r.poNo,
        //                r.lotNo,
        //                r.sameLot,
        //                r.orderNo,
        //                r.productionSampleOrder,
        //                r.receivingDate,
        //                r.specification,
        //                r.nw,
        //                r.gw,
        //                r.cones,
        //                r.remarks,
        //                r.suplierName,
        //                r.materialCategory,
        //                r.materialDescription,
        //                r.statusShippingMark,
        //                r.createdDate
        //            ])
        //        });
        //    }
        //});
        Controls.toggleModal(this.#modalLoading, false);
    }


    async #loadGridMain() {
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
                this.#gridMain.clearAll();
                e.items.forEach((r, index) => {
                    this.#gridMain.addRow(r.inspectionTypeId, [
                        index + 1,
                        r.inspectionTypeCode,
                        r.inspectionTypeName,
                        r.mail,
                        r.updatedDate,
                        r.updatedBy,
                        r.isActive,
                        "<button name='ViewInspectTypeDetail' class='btn btn-primary btn-sm' data-inspectTypeId='" + r.inspectionTypeId + "\'>View Detail</button>"
                    ])
                });

                Array.from($("#GridMain").find('tr')).forEach(x => {
                    $(x).find('button[name="ViewInspectTypeDetail"]').off('click').on('click', async b => {
                        let id = $(b.currentTarget).data('inspecttypeid');
                        //let qtyFrom = this.#gridMain.cells(id, 1).getValue();
                        //let qtyTo = this.#gridMain.cells(id, 2).getValue();
                        //let sample = this.#gridMain.cells(id, 3).getValue();
                        //let acceptLimit = this.#gridMain.cells(id, 4).getValue();
                        //let isActive = this.#gridMain.cells(id, 7).getValue();

                        //this.#txtAQLId_Detail.val(id);
                        //this.#txtQtyFrom_Detail.val(qtyFrom);
                        //this.#txtQtyTo_Detail.val(qtyTo);
                        //this.#txtSample_Detail.val(sample);
                        //this.#txtAcceptLimit_Detail.val(acceptLimit);
                        //Controls.setControlStatus(this.#txtAQLId_Detail, ControlStatus.ReadOnly, true);
                        //Controls.setControlStatus(this.#cbIsActive_Detail, ControlStatus.Checked, isActive == 0 ? false : true);
                        Controls.toggleModal(this.#modalInspectTypeDetail, true);
                    });
                });
            }
        });
    }


    async #loadGridSub(inspectionTypeCode) {
        const client = new Client(
            {
                method: HttpMethod.GET,
                query: {
                    handler: 'ListInspection'
                },
                content: {
                    InspectionTypeCode: inspectionTypeCode
                }
            }
        );
        let data = await client.sendRequest();
        data.json().then(e => {
            if (e.isSuccess) {
                this.#gridSub.clearAll();
                e.items.forEach((r, index) => {
                    this.#gridSub.addRow(r.inspectionId, [
                        index + 1,
                        r.inspection,
                        r.typeValue,
                        r.updatedDate,
                        r.updatedBy,
                        r.isActive,
                        "<button name='ViewInspectDetail' class='btn btn-primary btn-sm' data-inspectId='" + r.inspectionId + "\'>View Detail</button>"
                    ])
                });

                Array.from($("#GridSub").find('tr')).forEach(x => {
                    $(x).find('button[name="ViewInspectDetail"]').off('click').on('click', async b => {
                        let id = $(b.currentTarget).data('inspectid');
                        //let qtyFrom = this.#gridMain.cells(id, 1).getValue();
                        //let qtyTo = this.#gridMain.cells(id, 2).getValue();
                        //let sample = this.#gridMain.cells(id, 3).getValue();
                        //let acceptLimit = this.#gridMain.cells(id, 4).getValue();
                        //let isActive = this.#gridMain.cells(id, 7).getValue();

                        //this.#txtAQLId_Detail.val(id);
                        //this.#txtQtyFrom_Detail.val(qtyFrom);
                        //this.#txtQtyTo_Detail.val(qtyTo);
                        //this.#txtSample_Detail.val(sample);
                        //this.#txtAcceptLimit_Detail.val(acceptLimit);
                        //Controls.setControlStatus(this.#txtAQLId_Detail, ControlStatus.ReadOnly, true);
                        //Controls.setControlStatus(this.#cbIsActive_Detail, ControlStatus.Checked, isActive == 0 ? false : true);
                        Controls.toggleModal(this.#modalInspectDetail, true);
                    });
                });
            }
        });
    }

    #initButton() {
        this.#btnClear.off('click').on('click', e => {

        });
    }

}

$(async () => {
    const main = new Inspection();
    main.initial();

    window.loadGridSub = main.loadGridSub;   // ✅ giờ gọi được window.loadGridSub('TYPE01')

});

