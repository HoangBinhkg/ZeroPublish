/// <reference path="../../../Zero/assets/Custom/_reference.js" />

class AQL {
    //Modal
    #modalLoading;
    #modalAQLDetail;
    //Textbox

    #txtAQLId_Detail;
    #txtQtyFrom_Detail;
    #txtQtyTo_Detail;
    #txtSample_Detail;
    #txtAcceptLimit_Detail;


    //button
    #btnUpdate_Detail;

    //checkbox
    #cbIsActive_Detail;

    //dhx
    #gridMain;

    //select

    constructor() {

        //Modal
        this.#modalLoading = $('#modal-loading');
        this.#modalAQLDetail = $('#modalAQLDetail');
        //Textbox
        this.#txtAQLId_Detail = $('#txtAQLId_Detail');
        this.#txtQtyFrom_Detail = $('#txtQtyFrom_Detail');
        this.#txtQtyTo_Detail = $('#txtQtyTo_Detail');
        this.#txtSample_Detail = $('#txtSample_Detail');
        this.#txtAcceptLimit_Detail = $('#txtAcceptLimit_Detail');

        //Button
        this.#btnUpdate_Detail = $('#btnUpdate_Detail');

        //Checkbox

        this.#cbIsActive_Detail = $('#cbIsActive_Detail');

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
        this.#gridMain.setHeader("No,Qty From,Qty To, Sample, Accept Limit, Updated Date,Updated By, Active,");
        this.#gridMain.setInitWidths("50,100,100,100,100,150,100,100,*");
        this.#gridMain.setColumnMinWidth("50,100,100,100,100,100,100,100,100");

        this.#gridMain.setColAlign("center,center,center,center,center,center,center,center,center");
        this.#gridMain.setColTypes("ro,ro,ro,ro,ro,ro,ro,ch,ro");
        this.#gridMain.setColSorting("int,str,str,str,str,str,str,str,str");
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
        const client = new Client(
            {
                method: HttpMethod.GET,
                query: {
                    handler: 'List'
                },
                content: {}
            }
        );
        let data = await client.sendRequest();
        data.json().then(e => {
            if (e.isSuccess) {
                this.#gridMain.clearAll();
                e.items.forEach((r, index) => {
                    this.#gridMain.addRow(r.aqlId, [
                        index + 1,
                        r.qtyFrom,
                        r.qtyTo,
                        r.sample,
                        r.acceptLimit,
                        r.updatedDate,
                        r.updatedBy,
                        r.isActive,
                        "<button name='ViewAQLDetail' class='btn btn-primary btn-sm' data-aqlId='" + r.aqlId + "\'>View Detail</button>"
                    ])
                });

                Array.from($("#GridMain").find('tr')).forEach(x => {
                    $(x).find('button[name="ViewAQLDetail"]').off('click').on('click', async b => {
                        let id = $(b.currentTarget).data('aqlid');
                        let qtyFrom = this.#gridMain.cells(id, 1).getValue();
                        let qtyTo = this.#gridMain.cells(id, 2).getValue();
                        let sample = this.#gridMain.cells(id, 3).getValue();
                        let acceptLimit = this.#gridMain.cells(id, 4).getValue();
                        let isActive = this.#gridMain.cells(id, 7).getValue();

                        this.#txtAQLId_Detail.val(id);
                        this.#txtQtyFrom_Detail.val(qtyFrom);
                        this.#txtQtyTo_Detail.val(qtyTo);
                        this.#txtSample_Detail.val(sample);
                        this.#txtAcceptLimit_Detail.val(acceptLimit);
                        Controls.setControlStatus(this.#txtAQLId_Detail, ControlStatus.ReadOnly, true);
                        Controls.setControlStatus(this.#cbIsActive_Detail, ControlStatus.Checked, isActive == 0 ? false : true);
                        Controls.toggleModal(this.#modalAQLDetail, true);
                    });
                });
            }
        });
    }

    async #initButton() {
        this.#btnUpdate_Detail.off('click').on('click', async e => {
            const client = new Client(
                {
                    method: HttpMethod.POST,
                    query: {
                        handler: 'Update'
                    },
                    content: {
                        AQLId: this.#txtAQLId_Detail.val(),
                        QtyFrom: this.#txtQtyFrom_Detail.val(),
                        QtyTo: this.#txtQtyTo_Detail.val(),
                        Sample: this.#txtSample_Detail.val(),
                        AcceptLimit: this.#txtAcceptLimit_Detail.val(),
                        IsActive: Controls.isChecked(this.#cbIsActive_Detail)
                    }
                }
            );
            let data = await client.sendRequest();
            data.json().then(e => {
                if (e.isSuccess) {
                    this.#loadGrid();
                    Controls.toggleModal(this.#modalAQLDetail, false);
                }
            });
        });
    }
}

$(async () => {
    const main = new AQL();
    main.initial();
})