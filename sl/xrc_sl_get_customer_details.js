/**
 * @NApiVersion 2.1
 * @NScripttype Suitelet
 *
 * Created by: DBTI - Ricky Eredillas Jr.
 * Date: Jan 22, 2025
 *
 */

define(["N/record"],

    function (record) {

        const LEGAL_NAME_FIELD_ID = "custentity_xrc_legal_name";
        const TRADE_NAME_FIELD_ID = "custentity_xrc_trade_name";
        const TYPE_FIELD_ID = 'isperson';

        function onRequest(context) {

            var params = context.request.parameters;

            var lessee_id = params.lessee_id;

            var lessee_rec = record.load({
                type: record.Type.CUSTOMER,
                id: lessee_id,
            });

            var response = '<#assign lessee_legal_name="' + lessee_rec.getValue(LEGAL_NAME_FIELD_ID) + '"/>' +
                '<#assign lessee_trade_name="' + lessee_rec.getValue(TRADE_NAME_FIELD_ID) + '"/>' +
                '<#assign is_individual="' + lessee_rec.getValue(TYPE_FIELD_ID) + '"/>';

            context.response.writeLine(response);

        }

        return { onRequest };
    }
);
