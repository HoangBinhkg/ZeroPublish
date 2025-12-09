/// <reference path="../../../assets/Custom/_reference.js" />

class ChangePassword {
    #modalLoading;
    #btnChangePassword;
    #txtOldPassword;
    #txtNewPassword;
    #txtConfirmNewPassword;

    constructor() {
        this.#modalLoading = $('#modal-loading');
        this.#btnChangePassword = $('#btnChangePassword');
        this.#txtOldPassword = $('#txtOldPassword');
        this.#txtNewPassword = $('#txtNewPassword');
        this.#txtConfirmNewPassword = $('#txtConfirmNewPassword');
    }

    initial() {
        this.#btnChangePassword.off('click').on('click', async () => {
            Controls.toggleModal(this.#modalLoading, true);
            if (this.#txtNewPassword.val().length == 0 || this.#txtOldPassword.val().length == 0) alert("Password is empty. Please try again");
            else if (this.#txtNewPassword.val() != this.#txtConfirmNewPassword.val()) alert("New Password not match. Please try again");
            else if (this.#txtNewPassword.val() == this.#txtOldPassword.val()) alert("New Password same with Old Password. Please try again");
            else {
                const model = {
                    NewPassword: sha1(this.#txtNewPassword.val()),
                    OldPassword: sha1(this.#txtOldPassword.val())
                }
                const client = new Client({ method: HttpMethod.POST, query: { handler: 'ChangePassword' }, content: model });
                let data = await client.sendRequest(true);
                if (data.OK == true) {
                    alert(data.Result);
                } else alert("Issue System, please contact SysAdmin to check this issue");
            }
            Controls.toggleModal(this.#modalLoading, false);
        });

       
    }
}

$(async () => {
    const main = new ChangePassword();
    main.initial();
})