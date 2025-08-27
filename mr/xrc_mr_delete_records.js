/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jan 22, 2025
 * 
 */
define(['N/record', 'N/search'],

    function (record, search) {

        function getInputData(context) {

            return createRecordSearch();

        }

        function reduce(context) {

            try {

                // log.debug('context.values', context.values);

                var value = JSON.parse(context.values);

                var record_type = value.values['recordtype'];

                // log.debug('recordtype:internalid', record_type + ':' + value.id);

                record.delete({
                    type: record.Type.INVOICE,
                    id: value.id,
                });

            } catch (error) {

                log.debug('error', error);

            }
        }

        function createRecordSearch() {

            var transactionSearchObj = search.create({
                type: "transaction",
                settings: [{ "name": "consolidationtype", "value": "ACCTTYPE" }, { "name": "includeperiodendtransactions", "value": "F" }],
                filters:
                    [
                        ["type", "anyof", "CustInvc"],
                        "AND",
                        ["location", "anyof", "7"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["trandate", "onorbefore", "10/31/2024"],
                        "AND",
                        ["subsidiary", "anyof", "3"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "trandate", label: "Date" }),
                        search.createColumn({ name: "tranid", label: "Document Number" }),
                        search.createColumn({ name: "entity", label: "Name" }),
                        search.createColumn({ name: "account", label: "Account" }),
                        search.createColumn({ name: "memo", label: "Memo" }),
                        search.createColumn({ name: "amount", label: "Amount" }),
                        search.createColumn({ name: "recordtype", label: "Record Type" })
                    ]
            });

            return transactionSearchObj;

        }

        return {
            getInputData: getInputData,
            reduce: reduce,
        };
    }
);