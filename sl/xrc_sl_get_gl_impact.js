/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/search', 'N/record'],

    function (search, record) {


        function onRequest(context) {

            // Parameters were set at the pdf template
            // Template id: CUSTTMPL_XRC_CHECK_VOUCHER
            var params = context.request.parameters;

            log.debug('params', params);

            var rec_type = params.rec_type;

            var rec_id = parseInt(params.id.split(",").join(","));

            // Get the GL Impact lines
            var gl = getGLImpact(rec_type, rec_id);

            // Convert the gl object to string so it can be passed to response object 
            var response = '<#assign gl="' + gl.join(',') + '"/>';

            var location_id = params.location_id;

            if (location_id) response += '<#assign branch="' + getLocationCode(location_id) + '"/>';

            context.response.writeLine(response);

        }

        function getGLImpact(rec_type, internal_id) {

            log.debug('params', [rec_type, internal_id]);

            var lines = [];

            // Creating vendor payment search
            var vendor_payment_search = search.create({
                type: "transaction",
                filters:
                    [
                        ["type", "anyof", rec_type],
                        "AND",
                        ["internalid", "anyof", internal_id]
                    ],
                columns:
                    [
                        search.createColumn({ name: "account", label: "Account" }),
                        search.createColumn({ name: "debitamount", label: "Amount (Debit)" }),
                        search.createColumn({ name: "creditamount", label: "Amount (Credit)" })
                    ]
            });

            // Traverse and push all the values to lines array
            vendor_payment_search.run().each(function (result) {

                log.debug('account name', getAccountName(result.getValue('account')));

                var line = 'account=' + result.getText('account') + '&debitamount=' + result.getValue('debitamount') + '&creditamount=' + result.getValue('creditamount');

                lines.push(line);

                return true;
            });

            return lines;

        }

        function getVendorPrepaymentGLImpact(rec_type, internal_id) {

        }

        function getLocationCode(location_id) {

            var location_code = search.lookupFields({
                type: search.Type.LOCATION,
                id: location_id,
                columns: ['tranprefix']
            }).tranprefix;

            return location_code;
        }

        function getAccountName(account_id) {

            var acc_rec = record.load({
                type: record.Type.ACCOUNT,
                id: account_id
            });

            return acc_rec.getValue('acctname');
        }

        return {
            onRequest: onRequest
        }
    }
);