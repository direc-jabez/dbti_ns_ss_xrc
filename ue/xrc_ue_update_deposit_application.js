/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jan 28, 2025
 * 
 */
define(['N/search', 'N/record'],

    function (search, record) {

        const DEPOSITS_SUBLIST_ID = 'deposit';
        const APPLY_SUBLIST_FIELD_ID = 'apply';
        const DOC_SUBLIST_FIELD_ID = 'doc';


        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE) {

                var deposit_ids = getDepositIds(newRecord);

                log.debug('deposit_ids', deposit_ids);

                if (deposit_ids && deposit_ids.length > 0) {

                    var deposit_application_search = createDepositApplicationSearch(deposit_ids);

                    deposit_application_search.run().each(function (result) {

                        var item_ref = result.getValue({
                            name: "custbody_xrc_item_ref",
                            join: "appliedToTransaction",
                        });

                        updateDepositApplication(result.id, item_ref);

                        return true;

                    });

                }

            }

        }

        function getDepositIds(newRecord) {

            var deposits_lines = newRecord.getLineCount({
                sublistId: DEPOSITS_SUBLIST_ID
            });

            var deposit_ids = [];

            for (var line = 0; line < deposits_lines; line++) {

                var deposit_id = newRecord.getSublistValue({
                    sublistId: DEPOSITS_SUBLIST_ID,
                    fieldId: DOC_SUBLIST_FIELD_ID,
                    line: line,
                });

                var apply = newRecord.getSublistValue({
                    sublistId: DEPOSITS_SUBLIST_ID,
                    fieldId: APPLY_SUBLIST_FIELD_ID,
                    line: line,
                });

                if (apply) deposit_ids.push(deposit_id);

            }

            return deposit_ids;

        }   

        function createDepositApplicationSearch(deposit_ids) {

            var deposit_application_search = search.create({
                type: "depositapplication",
                filters:
                    [
                        ["type", "anyof", "DepAppl"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["appliedtotransaction", "anyof", deposit_ids],
                        "AND",
                        ["custbody_xrc_item_ref", "anyof", "@NONE@"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custbody_xrc_item_ref",
                            join: "appliedToTransaction",
                            label: "Item Reference"
                        })
                    ]
            });

            return deposit_application_search;

        }

        function updateDepositApplication(deposit_application_id, item_ref) {

            var dep_record = record.load({
                type: record.Type.DEPOSIT_APPLICATION,
                id: deposit_application_id,
            });

            dep_record.setValue("custbody_xrc_item_ref", item_ref);

            dep_record.save({
                ignoreMandatoryFields: true,
            });

        }

        return {
            afterSubmit: afterSubmit,
        };
    }
);