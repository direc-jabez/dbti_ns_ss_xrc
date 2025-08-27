/**
 * @NApiVersion 2.1
 * @NScripttype Suitelet
 *
 * Created by: DBTI - Charles Maverick Herrera
 * Date: Oct 28, 2024
 *
 */

define(["N/ui/serverWidget", "N/search", "N/record"], function (serverWidget, search, record) {
    const SUBSIDIARY_LEGAL_NAME = "legalname";
    const SUBSIDIARY_ADDRESS = "mainaddress_text";

    function onRequest(context) {
        var params = context.request.parameters; // pangkuha ng paramns sa uri || params is object

        var lessor_iid = params.lessor_iid; // Subsidiary internal ID

        log.debug('lessor_iid', lessor_iid);

        var subsidiary_rec = record.load({
            type: record.Type.SUBSIDIARY,
            id: lessor_iid,
            isDynamic: true,
        });

        var assign_lessor_name = '<#assign lessor_name="' + subsidiary_rec.getValue(SUBSIDIARY_LEGAL_NAME) + '"/>';
        var assign_lessor_address = '<#assign lessor_address="' + subsidiary_rec.getValue(SUBSIDIARY_ADDRESS) + '"/>';

        context.response.writeLine(assign_lessor_name);
        context.response.writeLine(assign_lessor_address);
    }

    return { onRequest };
});
