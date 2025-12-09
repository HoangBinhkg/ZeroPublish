/// <reference path="../../../Zero/assets/Custom/_reference.js" />

class PODetail {
    //Modal
    #modalLoading;

    //Textbox



    //button
    #btnSearch;
    #btnClear;

    //checkbox

    //dhx
    #gridMain;

    //select

    constructor() {

        //Modal
        this.#modalLoading = $('#modal-loading');

        //Textbox


        //Button
        this.#btnSearch = $('#btnSearch');
        this.#btnClear = $('#btnClear');

        //Checkbox

        //select

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

        this.#gridMain = new dhtmlXGridObject('gridbox');
        this.#gridMain.setImagePath("/Zero/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridMain.setHeader("No,Action,Detail ID,Item Code,UOM,Quantity,Status,PO Number,Lot Number,Same Lot,Order Number,Production Sample Order,Receiving Date,Specification,Net Weight,Gross Weight,Cones,Remarks,Suplier Name, Material Category, Material Description, Status Shipping Mark, Created Date");
        this.#gridMain.setInitWidths("50,100,70,150,70,70,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100");
        this.#gridMain.setColumnMinWidth("50,100,70,150,70,70,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100");

        this.#gridMain.setColAlign("center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center");
        this.#gridMain.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
        this.#gridMain.setColSorting("int,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str");
        this.#gridMain.enableAutoWidth(true);
        this.#gridMain.enableMultiselect(false);
        this.#gridMain.enableBlockSelection();
        this.#gridMain.obj.className = "obj gridMain";
        this.#gridMain.entBox.id = "GridMain";
        this.#gridMain.init();


        const model = {
            ItemCode: "",
            PO: "",
            OrderNo: ""
        }
        const client = new Client(
            {
                method: HttpMethod.POST,
                query: {
                    handler: 'ListPO'
                },
                content: model
            }
        );
        let data = await client.sendRequest();
        data.json().then(e => {
            if (e.isSuccess) {
                e.items.forEach((r, index) => {
                    let btnPO = "";
                    if (r.checklistId == 0) {
                        btnPO = "<button name='POAction' style='width: 100px; font-weight: bold' class='btn btn-secondary btn-sm' data-checklistId='" + r.checklistId + "\' data-detailId='" + r.detailID + "\'>Create</button>"
                    } else {
                        btnPO = "<button name='POAction'  style='width: 100px; font-weight: bold' class='btn btn-primary btn-sm' data-checklistId='" + r.checklistId + "\' data-detailId='" + r.detailID + "\'>View</button>"
                    }

                    this.#gridMain.addRow(r.detailID, [
                        index + 1,
                        btnPO,
                        r.detailID,
                        r.itemCode,
                        r.uom,
                        r.quantity,
                        r.status,
                        r.poNo,
                        r.lotNo,
                        r.sameLot,
                        r.orderNo,
                        r.productionSampleOrder,
                        r.receivingDate,
                        r.specification,
                        r.nw,
                        r.gw,
                        r.cones,
                        r.remarks,
                        r.suplierName,
                        r.materialCategory,
                        r.materialDescription,
                        r.statusShippingMark,
                        r.createdDate
                    ])
                });

                Array.from($("#GridMain").find('tr')).forEach(x => {
                    $(x).find('button[name="POAction"]').off('click').on('click', async b => {
                        let id = $(b.currentTarget).data('checklistid');
                        if (id != 0) {
                            window.open('/Checklist?ID=' + id, '_blank');
                        } else {
                            const client = new Client(
                                {
                                    method: HttpMethod.POST,
                                    query: {
                                        handler: 'CreateChecklist'
                                    },
                                    content: {
                                        DetailId: $(b.currentTarget).data('detailid')
                                    }
                                }
                            );
                            let data = await client.sendRequest();
                            data.json().then(e => {
                                if (e.isSuccess) {
                                    window.open('/Checklist?ID=' + e.items[0].checklistId, '_blank');
                                }
                            });
                        }
                    });
                });
            }
        });
        Controls.toggleModal(this.#modalLoading, false);
    }

    #initButton() {
        this.#btnClear.off('click').on('click', e => {

        });
    }

}

$(async () => {
    const main = new PODetail();
    main.initial();
})