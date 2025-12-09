/// <reference path="../../../assets/Custom/_reference.js" />

class RoleManagement {
    #modalLoading;
    #modalUser;
    #modalRole;
    #gridRole;
    #gridUser;
    #gridPageMenu;

    #btnOpenRole;
    #btnOpenUser;


    #txtRoleId;
    #txtRoleName;
    #txtRoleDescription;
    #cbIsActive;
    #btnUpdateRole;

    #txtRoleIdOfUser;
    #btnAddUser;
    #ddlUser;


    constructor() {
        this.#modalLoading = $("#modal-loading");
        this.#modalUser= $("#modal-user");
        this.#modalRole= $("#modal-role");

        this.#btnOpenRole = $("#btnOpenRole");
        this.#btnOpenUser = $("#btnOpenUser");
        this.#txtRoleId = $("#txtRoleId");
        this.#txtRoleName = $("#txtRoleName");
        this.#txtRoleDescription = $("#txtRoleDescription");
        this.#cbIsActive = $("#cbIsActive");
        this.#txtRoleIdOfUser = $("#txtRoleIdOfUser");
        this.#ddlUser = $("#ddlUser");

        this.#btnAddUser = $("#btnAddUser");
        this.#btnUpdateRole = $("#btnUpdateRole");
    }

    async initial() {
        try {
            Controls.toggleModal(this.#modalLoading, true);
            this.#registerEvents();
            this.#initGrid();
            this.#loadData();
            this.#loadDropDown();
        }
        catch (error) {
            Notify.showException(error);
        }
        finally {
            Controls.toggleModal(this.#modalLoading, false);
        }
    }

    #loadData() {
        this.#loadGridRole();
    }

    #registerEvents() {

        this.#btnOpenRole.off("click").on("click", async e => {
            Controls.toggleModal(this.#modalRole, true);
            this.#btnUpdateRole.html("Add new role");
            this.#txtRoleId.val("-1");
            this.#txtRoleDescription.val("");
            this.#txtRoleName.val("");
            this.#cbIsActive.prop("checked", true);
            this.#txtRoleName.prop("readonly", false);
        });

