String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    console.log(target);
    return target.replace(new RegExp(search, 'g'), replacement);
};

Array.prototype.getFirst = function (callback) {
    console.log(this.length);
    if (this.length > 0) callback(this[0]);
    return undefined;
};

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.addMonths = function (months) {
    var date = new Date(this.valueOf());
    date.setMonth(date.getMonth() + months);
    return date;
}

Date.prototype.yyyyMMdd = function(s = '-') {
    var date = new Date(this.valueOf());
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join(s);
}



Date.prototype.yyyyMM = function () {
    var date = new Date(this.valueOf());
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month].join('-');
}

Date.prototype.dayDiff = function (abs = true, from = null) {
    var dateTo = new Date(this.valueOf());
    var dateFrom = from == null ? new Date() : from
    //console.log(dateFrom)
    //console.log(dateTo)
    //console.log(Math.abs(dateTo - dateFrom))


    //const date1 = new Date('1/13/2011');
    //const date2 = new Date('12/15/2010');
    //console.log(date1)
    //console.log(date2)
    //console.log(date2 - date1);

    const diffTime = abs ? Math.abs(dateTo - dateFrom) : dateTo - dateFrom;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    console.log(diffDays);
    return diffDays;
}


Array.prototype.convertTableGrid = function (opt) {
    var dt = this.valueOf();
    var rows = [];

    if (opt == null) {
        opt.Header = [];
        opt.Increase = true;
        opt.Button = [];
    } else {
        if (opt.Header == undefined) opt.Header = [];
        if (opt.Increase == undefined) opt.Increase = true;
        if (opt.Button == undefined) opt.Button = [];
    }



    if (dt.length > 0 && opt.Header.length == 0) {
        Object.keys(dt[0]).forEach(function (key) {
            opt.Header.push(key);
        });
    } 

    dt.forEach(function (d, i) {
        var r = [];
        if (opt.Increase) r.push(i + 1);

        opt.Header.forEach(function (c) {
            r.push(d[c]);
        });

        opt.Button.forEach(function (c) {
            r.push("<button  type='submit' data-" + opt.Id.toLowerCase() + "='" + d[opt.Id] + "' name='" + c.id + "' class='btn btn-primary btn-sm'>" + c.name + "</button>");
        });

        rows.push({
            id: opt.Id != "" ? d[opt.Id] : (i + 1),
            data : r
        });
    });


    return { "rows": rows };
};

String.prototype.decodeHTML = function () {
    var str = this.valueOf();
    str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
    str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
    var element = document.createElement('div');
    element.innerHTML = str;
    str = element.textContent;
    element.textContent = '';
    return str;
}

String.prototype.toDate = function () {
    var target = this;
    var dateConvert = new Date(target);
    return dateConvert;
}
