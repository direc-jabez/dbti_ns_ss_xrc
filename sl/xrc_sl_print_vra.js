/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/render', 'N/record', 'N/xml'], function (render, record) {

    function onRequest(context) {

        var data = context.request.parameters.data;

        var deserialized = JSON.parse(data);

        var pdfFileName = "VendorReturnAuthorization";

        var renderer = render.create();

        renderer.addRecord('record', record.load({
            type: record.Type.VENDOR_RETURN_AUTHORIZATION,
            id: deserialized.rec_id,
        }));

        renderer.setTemplateByScriptId("CUSTTMPL_XRC_VRA");

        context.response.setHeader({
            name: 'content-disposition',
            value: 'inline; filename="' + pdfFileName + '.pdf"'
        });

        var pdfFile = renderer.renderAsPdf();

        context.response.writeFile(pdfFile, true);

    }
    return {
        onRequest: onRequest
    }
})