/// <reference path="../../assets/Custom/_reference.js" />

class Login {

    constructor() {
        this.#modalLoading = $('#modal-loading');
    }

    initial() {
        var url = new URL(window.location);
        var c = url.searchParams.get("RequestPath");
        this.#txtRequestPath.val(c);
        this.#btnSubmit.off('click').on('click', () => {
            Controls.toggleModal(this.#modalLoading, true);
            //const model = {
            //    "Username": this.#txtUserName.val(),
            //    "Password": this.#txtPassword.val(),
            //    "RequestPath": this.#txtRequestPath.val()
            //}
            //const client = new Client({ method: HttpMethod.POST, query: { handler: 'Login' }, content: model });
            //client.sendRequest();
            Controls.toggleModal(this.#modalLoading, false);
        });
    }
}

$(async () => {
    const login = new Login();
    login.initial();
})