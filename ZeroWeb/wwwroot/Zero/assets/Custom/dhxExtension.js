dhtmlXGridObject.prototype.toPDF = function (g, o, u, r, m, A) {
    var h = {
        row: (this.getSelectedRowId() || "").split(this.delim),
        col: this.getSelectedCellIndex()
    };
    if (h.row === null || h.col === -1) {
        h = false
    } else {
        if (h.row) {
            for (var v = 0; v < h.row.length; v++) {
                if (h.row[v]) {
                    var c = this.cells(h.row[v], h.col).cell;
                    c.parentNode.className = c.parentNode.className.replace(" rowselected", "");
                    c.className = c.className.replace(" cellselected", "");
                    h.row[v] = c
                }
            }
        } else {
            h = false
        }
    }
    o = o || "color";
    var w = o == "full_color";
    var a = this;
    a._asCDATA = true;
    if (typeof (A) === "undefined") {
        this.target = ' target="_blank"'
    } else {
        this.target = A
    }
    eXcell_ch.prototype.getContent = function () {
        return this.getValue()
    };
    eXcell_ra.prototype.getContent = function () {
        return this.getValue()
    };

    function y(E) {
        var L = [];
        for (var J = 1; J < a.hdr.rows.length; J++) {
            L[J] = [];
            for (var I = 0; I < a._cCount; I++) {
                var N = a.hdr.rows[J].childNodes[I];
                if (!L[J][I]) {
                    L[J][I] = [0, 0]
                }
                if (N) {
                    L[J][N._cellIndexS] = [N.colSpan, N.rowSpan]
                }
            }
        }
        var K = "<rows profile='" + E + "'";
        if (u) {
            K += " header='" + u + "'"
        }
        if (r) {
            K += " footer='" + r + "'"
        }
        K += "><head>" + a._serialiseExportConfig(L).replace(/^<head/, "<columns").replace(/head>$/, "columns>");
        for (var J = 2; J < a.hdr.rows.length; J++) {
            var C = 0;
            var Q = a.hdr.rows[J];
            var M = "";
            for (var I = 0; I < a._cCount; I++) {
                if ((a._srClmn && !a._srClmn[I]) || (a._hrrar[I] && (!a._fake || I >= a._fake.hdrLabels.length))) {
                    C++;
                    continue
                }
                var P = L[J][I];
                var O = ((P[0] && P[0] > 1) ? ' colspan="' + P[0] + '" ' : "");
                if (P[1] && P[1] > 1) {
                    O += ' rowspan="' + P[1] + '" ';
                    C = -1
                }
                var D = "";
                var H = Q;
                if (a._fake && I < a._fake._cCount) {
                    H = a._fake.hdr.rows[J]
                }
                for (var F = 0; F < H.cells.length; F++) {
                    if (H.cells[F]._cellIndexS == I) {
                        if (H.cells[F].getElementsByTagName("SELECT").length) {
                            D = ""
                        } else {
                            D = _isIE ? H.cells[F].innerText : H.cells[F].textContent
                        }
                        D = D.replace(/[ \n\r\t\xA0]+/, " ");
                        break
                    }
                }
                if (!D || D == " ") {
                    C++
                }
                M += "<column" + O + "><![CDATA[" + D + "]]></column>"
            }
            if (C != a._cCount) {
                K += "\n<columns>" + M + "</columns>"
            }
        }
        K += "</head>\n";
        K += n();
        return K
    }

    function e() {
        var C = [];
        if (m) {
            for (var D = 0; D < m.length; D++) {
                C.push(s(a.getRowIndex(m[D])))
            }
        } else {
            for (var D = 0; D < a.getRowsNum(); D++) {
                C.push(s(D))
            }
        }
        return C.join("\n")
    }

    function n() {
        var E = ["<foot>"];
        if (!a.ftr) {
            return ""
        }
        for (var F = 1; F < a.ftr.rows.length; F++) {
            E.push("<columns>");
            var J = a.ftr.rows[F];
            for (var D = 0; D < a._cCount; D++) {
                if (a._srClmn && !a._srClmn[D]) {
                    continue
                }
                if (a._hrrar[D] && (!a._fake || D >= a._fake.hdrLabels.length)) {
                    continue
                }
                for (var C = 0; C < J.cells.length; C++) {
                    var I = "";
                    var H = "";
                    if (J.cells[C]._cellIndexS == D) {
                        I = _isIE ? J.cells[C].innerText : J.cells[C].textContent;
                        I = I.replace(/[ \n\r\t\xA0]+/, " ");
                        if (J.cells[C].colSpan && J.cells[C].colSpan != 1) {
                            H = " colspan='" + J.cells[C].colSpan + "' "
                        }
                        if (J.cells[C].rowSpan && J.cells[C].rowSpan != 1) {
                            H = " rowspan='" + J.cells[C].rowSpan + "' "
                        }
                        break
                    }
                }
                E.push("<column" + H + "><![CDATA[" + I + "]]></column>")
            }
            E.push("</columns>")
        }
        E.push("</foot>");
        return E.join("\n")
    }

    function l(D, C) {
        return (window.getComputedStyle ? (window.getComputedStyle(D, null)[C]) : (D.currentStyle ? D.currentStyle[C] : null)) || ""
    }

    function s(F) {
        if (!a.rowsBuffer[F]) {
            return ""
        }
        var C = a.render_row(F);
        if (C.style.display == "none") {
            return ""
        }
        var D = a.isTreeGrid() ? ' level="' + a.getLevel(C.idd) + '"' : "";
        var K = "<row" + D + ">";
        for (var I = 0; I < a._cCount; I++) {
            if (((!a._srClmn) || (a._srClmn[I])) && (!a._hrrar[I] || (a._fake && I < a._fake.hdrLabels.length))) {
                var O = a.cells(C.idd, I);
                if (w) {
                    var H = l(O.cell, "color");
                    var N = l(O.cell, "backgroundColor");
                    var M = l(O.cell, "font-weight") || l(O.cell, "fontWeight");
                    var J = l(O.cell, "font-style") || l(O.cell, "fontStyle");
                    var L = l(O.cell, "text-align") || l(O.cell, "textAlign");
                    var E = l(O.cell, "font-family") || l(O.cell, "fontFamily");
                    if (N == "transparent" || N == "rgba(0, 0, 0, 0)") {
                        N = "rgb(255,255,255)"
                    }
                    K += "<cell bgColor='" + N + "' textColor='" + H + "' bold='" + M + "' italic='" + J + "' align='" + L + "' font='" + E + "'>"
                } else {
                    K += "<cell>"
                }
                K += "<![CDATA[" + (O.getContent ? O.getContent() : O.getTitle()) + "]]></cell>"
            }
        }
        return K + "</row>"
    }

    function q() {
        var C = "</rows>";
        return C
    }
    var x = document.createElement("div");
    x.style.display = "none";
    document.body.appendChild(x);
    var j = "form_" + a.uid();
    x.innerHTML = '<form id="' + j + '" method="post" asp-page-handler="' + g + '" accept-charset="utf-8"  enctype="application/x-www-form-urlencoded"' + this.target + '><input type="hidden" name="grid_xml" id="grid_xml"/> </form>';
    document.getElementById(j).firstChild.value = encodeURIComponent(y(o).replace("\u2013", "-") + e() + q());
    //document.getElementById(j).submit();
    //x.parentNode.removeChild(x);
    //a = null;
    //if (h && h.row.length) {
    //    for (var v = 0; v < h.row.length; v++) {
    //        h.row[v].parentNode.className += " rowselected";
    //        if (h.row.length == 1) {
    //            h.row[v].className += " cellselected"
    //        }
    //    }
    //}
    //h = null
};


dhtmlXGridObject.prototype.setMinColumns = async function (min = 100) {
    var grid = await this;
    var columnInit = grid.initCellWidth;
    await columnInit.forEach((e, i) => {
        if (e === '*') {
            columnInit[i] = min;
        }
    });
    console.log(columnInit.join(","));
    await this.setColumnMinWidth(columnInit.join(","));
    await console.log(this);

};