/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/render', 'N/record'], function (render, record) {

    function onRequest(context) {

        var rec_type = context.request.parameters.rec_type;

        var rec_id = context.request.parameters.rec_id;

        var pdfFileName = "check";

        var renderer = render.create();

        // if (rec_type === record.Type.CHECK) {

        renderer.addRecord('record', record.load({
            type: rec_type,
            id: rec_id,
        }));

        renderer.setTemplateByScriptId("CUSTTMPL_135_9794098_303");

        // }

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