        this.#btnOpenUser.off("click").on("click", async e => {
            if (this.#gridRole.getSelectedRowId() == null) {
                dhtmlx.alert("Please chose role to add user");
            } else {
                Controls.toggleModal(this.#modalUser, true);
                this.#txtRoleIdOfUser.val(this.#gridRole.getSelectedRowId());
            }
        });


     

        this.#btnAddUser.off("click").on("click", async e => {
            await this.#updateUserRole(this.#gridRole.getSelectedRowId(), this.#ddlUser.val(), true);
            Controls.toggleModal(this.#modalUser, false);
        });


        this.#btnUpdateRole.off("click").on("click", async e => {
            const client = new Client({
                method: HttpMethod.POST, query: { handler: 'UpdateRole' }, content: {
                    RoleId: this.#txtRoleId.val(),
                    RoleName: this.#txtRoleName.val(),
                    RoleDescription: this.#txtRoleDescription.val(),
                    IsActive: this.#cbIsActive.is(":checked")
                }
            });

            let data = await client.sendRequest(true);
            if (data.OK) {
                this.#loadGridRole();
                dhtmlx.alert(data.Result);
            } else alert(data.Exeception.Message)

            Controls.toggleModal(this.#modalRole, false);
        });
    }

    async #initGrid() {
       

        this.#gridRole = new dhtmlXGridObject('gridRole');
        this.#gridRole.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridRole.setHeader("No,Role Name,Role Description,Active,");
        this.#gridRole.setInitWidths("50,150,*,60,70");
        this.#gridRole.setColAlign("center,center,center,center,center");
        this.#gridRole.setColTypes("ro,ro,ro,ch,ro");
        this.#gridRole.setColSorting("int,str,str,str,str");
        this.#gridRole.enableAutoWidth(true);
        this.#gridRole.enableMultiselect(true);
        this.#gridRole.enableBlockSelection();
        this.#gridRole.obj.className = "obj gridRole";
        this.#gridRole.entBox.id = "gridRole";
        this.#gridRole.init();
        this.#gridRole.attachEvent("onRowSelect", async (id, ind) => {
            Controls.toggleModal(this.#modalLoading, true);
                await this.#loadGridPageMenu(id);
                await this.#loadGridUser(id);
            Controls.toggleModal(this.#modalLoading, false);
        });


    

        this.#gridUser = new dhtmlXGridObject('gridUser');
        this.#gridUser.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridUser.setHeader("No,User Name,Mail,Active");
        this.#gridUser.setInitWidths("50,100,*,60");
        this.#gridUser.setColAlign("center,center,center,center");
        this.#gridUser.setColTypes("ro,ro,ro,ch");
        this.#gridUser.setColSorting("int,str,str,str");
        this.#gridUser.enableAutoWidth(true);
        this.#gridUser.enableMultiselect(true);
        this.#gridUser.enableBlockSelection();
        this.#gridUser.obj.className = "obj gridUser";
        this.#gridUser.entBox.id = "gridUser";
        this.#gridUser.init();

        this.#gridUser.attachEvent("onCheck", async (rId, cInd, state) => {
            Controls.toggleModal(this.#modalLoading, true);
            await this.#updateUserRole(this.#gridRole.getSelectedRowId() , rId, state);
            Controls.toggleModal(this.#modalLoading, false);
        });

        this.#gridPageMenu = new dhtmlXGridObject('gridPageMenu');
        this.#gridPageMenu.setImagePath("/dist/dhx/skins/web/imgs/dhxgrid_web/");
        this.#gridPageMenu.setHeader("ID,Menu,Menu Description,Menu Path,Parent ID,");
        this.#gridPageMenu.setInitWidths("50,150,200,*,80,60");
        this.#gridPageMenu.setColAlign("center,center,left,left,left,center");
        this.#gridPageMenu.setColTypes("ro,ro,ro,ro,ro,ch");
        this.#gridPageMenu.setColSorting("int,str,str,str,str,str");
        this.#gridPageMenu.enableAutoWidth(true);
        this.#gridPageMenu.enableMultiselect(true);
        this.#gridPageMenu.enableBlockSelection();
        this.#gridPageMenu.obj.className = "obj gridPageMenu";
        this.#gridPageMenu.entBox.id = "gridPageMenu";
        this.#gridPageMenu.init();

        this.#gridPageMenu.attachEvent("onCheck", async (rId, cInd, state) => {
            Controls.toggleModal(this.#modalLoading, true);
            await this.#updatePageMenu(this.#gridRole.getSelectedRowId(), rId, state);
            Controls.toggleModal(this.#modalLoading, false);
        });
    }

    async #updateUserRole(roleId, rId, state) {
        const clientDocumentType = new Client({
            method: HttpMethod.POST, query: { handler: 'UpdateUserRole' }, content: {
                RoleId: roleId,
                UserId: rId,
                IsActive: state
            }
        });
        let data = await clientDocumentType.sendRequest(true);
        if (!data.OK) {
            dhtmlx.alert(data.Exeception.Message);
        } else {
            dhtmlx.message({
                text: data.Result,
                expire: 3000
            });
        }
    }

    async #updatePageMenu(roleId, rId, state) {
        const clientDocumentType = new Client({
            method: HttpMethod.POST, query: { handler: 'UpdatePageMenu' }, content: {
                RoleId: roleId,
                MenuId: rId,
                IsActive: state
            }
        });
        let data = await clientDocumentType.sendRequest(true);
        if (!data.OK) {
            dhtmlx.alert(data.Exeception.Message);
        } else {
            dhtmlx.message({
                text: data.Result,
                expire: 3000
            });
        }
    }

    async #loadGridRole() {
        const clientDocumentType = new Client({ method: HttpMethod.POST, query: { handler: 'LoadRole' }, content: { IsActive: -1 } });
        let data = await clientDocumentType.sendRequest(true);
        this.#gridRole.clearAll();
        this.#gridRole.addRow("0", [(1), "Everyone", "All Personal have AD Account", "1", ""]);
        data.Result.forEach((r, i) => {
            this.#gridRole.addRow(r.RoleId, [(i + 2), r.RoleName, r.RoleDescription, r.IsActive, "<button  type='submit' data-roleid='" + r.RoleId + "' name='btnEdit' class='btn btn-primary btn-sm'>Edit</button>"]);
        });

        Array.from($(".gridRole").find('tr')).forEach(x => {
            $(x).find('button[name="btnEdit"]').off('click').on('click', async b => {
                Controls.toggleModal(this.#modalLoading, true);
                let id = $(b.currentTarget).data('roleid');

                Controls.toggleModal(this.#modalRole, true);
                this.#btnUpdateRole.html("Update role");
                this.#txtRoleId.val(id);
                this.#txtRoleName.val(this.#gridRole.cells(id,1).getValue());
                this.#txtRoleDescription.val(this.#gridRole.cells(id,2).getValue());
                this.#cbIsActive.prop("checked", this.#gridRole.cells(id, 3).getValue());
                this.#txtRoleName.prop("readonly", true);

                Controls.toggleModal(this.#modalLoading, false);

            });
        });

    }


    async #loadGridPageMenu(id) {
        const clientDocumentType = new Client({ method: HttpMethod.POST, query: { handler: 'LoadPageMenu' }, content: { RoleId: id } });
        let data = await clientDocumentType.sendRequest(true);
        this.#gridPageMenu.clearAll();

        data.Result.forEach((r, i) => {
            this.#gridPageMenu.addRow(r.MenuId, [r.MenuId, r.MenuName, r.MenuDescription, r.MenuPath, r.ParentMenuId, r.RoleId == null ? 0 : 1]);
        });
    }

    async #loadGridUser(id) {
        const clientDocumentType = new Client({ method: HttpMethod.POST, query: { handler: 'LoadUserRole' }, content: { RoleId: id } });
        let data = await clientDocumentType.sendRequest(true);
        this.#gridUser.clearAll();

        data.Result.forEach((r, i) => {
            this.#gridUser.addRow(r.UserId, [(i + 1), r.UserName, r.Email, r.IsActive]);
        });

    }


    async #loadDropDown() {
        const client = new Client({ method: HttpMethod.POST, query: { handler: 'LoadUser' } });

        let data = await client.sendRequest(true);
        data.Result.forEach(val => {
            this.#ddlUser.append("<option value='" + val.UserId + "'>" + val.UserName + " - " + val.FullName + " - " + val.Email + "</option>");
        });
    }

}

$(async () => {
    const main = new RoleManagement();
    main.initial();
})