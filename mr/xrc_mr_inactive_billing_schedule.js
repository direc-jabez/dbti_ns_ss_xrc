/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 08, 2024
 * 
 */
define(['N/record', 'N/search'],

    function (record, search) {

        function getInputData(context) {

            return cust_search;

        }

        function reduce(context) {

            try {

                var value = JSON.parse(context.values);


            } catch (error) {

                log.debug('error', error);

            }
        }

        return {
            getInputData: getInputData,
            reduce: reduce,
        };
    }
);