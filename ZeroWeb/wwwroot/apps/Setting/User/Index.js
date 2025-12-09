/// <reference path="../../../assets/Custom/_reference.js" />

class UserSetting {
    #gridMain;

	#btnSearch;
	#btnAdd;
    #modalLoading;
    #modalUser;
    #txtUserName;
    #txtFullName;
    #txtEmail;
    #ddlIsActive;

    #UserForm;

    #ddlRoleM;

    #txtUserIdM;
    #txtUserNameM;
    #txtFullNameM;
    #txtNameM;
    #txtEmailM;
    #txtDomainM;
    #txtTitleM;
    #cbIsActiveM;

    #btnUpdateUser;


    constructor() {
        this.#modalLoading = $('#modal-loading');
        this.#modalUser = $('#modal-user');
        this.#btnSearch = $('#btnSearch');
        this.#btnAdd = $('#btnAdd');

        this.#ddlIsActive = $('#ddlIsActive');

        this.#txtUserName = $('#txtUserName');
        this.#txtFullName = $('#txtFullName');
        this.#txtEmail = $('#txtEmail');

        this.#UserForm = $('#UserForm');
        this.#ddlRoleM = this.#UserForm.find("#ddlRoleM");
        this.#txtUserIdM = this.#UserForm.find("#txtUserIdM");
        this.#txtUserNameM = this.#UserForm.find("#txtUserNameM");
        this.#txtFullNameM = this.#UserForm.find("#txtFullNameM");
        this.#txtNameM = this.#UserForm.find("#txtNameM");
        this.#txtEmailM = this.#UserForm.find("#txtEmailM");
        this.#txtDomainM = this.#UserForm.find("#txtDomainM");
        this.#txtTitleM = this.#UserForm.find("#txtTitleM");
        this.#cbIsActiveM = this.#UserForm.find("#cbIsActiveM");
        this.#btnUpdateUser = $("#btnUpdateUser");
    }
    async initial() {

        try {
            Controls.toggleModal(this.#modalLoading, true);
            this.#registerEvents();
            this.#initGrid();
            this.#loadDropDown([]);
        }
        catch (error) {
            Notify.showException(error);
        }
        finally {
            Controls.toggleModal(this.#modalLoading, false);
        }
    }

    #registerEvents() {
        this.#btnSearch.off('click').on('click', e => {
            Controls.toggleModal(this.#modalLoading, true);
            this.#loadGrid();
            Controls.toggleModal(this.#modalLoading, false);
        });

        this.#btnAdd.off('click').on('click', e => {
            this.#loadUserDetail(-1);
        });

        this.#btnUpdateUser.off('click').on('click', async e => {
            const bodySent = {
                UserId: this.#txtUserIdM.val(),
                UserName: this.#txtUserNameM.val(),
                FullName: this.#txtFullNameM.val(),
                Name: this.#txtNameM.val(),
                Email: this.#txtEmailM.val(),
                Domain: this.#txtDomainM.val(),
                Title: this.#txtTitleM.val(),
                IsActive: this.#cbIsActiveM.is(":checked") ? 1 : 0,
                RoleList: this.#ddlRoleM.val().join(",")
            }

            const clientView = new Client({
                method: HttpMethod.POST, query: { handler: 'UpdateUser' }, content: bodySent
            });
            let data = await clientView.sendRequest(true);
            if (data.OK) {
                this.#loadGrid();
                Controls.toggleModal(this.#modalUser, false);
            }
        });


    }


    #initGrid() {
        this.#gridMain = new dhtmlXGridObject('gridbox');
        this.#gridMain.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridMain.setHeader("No,User Name, Full Name, Email, Active,");
        this.#gridMain.setInitWidths("80,150,150,*,100,100");
        this.#gridMain.setColAlign("center,center,center,center,center,center");
        this.#gridMain.setColTypes("ro,ro,ro,ro,ch,ro");
        this.#gridMain.setColSorting("int,str,str,str,str,str");
        this.#gridMain.enableAutoWidth(true);
        this.#gridMain.enableMultiselect(true);
        this.#gridMain.enableBlockSelection();  
        this.#gridMain.obj.className = "obj gridMain"; 
        this.#gridMain.entBox.id = "GridMain";
        this.#gridMain.init();

        this.#loadGrid();
    }

    async #loadUserDetail(userId) {
        Controls.toggleModal(this.#modalUser, true)
        this.#txtUserIdM.val(userId);
        if (userId == -1) {
            this.#txtUserNameM.attr('readonly', false);
            this.#txtUserNameM.val("");
            this.#txtNameM.val("");
            this.#txtEmailM.val("");
            this.#txtFullNameM.val("");
            this.#txtDomainM.val("");
            this.#txtTitleM.val("");
            this.#cbIsActiveM.prop("checked", true);
            this.#loadDropDown();
            this.#btnUpdateUser.html("Add User");
        } else {
            this.#txtUserNameM.attr('readonly', true);
            const clientView = new Client({
                method: HttpMethod.POST, query: { handler: 'Search' }, content: {
                    UserId: userId
                }
            });
            let data = await clientView.sendRequest();
            let dataUser = await data.json();
            if (dataUser.OK == true) {
                dataUser.Result.getFirst(e => {
                    this.#txtUserNameM.val(e.UserName);
                    this.#txtNameM.val(e.Name);
                    this.#txtEmailM.val(e.Email);
                    this.#txtFullNameM.val(e.FullName);
                    this.#txtDomainM.val(e.ADDomain);
                    this.#txtTitleM.val(e.Title);
                    this.#cbIsActiveM.prop("checked", e.IsActive == 1 ? true : false);
                    this.#loadDropDown(e.RoleList.split(","));
                    this.#btnUpdateUser.html("Update User");
                })
            };
        }
    }

    async #loadGrid() {
        const model = {
            UserId: -1,
            UserName: this.#txtUserName.val(),
            FullName: this.#txtFullName.val(),
            Email: this.#txtEmail.val(),
            IsActive: this.#ddlIsActive.val()
        }
        const client = new Client({ method: HttpMethod.POST, query: { handler: 'Search' }, content: model });
        let data = await client.sendRequest();
        this.#gridMain.clearAll();
        data.json().then(e => {
            e.Result.forEach((r, i) => {
                this.#gridMain.addRow(r.UserId, [i + 1, r.UserName, r.FullName, r.Email, r.IsActive, "<button  type='submit' data-userid='" + r.UserId + "' name='btnEdit' class='btn btn-primary btn-sm'>Edit</button>"]);
            });
            Array.from($(".gridMain").find('tr')).forEach(x => {
                $(x).find('button[name="btnEdit"]').off('click').on('click', async b => {

                    this.#loadUserDetail($(b.currentTarget).data('userid'));
                });
            });
        });
    }

    async #loadDropDown(role = []) {
        const clientDocumentType = new Client({ method: HttpMethod.POST, query: { handler: 'LoadRole' }, content: { IsActive: 1 } });
        let data = await clientDocumentType.sendRequest();


        data.json().then(e => {
            this.#ddlRoleM.empty();
            e.Result.forEach(val => {
                let selection = "";
                if (role.indexOf(val.RoleId.toString()) !== -1) selection = "selected"; 
                this.#ddlRoleM.append("<option value='" + val.RoleId + "' " + selection + ">" + val.RoleName + "</option>");
            })
        });
    }
}

$(async () => {
	const main = new UserSetting();
    main.initial();
})