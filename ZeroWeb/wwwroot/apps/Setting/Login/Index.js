/// <reference path="../../../assets/Custom/_reference.js" />

class Login {
    #modalLoading;
    #btnLoginAD;
    #txtLoginType;
    #btnSubmit;
    #txtUserName;
    #txtPassword;
    #formLogin;
    #txtRequestPath;
    #btnResetPassword;

    constructor() {
        this.#modalLoading = $('#modal-loading');
        this.#btnSubmit = $('#btnSubmit');
        this.#btnLoginAD = $('#btnLoginAD');
        this.#txtLoginType = $('#txtLoginType');
        this.#txtUserName = $('#txtUserName');
        this.#txtPassword = $('#txtPassword');
        this.#formLogin = $('#formLogin');
        this.#txtRequestPath = $('#txtRequestPath');
        this.#btnResetPassword = $('#btnResetPassword');
    }

    initial() {
        var url = new URL(window.location);
        var c = url.searchParams.get("ReturnUrl");
        this.#txtRequestPath.val(c);
        this.#btnResetPassword.off('click').on('click', async () => {
            Controls.toggleModal(this.#modalLoading, true);
            if (this.#txtUserName.val() == "") alert("Please keyin Username to reset password");
            else {
                const model = {
                    Username: this.#txtUserName.val(),
                }
                const client = new Client({ method: HttpMethod.POST, query: { handler: 'ResetPassword' }, content: model });
                let data = await client.sendRequest(true);
                if (data.OK == true) {
                    alert(data.Result);
                } else alert("Issue System, please contact SysAdmin to check this issue");
            }
            Controls.toggleModal(this.#modalLoading, false);
        });

        this.#btnLoginAD.off('click').on('click', () => {
            Controls.toggleModal(this.#modalLoading, true);
            this.#txtLoginType.val("AD");
            this.#txtPassword.val(Controls.ep(this.#txtPassword.val()));
            this.#formLogin.submit();
            Controls.toggleModal(this.#modalLoading, false);
        });


        this.#btnSubmit.off('click').on('click', () => {
            Controls.toggleModal(this.#modalLoading, true);
            this.#txtLoginType.val("Normal");
            this.#txtPassword.val(Controls.ep(this.#txtPassword.val()));
            this.#formLogin.submit();
            Controls.toggleModal(this.#modalLoading, false);
        });
    }
}

$(async () => {
    const login = new Login();
    login.initial();
})