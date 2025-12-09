/// <reference path="../../../Zero/assets/Custom/_reference.js" />

class User {
    //Modal
    #modalLoading;
    #modalUserDetail;

    //Textbox
    #txtUsername;
    #txtFullname;
    #txtEmail;


    #txtUsername_Detail;
    #txtFullname_Detail;
    #txtEmail_Detail;
    #txtContactNumber_Detail;


    //button
    #btnAddNew;
    #btnSearch;
    #btnClear;

    #btnClear_Detail;
    #btnAddNew_Detail;
    #btnUpdate_Detail;
    #btnResetPassword_Detail;


    //checkbox
    #cbIsActive_Detail;

    //dhx
    #gridMain;

    //select
    #ddlRole_Detail
    #ddlDepartment_Detail

    constructor() {

        //Modal
        this.#modalLoading = $('#modal-loading');
        this.#modalUserDetail = $('#modalUserDetail');

        //Textbox
        this.#txtUsername = $('#txtUsername');
        this.#txtFullname = $('#txtFullname');
        this.#txtEmail = $('#txtEmail');


        this.#txtUsername_Detail = $('#txtUsername_Detail');
        this.#txtFullname_Detail = $('#txtFullname_Detail');
        this.#txtEmail_Detail = $('#txtEmail_Detail');
        this.#txtContactNumber_Detail = $('#txtContactNumber_Detail');

        //Button
        this.#btnAddNew = $('#btnAddNew');
        this.#btnSearch = $('#btnSearch');
        this.#btnClear = $('#btnClear');

        this.#btnAddNew_Detail = $('#btnAddNew_Detail');
        this.#btnResetPassword_Detail = $('#btnResetPassword_Detail');
        this.#btnUpdate_Detail = $('#btnUpdate_Detail');
        this.#btnClear_Detail = $('#btnClear_Detail');

        //Checkbox
        this.#cbIsActive_Detail = $('#cbIsActive_Detail');

        //select
        this.#ddlRole_Detail = $('#ddlRole_Detail');
        this.#ddlDepartment_Detail = $('#ddlDepartment_Detail');

    }

    initial() {
        this.#initJavascript();
        this.#initGrid();
        this.#initButton();
    }

    #initJavascript() {
        this.#ddlRole_Detail.select2();
        this.#ddlDepartment_Detail.select2({
            dropdownParent: this.#modalUserDetail, // modal chứa select
            minimumResultsForSearch: 0 // luôn hiển thị ô search
        });
    }

    async #initGrid() {
        Controls.toggleModal(this.#modalLoading, true);
        //Controls.toggleModal(this.#modalLoadingA, true);

        this.#gridMain = new dhtmlXGridObject('gridbox');
        this.#gridMain.setImagePath("/Zero/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridMain.setHeader("No,Username, Full Name, Email, Department, Contact Number,");
        this.#gridMain.setInitWidths("50,150,*,100,150,150,100");
        this.#gridMain.setColumnMinWidth("50,150,150,100,150,150,100");

        this.#gridMain.setColAlign("center,center,center,center,center,center,center");
        this.#gridMain.setColTypes("ro,ro,ro,ro,ro,ro,ro");
        this.#gridMain.setColSorting("int,str,str,str,str,str,str");
        this.#gridMain.enableAutoWidth(true);
        this.#gridMain.enableMultiselect(false);
        this.#gridMain.enableBlockSelection();
        this.#gridMain.obj.className = "obj gridMain";
        this.#gridMain.entBox.id = "GridMain";
        this.#gridMain.init();

        const model = {
            A : ""
        }
        const client = new Client(
            {
                method: HttpMethod.GET,
                query: {
                    handler: 'List'
                },
                content: model
            }
        );
        let data = await client.sendRequest();
        data.json().then(e => {
            if (e.isSuccess) {
                let i = 0;
                e.items.forEach((r, index) => {
                    this.#gridMain.addRow(r.userId, [
                        i + 1,
                        r.userName,
                        r.fullName,
                        r.email,
                        r.department,
                        r.contactNumber,
                        "<button name='ViewUserDetail' class='btn btn-primary btn-sm' data-userId='" + r.userId + "\'>View Detail</button>"
                    ])
                });

                Array.from($("#GridMain").find('tr')).forEach(x => {
                    $(x).find('button[name="ViewUserDetail"]').off('click').on('click', async b => {
                        let id = $(b.currentTarget).data('userid');
                        let username = this.#gridMain.cells(id, 1).getValue();
                        let fullname = this.#gridMain.cells(id, 2).getValue();
                        let email = this.#gridMain.cells(id, 3).getValue();

                        this.#txtUsername_Detail.val(username);
                        this.#txtFullname_Detail.val(fullname);
                        this.#txtEmail_Detail.val(email);

                        this.#btnUpdate_Detail.show();
                        this.#btnResetPassword_Detail.show();
                        this.#btnAddNew_Detail.hide();

                        Controls.setControlStatus(this.#txtUsername_Detail, ControlStatus.ReadOnly, true);
                        Controls.toggleModal(this.#modalUserDetail, true);
                    });
                });
            }
        });

        Controls.toggleModal(this.#modalLoading, false);
    }

    #initButton() {
        this.#btnClear.off('click').on('click', e => {
            this.#txtEmail.val("");
            this.#txtFullname.val("");
            this.#txtUsername.val("");
        });

        this.#btnAddNew.off('click').on('click', e => {
            this.#btnUpdate_Detail.hide();
            this.#btnResetPassword_Detail.hide();
            this.#btnAddNew_Detail.show();
            Controls.setControlStatus(this.#txtUsername_Detail, ControlStatus.ReadOnly, false);
            Controls.toggleModal(this.#modalUserDetail, true);
        });
    }

    #viewDetailUser(id) {

    }
}

$(async () => {
    const main = new User();
    main.initial();
})