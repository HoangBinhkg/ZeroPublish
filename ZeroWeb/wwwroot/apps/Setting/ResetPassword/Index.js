/// <reference path="../../../assets/Custom/_reference.js" />

class ResetPassword {
    #modalLoading;
    #btnChangePassword;
    #txtOldPassword;
    #txtNewPassword;
    #txtConfirmNewPassword;
    #codeResetPassword;

    constructor() {
        this.#modalLoading = $('#modal-loading');
        this.#btnChangePassword = $('#btnChangePassword');
        this.#txtNewPassword = $('#txtNewPassword');
        this.#txtConfirmNewPassword = $('#txtConfirmNewPassword');
    }

    initial() {

        var url = new URL(window.location);
        var c = url.searchParams.get("Code");
        this.#codeResetPassword = c;

        this.#btnChangePassword.off('click').on('click', async () => {
            Controls.toggleModal(this.#modalLoading, true);
            if (this.#txtNewPassword.val().length == 0) alert("Password is empty. Please try again");
            else if (this.#txtNewPassword.val() != this.#txtConfirmNewPassword.val()) alert("New Password not match. Please try again");
            else {
                const model = {
                    NewPassword: sha1(this.#txtNewPassword.val()),
                    CodeResetPassword: this.#codeResetPassword
                }
                const client = new Client({ method: HttpMethod.POST, query: { handler: 'ResetPassword' }, content: model });
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
    const main = new ResetPassword();
    main.initial();
})