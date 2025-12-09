/// <reference path="../../../assets/Custom/_reference.js" />

class IndexPage {
    #btnSideBar;
    #modalLoading;

    constructor() {
        this.#modalLoading = $('#modal-loading');
        this.#btnSideBar = $('#btnSideBar')
    }

    initial() {

        try {
            Controls.toggleModal(this.#modalLoading, true);
            this.#registerEvents();
        }
        catch (error) {
            Notify.showException(error);
        }
        finally {
            Controls.toggleModal(this.#modalLoading, false);
        }
    }

    async #registerEvents() {
        this.#btnSideBar.off("click").on("click", async e => {
            $("#main-wrapper").toggleClass("mini-sidebar");
            if ($("#main-wrapper").hasClass("mini-sidebar")) {
                $(".sidebartoggler").prop("checked", !0);
                $("#main-wrapper").attr("data-sidebartype", "mini-sidebar");
                const client = new Client({ path: "/Login", method: HttpMethod.POST, query: { handler: 'UpdatePageSize' }, content: { PageSize: "mini-sidebar"} });
                let data = await client.sendRequest(true);

            } else {
                $(".sidebartoggler").prop("checked", !1);
                $("#main-wrapper").attr("data-sidebartype", "full");
                const client = new Client({ path: "/Login", method: HttpMethod.POST, query: { handler: 'UpdatePageSize' }, content: { PageSize: "full" } });
                let data = await client.sendRequest(true);
            }
        });
       
    }
}

$(async () => {
    const main = new IndexPage();
    main.initial();
})