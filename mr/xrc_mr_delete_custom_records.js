/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jan 29, 2024
 * 
 */
define(['N/record', 'N/search'],

    function (record, search) {

        const CUSTOM_RECORD_TYPES = [
            'customrecord_ncfar_deprhistory',
        ];

        function getInputData(context) {

            return createSearch();

        }

        function map(context) {

            var value = JSON.parse(context.value);

            try {
                record.delete({
                    type: value.type,
                    id: value.id,
                });

            } catch (error) {

                log.debug('error', error);

            }

        }

        function createSearch() {

            var records = [];

            CUSTOM_RECORD_TYPES.forEach(custom_record_type => {

                var custom_record_search = search.create({
                    type: custom_record_type,
                    filters: [],
                    columns: [search.createColumn({ name: "internalid", label: "Internal ID" })]
                });

                var myPagedResults = custom_record_search.runPaged();

                myPagedResults.pageRanges.forEach(function (pageRange) {
                    var myPage = myPagedResults.fetch({ index: pageRange.index });
                    myPage.data.forEach(function (result) {
                        records.push({
                            type: result.recordType,
                            id: result.id,
                        });
                    });
                });
            });

            return records;
        }

        return {
            getInputData: getInputData,
            map: map,
        };
    }
);

// 'employee',