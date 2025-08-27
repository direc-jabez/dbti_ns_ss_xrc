/**
* @NApiVersion 2.1
* @NScriptType Suitelet
*/
define(['N/search', 'N/record'], (search, record) => {

    const onRequest = (context) => {

        var rec = record.load({
            id: '39167',
            type: record.Type.INVOICE
        });

        var links_lines = rec.getLineCount({ sublistId: 'links' });

        for (var line = 0; line < links_lines; line++) {

            var date = rec.getSublistValue({
                sublistId: 'links',
                fieldId: 'trandate',
                line: line,
            });

            var type = rec.getSublistValue({
                sublistId: 'links',
                fieldId: 'type',
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

            log.debug('values', [date, type, doc_num, amount]);

        }

    }

    return { onRequest }
});

