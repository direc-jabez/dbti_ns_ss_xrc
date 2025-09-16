/**
* @NApiVersion 2.1
* @NScriptType Suitelet
*/
define(['N/search', 'N/record'], (search, record) => {

    const onRequest = (context) => {

        var rec = record.load({
            id: '43547',
            type: record.Type.INVOICE
        });

        rec.setValue('custbody_xrc_approver1', '402');

        rec.save({
            ignoreMandatoryFields: true,
        });

    }

    return { onRequest }
});

