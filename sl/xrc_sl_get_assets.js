/**
 * @NApiVersion 2.1
 * @NScripttype Suitelet
 *
 * Created by: DBTI - Ricky Eredillas Jr.
 * Date: Jul 14, 2025
 *
 */

define(["N/record", "N/search"], function (record, search) {


    function onRequest(context) {

        var params = context.request.parameters;

        log.debug('params', params);

        var issuance_id = params.issuance_id;

        log.debug('issuance_id', issuance_id);

        var response = '';

        var asset_description = '';

        var serial_number = '';

        var assets_search = createAssetsSearch(issuance_id);

        assets_search.run().each(function (result) {
            response += '<#assign asset_description ="' + result.getValue('custrecord_xrc_description') + '" />';
            response += '<#assign asset_serial_number ="' + result.getValue('custrecord_xrc_serial_number') + '" />';
            return true;
        });

        log.debug('asset_description', asset_description);

        log.debug('serial_number', serial_number);

        context.response.writeLine(response);
    }

    function createAssetsSearch(issuance_id) {
        var assets_search = search.create({
            type: "customrecord_xrc_assets",
            filters:
                [
                    ["custrecord_xrc_issuance_link", "anyof", issuance_id]
                ],
            columns:
                [
                    search.createColumn({ name: "scriptid", label: "Script ID" }),
                    search.createColumn({ name: "custrecord_xrc_asset", label: "Asset" }),
                    search.createColumn({ name: "custrecord_xrc_serial_number", label: "Serial Number" }),
                    search.createColumn({ name: "custrecord_xrc_description", label: "Description" })
                ]
        });

        return assets_search;
    }

    return { onRequest };
});
