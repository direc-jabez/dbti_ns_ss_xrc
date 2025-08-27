/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/render', 'N/record'], function (render, record) {

    function onRequest(context) {

        var rec_id = context.request.parameters.rec_id;

        var rec_type = context.request.parameters.rec_type;

        var pdfFileName = "check";

        var renderer = render.create();

        if (rec_type === "custrfnd") {

            renderer.addRecord('record', record.load({
                type: record.Type.CUSTOMER_REFUND,
                id: rec_id,
            }));

        } else {

            renderer.addRecord('record', record.load({
                type: record.Type.CHECK,
                id: rec_id,
            }));

        }

        renderer.setTemplateByScriptId("CUSTTMPL_XRC_CHECK_VOUCHER");

        context.response.setHeader({
            name: 'content-disposition',
            value: 'inline; filename="' + pdfFileName + '_' + 'bsc' + '.pdf"'
        });

        var pdfFile = renderer.renderAsPdf();

        context.response.writeFile(pdfFile, true);

    }

    return {
        onRequest: onRequest
    }

})