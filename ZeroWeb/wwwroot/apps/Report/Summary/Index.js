/// <reference path="../../../Zero/assets/Custom/_reference.js" />

class Summary {
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
        this.#gridMain.setHeader("No,Detail ID,Item Code,UOM,Quantity,Status,PO Number,Lot Number,Same Lot,Order Number,Production Sample Order,Receiving Date,Specification,Net Weight,Gross Weight,Cones,Remarks,Suplier Name, Material Category, Material Description, Status Shipping Mark, Created Date");
        this.#gridMain.setInitWidths("50,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100");
        this.#gridMain.setColumnMinWidth("50,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100");

        this.#gridMain.setColAlign("center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center");
        this.#gridMain.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
        this.#gridMain.setColSorting("int,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str");
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
                let i = 0;
                e.items.forEach((r, index) => {
                    this.#gridMain.addRow(r.detailID, [
                        i + 1,
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
    const main = new Summary();
    main.initial();
})