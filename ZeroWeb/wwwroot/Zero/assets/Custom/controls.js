/// <reference path="enums/http-method.js" />
/// <reference path="models/client-request.js" />
/// <reference path="helpers.js" />

class Controls {
    static async loadPartialView(control, viewName, args = new ClientRequest()) {
        args = args || {};
        args.query = args.query || {};
        args.method = args.method || HttpMethod.POST;
        args.query.handler = args.query.handler || viewName;

        if (args.method === HttpMethod.GET) {
            throw Helpers.buildError('Please do not use GET for this function.');
        }

        const client = new Client({ path: args.path, method: args.method, query: { handler: args.query.handler }, content: args.model });

        const response = await client.sendRequest();
        if (!response.ok) {
            throw Helpers.buildHttpError(response, await response.text(), 'Load Partial View has failed');
        }

        control.empty();
        control.append($(await response.text()).children());

        if (args.defaultValue !== undefined && args.defaultValue !== null) {
            control.val(args.defaultValue);
        }

        I18Next.change();

        return control;
    }

    static async loadTableView(control, viewName, args = new ClientRequest()) {
        args = args || {};
        args.query = args.query || {};
        args.method = args.method || HttpMethod.POST;
        args.query.handler = args.query.handler || viewName;

        if (args.method === HttpMethod.GET) {
            throw Helpers.buildError('Please do not use GET for this function.');
        }

        const client = new Client({ path: args.path, method: args.method, query: { handler: args.query.handler }, content: args.model });

        const response = await client.sendRequest();
        if (!response.ok) {
            throw Helpers.buildHttpError(response, await response.text(), 'Load Table View has failed');
        }

        const table = control.DataTable();
        table.clear().draw();

        const rows = table.row;
        Array.from($(await response.text()).children('tbody').children()).forEach(x => {
            rows.add(x).draw();
        });

        I18Next.change();

        return control;
    }

    static async loadModalView(control, viewName, args = new ClientRequest()) {
        args = args || {};
        args.query = args.query || {};
        args.method = args.method || HttpMethod.POST;
        args.query.handler = args.query.handler || viewName;

        if (args.method === HttpMethod.GET) {
            throw Helpers.buildError('Please do not use GET for this function.');
        }

        const client = new Client({ path: args.path, method: args.method, query: { handler: args.query.handler }, content: args.model });

        const response = await client.sendRequest();

        if (!response.ok) {
            throw Helpers.buildHttpError(response, await response.text(), 'Load Modal View has failed');
        }

        control.empty();
        control.append($(await response.text()).children());

        I18Next.change();

        return control;
    }

    static toggleModal(control, status) {
        if (status) {
            control.modal('show');
        }
        else {
            control.modal('hide');
        }
    }

    static setControlStatus(control, status, value) {
        switch (status) {
            case ControlStatus.Disabled:
                control.prop('disabled', value);
                break;
            case ControlStatus.Checked:
                control.prop('checked', value);
                break;
            case ControlStatus.ReadOnly:
                control.prop('readonly', value);
                break;
            default:
                throw Helpers.buildError('Control Status is not supported');
        }
    }

    static getControlStatus(control, status) {
        switch (status) {
            case ControlStatus.Disabled:
                return control.is(':disabled');
            case ControlStatus.Checked:
                return control.is(':checked');
            default:
                throw Helpers.buildError('Control Status is not supported');
        }
    }

    static isChecked(control, num = false) {
        if (!num) return control.is(":checked");
        else return control.is(":checked") ? 1 : 0;
    }

    static setValueCheckBox(control, status = true) {
        control.prop("checked", status);
    }

    static setValueSingleDropDownList(control, val) {
        control.find('option').each(function () {
            const $opt = $(this);
            const value = $opt.val();
            const text = $opt.text();
            if (text == val) {
                control.val(value).trigger('change')
            }
        });

    }

    static getDataRowTable(control, name) {
        return $(control.currentTarget).data(name.toLowerCase())
    }

    static sendMessage(mess, exp = 5000) {
        dhtmlx.message({
            text: mess,
            expire: exp
        })
    }

    static sendAlert(mess) {
        dhtmlx.alert({
            title: "Alert",
            type: "alert-error",
            text: mess
        });
    }

    static formatDataTable(control) {
        control.DataTable({
            destroy: true,
            language: {
                searchPlaceholder: I18Next.translate('Search...'),
                zeroRecords: I18Next.translate('No matching records found'),
                info: I18Next.translate('Page _PAGE_ of _PAGES_'),
                infoFiltered: I18Next.translate('(filtered from _MAX_ total entries)'),
                infoEmpty: I18Next.translate('Showing 0 to 0 of 0 entries'),
                loadingRecords: I18Next.translate('Loading...')
            }
        });
    }

    
    static encodeSHA1(str) {
        function rotate_left(n, s) {
            return (n << s) | (n >>> (32 - s));
        }

        function cvt_hex(val) {
            let str = "";
            for (let i = 7; i >= 0; i--) {
                str += ((val >>> (i * 4)) & 0x0f).toString(16);
            }
            return str;
        }

        function utf8_encode(string) {
            return unescape(encodeURIComponent(string));
        }

        str = utf8_encode(str);
        let msg_len = str.length;

        let word_array = [];
        for (let i = 0; i < msg_len - 3; i += 4) {
            word_array.push(str.charCodeAt(i) << 24 |
                str.charCodeAt(i + 1) << 16 |
                str.charCodeAt(i + 2) << 8 |
                str.charCodeAt(i + 3));
        }

        let i;
        switch (msg_len % 4) {
            case 0: i = 0x080000000; break;
            case 1: i = str.charCodeAt(msg_len - 1) << 24 | 0x0800000; break;
            case 2: i = str.charCodeAt(msg_len - 2) << 24 |
                str.charCodeAt(msg_len - 1) << 16 | 0x08000; break;
            case 3: i = str.charCodeAt(msg_len - 3) << 24 |
                str.charCodeAt(msg_len - 2) << 16 |
                str.charCodeAt(msg_len - 1) << 8 | 0x80; break;
        }
        word_array.push(i);

        while ((word_array.length % 16) !== 14) word_array.push(0);
        word_array.push(msg_len >>> 29);
        word_array.push((msg_len << 3) & 0x0ffffffff);

        let H0 = 0x67452301, H1 = 0xEFCDAB89, H2 = 0x98BADCFE, H3 = 0x10325476, H4 = 0xC3D2E1F0;

        let W = new Array(80);
        for (let blockstart = 0; blockstart < word_array.length; blockstart += 16) {
            for (let i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
            for (let i = 16; i < 80; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

            let A = H0, B = H1, C = H2, D = H3, E = H4;

            for (let i = 0; i < 80; i++) {
                let temp;
                if (i < 20) temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                else if (i < 40) temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                else if (i < 60) temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                else temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;

                E = D; D = C; C = rotate_left(B, 30); B = A; A = temp;
            }

            H0 = (H0 + A) & 0x0ffffffff;
            H1 = (H1 + B) & 0x0ffffffff;
            H2 = (H2 + C) & 0x0ffffffff;
            H3 = (H3 + D) & 0x0ffffffff;
            H4 = (H4 + E) & 0x0ffffffff;
        }

        return (cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4)).toLowerCase();
    }

    static ep(str) {
        return this.encodeSHA1(this.encodeSHA1(str));
    }


}