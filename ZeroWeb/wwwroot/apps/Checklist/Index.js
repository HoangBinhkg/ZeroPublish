/// <reference path="../../../Zero/assets/Custom/_reference.js" />

class Checklist {
    //Modal
    #modalLoading;
    #modalHold;

    //Textbox
    #txtChecklistId;
    #txtChecker;
    #txtNote;
    #txtConclusion;

    //button
    #btnPass;
    #btnHold;
    #btnUpdate;

    //checkbox

    //dhx
    #gridMain;

    //select
    #ddlHoldReason;

    constructor() {

        //Modal
        this.#modalLoading = $('#modal-loading');
        this.#modalHold = $('#modalHold');

        //Textbox

        this.#txtChecklistId = $('#txtChecklistId');
        this.#txtChecker = $('#txtChecker');
        this.#txtNote = $('#txtNote');
        this.#txtConclusion = $('#txtConclusion');

        //Button
        this.#btnPass = $('#btnPass');
        this.#btnHold = $('#btnHold');
        this.#btnUpdate = $('#btnUpdate');

        //Checkbox

        //select
        this.#ddlHoldReason = $('#ddlHoldReason');

    }

    initial() {
        Controls.toggleModal(this.#modalLoading, true);
        this.#initJavascript();
        this.#initGrid();
        this.#initButton();
        Controls.toggleModal(this.#modalLoading, false);
    }

    #initJavascript() {

    }

    async #initChecklist(inspectionId, checklistId, value) {
        const client = new Client(
            {
                method: HttpMethod.POST,
                query: {
                    handler: 'UpdateChecklistData'
                },
                content: {
                    InspectionId : inspectionId,
                    ChecklistId : checklistId,
                    Result : value.toString()
                }
            }
        );
        let data = await client.sendRequest();
        data.json().then(e => {
            if (e.isSuccess) {
                dhtmlx.message({ type: "info", text: "Updated!" });
            }
        });
    }

    async #initGrid() {
        this.#gridMain = new dhtmlXGridObject('gridbox');
        this.#gridMain.setImagePath("/Zero/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridMain.setHeader("No,Name,Status");
        this.#gridMain.setInitWidths("50,*,200");
        this.#gridMain.setColumnMinWidth("50,100,200");

        this.#gridMain.setColAlign("center,center,center");
        this.#gridMain.setColTypes("ro,ro,ro");
        this.#gridMain.setColSorting("int,str,str");
        this.#gridMain.enableAutoWidth(true);
        this.#gridMain.enableMultiselect(false);
        this.#gridMain.obj.className = "obj gridMain";
        this.#gridMain.entBox.id = "GridMain";
        this.#gridMain.init();


        const model = {
            ChecklistId: this.#txtChecklistId.val(),
        }
        const client = new Client(
            {
                method: HttpMethod.POST,
                query: {
                    handler: 'ChecklistDetail'
                },
                content: model
            }
        );
        let data = await client.sendRequest();
        data.json().then(e => {
            if (e.isSuccess) {
                e.items.forEach((r, index) => {
                    let vInput = "";
                    let ro = this.#txtConclusion.val() == "Pass" ? "disabled readonly" : "";
                    if (r.typeValue == "Checkbox") {
                        vInput = "<input type='checkbox' class='form-check-input' name='valCheckBox' style='width:50px;height:50px' data-inspectionId='" + r.inspectionId + "' data-checklistId='" + this.#txtChecklistId.val() + "' " + (r.result == "true" ? "checked" : "") + " " + ro +">";
                    } else {
                        vInput = "<input type='textbox' class='form-check-input' name='valTextbox' style='width:100%;height:50px; font-size:20pt; text-align: center; font-weight: bold' data-inspectionId='" + r.inspectionId + "' data-checklistId='" + this.#txtChecklistId.val() + "' value='" + r.result + "' " + ro +">";
                    }

                    this.#gridMain.addRow(r.inspectionId, [
                        index + 1,
                        r.inspection,
                        vInput
                    ]);

                    Array.from($("#GridMain").find('tr')).forEach(x => {
                        $(x).find('input[name="valCheckBox"]').off('change').on('change', async b => {
                            let inspectionId = $(b.currentTarget).data('inspectionid');
                            let checklistId = this.#txtChecklistId.val();
                            let val = $(b.currentTarget).prop('checked');
                            this.#initChecklist(inspectionId,checklistId,val);
                        });

                        $(x).find('input[name="valTextbox"]').off('change').on('change', async b => {
                            let inspectionId = $(b.currentTarget).data('inspectionid');
                            let checklistId = this.#txtChecklistId.val();
                            let val = $(b.currentTarget).val();
                            this.#initChecklist(inspectionId, checklistId, val);
                        });
                    });
                });
            }
        });
    }

    #initButton() {
        this.#btnHold.off('click').on('click', e => {
            Controls.toggleModal(this.#modalHold, true);
        });


        this.#btnPass.off('click').on('click', e => {
            this.#updateChecklist("Pass");
        });


        this.#btnUpdate.off('click').on('click', e => {
            this.#updateChecklist(this.#ddlHoldReason.val());
        });
    }

    async #updateChecklist(status) {
        const client = new Client(
            {
                method: HttpMethod.POST,
                query: {
                    handler: 'UpdateChecklist'
                },
                content: {
                    ChecklistId: this.#txtChecklistId.val(),
                    Note: this.#txtNote.val(),
                    Checker: this.#txtChecker.val(),
                    Conclusion: status
                }
            }
        );
        let data = await client.sendRequest();
        data.json().then(e => {
            if (e.isSuccess) {
                dhtmlx.message({ type: "info", text: "Updated!" });
            }
        });
    }
}

$(async () => {
    const main = new Checklist();
    main.initial();
})