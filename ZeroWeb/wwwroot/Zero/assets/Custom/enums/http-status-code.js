class HttpStatusCode {
    static #mapping = new Map();

    static #initData = {
        Accepted: HttpStatusCode.Accepted,
        AlreadyReported: HttpStatusCode.AlreadyReported,
        Ambiguous: HttpStatusCode.Ambiguous,
        BadGateway: HttpStatusCode.BadGateway,
        BadRequest: HttpStatusCode.BadRequest,
        Conflict: HttpStatusCode.Conflict,
        Continue: HttpStatusCode.Continue,
        Created: HttpStatusCode.Created,
        EarlyHints: HttpStatusCode.EarlyHints,
        ExpectationFailed: HttpStatusCode.ExpectationFailed,
        FailedDependency: HttpStatusCode.FailedDependency,
        Forbidden: HttpStatusCode.Forbidden,
        Found: HttpStatusCode.Found,
        GatewayTimeout: HttpStatusCode.GatewayTimeout,
        Gone: HttpStatusCode.Gone,
        HttpVersionNotSupported: HttpStatusCode.HttpVersionNotSupported,
        IMUsed: HttpStatusCode.IMUsed,
        InsufficientStorage: HttpStatusCode.InsufficientStorage,
        InternalServerError: HttpStatusCode.InternalServerError,
        LengthRequired: HttpStatusCode.LengthRequired,
        Locked: HttpStatusCode.Locked,
        LoopDetected: HttpStatusCode.LoopDetected,
        MethodNotAllowed: HttpStatusCode.MethodNotAllowed,
        MisdirectedRequest: HttpStatusCode.MisdirectedRequest,
        Moved: HttpStatusCode.Moved,
        MovedPermanently: HttpStatusCode.MovedPermanently,
        MultipleChoices: HttpStatusCode.MultipleChoices,
        MultiStatus: HttpStatusCode.MultiStatus,
        NetworkAuthenticationRequired: HttpStatusCode.NetworkAuthenticationRequired,
        NoContent: HttpStatusCode.NoContent,
        NonAuthoritativeInformation: HttpStatusCode.NonAuthoritativeInformation,
        NotAcceptable: HttpStatusCode.NotAcceptable,
        NotExtended: HttpStatusCode.NotExtended,
        NotFound: HttpStatusCode.NotFound,
        NotImplemented: HttpStatusCode.NotImplemented,
        NotModified: HttpStatusCode.NotModified,
        OK: HttpStatusCode.OK,
        PartialContent: HttpStatusCode.PartialContent,
        PaymentRequired: HttpStatusCode.PaymentRequired,
        PermanentRedirect: HttpStatusCode.PermanentRedirect,
        PreconditionFailed: HttpStatusCode.PreconditionFailed,
        PreconditionRequired: HttpStatusCode.PreconditionRequired,
        Processing: HttpStatusCode.Processing,
        ProxyAuthenticationRequired: HttpStatusCode.ProxyAuthenticationRequired,
        Redirect: HttpStatusCode.Redirect,
        RedirectKeepVerb: HttpStatusCode.RedirectKeepVerb,
        RedirectMethod: HttpStatusCode.RedirectMethod,
        RequestedRangeNotSatisfiable: HttpStatusCode.RequestedRangeNotSatisfiable,
        RequestEntityTooLarge: HttpStatusCode.RequestEntityTooLarge,
        RequestHeaderFieldsTooLarge: HttpStatusCode.RequestHeaderFieldsTooLarge,
        RequestTimeout: HttpStatusCode.RequestTimeout,
        RequestUriTooLong: HttpStatusCode.RequestUriTooLong,
        ResetContent: HttpStatusCode.ResetContent,
        SeeOther: HttpStatusCode.SeeOther,
        ServiceUnavailable: HttpStatusCode.ServiceUnavailable,
        SwitchingProtocols: HttpStatusCode.SwitchingProtocols,
        TemporaryRedirect: HttpStatusCode.TemporaryRedirect,
        TooManyRequests: HttpStatusCode.TooManyRequests,
        Unauthorized: HttpStatusCode.Unauthorized,
        UnavailableForLegalReasons: HttpStatusCode.UnavailableForLegalReasons,
        UnprocessableEntity: HttpStatusCode.UnprocessableEntity,
        UnsupportedMediaType: HttpStatusCode.UnsupportedMediaType,
        Unused: HttpStatusCode.Unused,
        UpgradeRequired: HttpStatusCode.UpgradeRequired,
        UseProxy: HttpStatusCode.UseProxy,
        VariantAlsoNegotiates: HttpStatusCode.VariantAlsoNegotiates,
    };

    static get Accepted() { return 202; }
    static get AlreadyReported() { return 208; }
    static get Ambiguous() { return 300; }
    static get BadGateway() { return 502; }
    static get BadRequest() { return 400; }
    static get Conflict() { return 409; }
    static get Continue() { return 100; }
    static get Created() { return 201; }
    static get EarlyHints() { return 103; }
    static get ExpectationFailed() { return 417; }
    static get FailedDependency() { return 424; }
    static get Forbidden() { return 403; }
    static get Found() { return 302; }
    static get GatewayTimeout() { return 504; }
    static get Gone() { return 410; }
    static get HttpVersionNotSupported() { return 505; }
    static get IMUsed() { return 226; }
    static get InsufficientStorage() { return 507; }
    static get InternalServerError() { return 500; }
    static get LengthRequired() { return 411; }
    static get Locked() { return 423; }
    static get LoopDetected() { return 508; }
    static get MethodNotAllowed() { return 405; }
    static get MisdirectedRequest() { return 421; }
    static get Moved() { return 301; }
    static get MovedPermanently() { return 301; }
    static get MultipleChoices() { return 300; }
    static get MultiStatus() { return 207; }
    static get NetworkAuthenticationRequired() { return 511; }
    static get NoContent() { return 204; }
    static get NonAuthoritativeInformation() { return 203; }
    static get NotAcceptable() { return 406; }
    static get NotExtended() { return 510; }
    static get NotFound() { return 404; }
    static get NotImplemented() { return 501; }
    static get NotModified() { return 304; }
    static get OK() { return 200; }
    static get PartialContent() { return 206; }
    static get PaymentRequired() { return 402; }
    static get PermanentRedirect() { return 308; }
    static get PreconditionFailed() { return 412; }
    static get PreconditionRequired() { return 428; }
    static get Processing() { return 102; }
    static get ProxyAuthenticationRequired() { return 407; }
    static get Redirect() { return 302; }
    static get RedirectKeepVerb() { return 307; }
    static get RedirectMethod() { return 303; }
    static get RequestedRangeNotSatisfiable() { return 416; }
    static get RequestEntityTooLarge() { return 413; }
    static get RequestHeaderFieldsTooLarge() { return 431; }
    static get RequestTimeout() { return 408; }
    static get RequestUriTooLong() { return 414; }
    static get ResetContent() { return 205; }
    static get SeeOther() { return 303; }
    static get ServiceUnavailable() { return 503; }
    static get SwitchingProtocols() { return 101; }
    static get TemporaryRedirect() { return 307; }
    static get TooManyRequests() { return 429; }
    static get Unauthorized() { return 401; }
    static get UnavailableForLegalReasons() { return 451; }
    static get UnprocessableEntity() { return 422; }
    static get UnsupportedMediaType() { return 415; }
    static get Unused() { return 306; }
    static get UpgradeRequired() { return 426; }
    static get UseProxy() { return 305; }
    static get VariantAlsoNegotiates() { return 506; }

    static getName(value) {
        if (!this.#mapping.size) {
            Object.keys(this.#initData).forEach(k => { this.#mapping.set(this.#initData[k], k); });
        }

        if (this.#mapping.has(value)) {
            return this.#mapping.get(value);
        }
    }
};