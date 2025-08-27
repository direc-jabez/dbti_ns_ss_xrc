/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/record'],

    function (record) {

        function onRequest(context) {

            try {
                var params = context.request.parameters;

                var inv_id = params.inv_id;

                log.debug('inv_id', inv_id);

                var payments_and_credits = getPaymentsAndCredits(inv_id);

                log.debug('payments_and_credits', payments_and_credits);

                var payments_and_credits_stringified = [];

                payments_and_credits.forEach(pm_cred => {
                    payments_and_credits_stringified.push(pm_cred.date + '/*/' + pm_cred.type + '/*/' + pm_cred.doc_num + '/*/' + pm_cred.amount);
                });

                var response = '<#assign payments_and_credits="' + payments_and_credits_stringified.join('/-/') + '"/>';

                context.response.writeLine(response);

            } catch (error) {

                log.debug('error', error);

            }

        }

        function getPaymentsAndCredits(inv_id) {

            var payments_and_credits = [];

            var rec = record.load({
                id: inv_id,
                type: record.Type.INVOICE
            });

            var links_lines = rec.getLineCount({ sublistId: 'links' });

            for (var line = 0; line < links_lines; line++) {

                var type = rec.getSublistValue({
                    sublistId: 'links',
                    fieldId: 'type',
                    line: line,
                });

                if (type !== "Total") {

                    var date = rec.getSublistValue({
                        sublistId: 'links',
                        fieldId: 'trandate',
                        line: line,
                    });


                    var doc_num = rec.getSublistValue({
                        sublistId: 'links',
                        fieldId: 'tranid',
                        line: line,
                    });

                    var amount = rec.getSublistValue({
                        sublistId: 'links',
                        fieldId: 'total',
                        line: line,
                    });

                    payments_and_credits.push({
                        date: formatDateToMMDDYYYY(date),
                        type: type,
                        doc_num: doc_num,
                        amount: Math.abs(amount),
                    });

                }

            }

            return payments_and_credits;

        }

        function formatDateToMMDDYYYY(dateString) {
            if (!dateString) return ''; // handle empty/null

            const date = new Date(dateString);
            if (isNaN(date)) return ''; // handle invalid dates

            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();

            return `${month}/${day}/${year}`;
        }

        return {
            onRequest: onRequest
        }
    }
);