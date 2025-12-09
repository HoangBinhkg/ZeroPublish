class Dialog {
    static confirm(text, title, confirmOptions, cancelOptions) {
        const emptyCallback = () => {
            //Do Nothing
        };

        const options = {
            title,
            text,
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: confirmOptions?.title || I18Next.translate('OK'),
            cancelButtonText: cancelOptions?.title || I18Next.translate('Cancel'),
        }

        return Swal.fire(options)
            .then(result => {
                if (result && !result.dismiss) {
                    const callback = confirmOptions?.callback || emptyCallback;
                    return callback();
                }
                else {
                    const callback = cancelOptions?.callback || emptyCallback;
                    return callback();
                }
            });
    }

    static error(text, title = '') {
        const options = {
            title,
            text,
            type: 'error',
            showCloseButton: true,
            customClass: {
                confirmButton: 'btn btn-danger'
            },
            buttonsStyling: false
        }

        return Swal.fire(options);
    }

    static success(text, title = '') {
        const options = {
            title,
            text,
            type: 'success',
            showCloseButton: true,
            customClass: {
                confirmButton: 'btn btn-success'
            },
            buttonsStyling: false
        }

        return Swal.fire(options);
    }

    static info(text, title = '') {
        const options = {
            title,
            text,
            type: 'info',
            showCloseButton: true,
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        }

        return Swal.fire(options);
    }

    static warn(text, title = '') {
        const options = {
            title,
            text,
            type: 'warning',
            showCloseButton: true,
            customClass: {
                confirmButton: 'btn btn-warning'
            },
            buttonsStyling: false
        }

        return Swal.fire(options);
    }
}