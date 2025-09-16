/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 08, 2024
 * 
 */
define(['N/record', 'N/file', 'N/search', 'N/format'],

    function (record, file, search, format) {

        const CUSTOMER_FIELD_ID = 'customer';
        const DATE_FIELD_ID = 'trandate';

        function getInputData(context) {

            var file_obj = file.load({
                id: 'SuiteScripts/Opening Balance/XMDI_Open_Customer_Deposit_v2.csv'
            });

            var data = buildCustomerDepositJson(file_obj);

            return data;

        }

        function reduce(context) {

            try {

                var customer_deposit_rec = record.create({
                    type: record.Type.CUSTOMER_DEPOSIT
                });

                var customer_deposit_obj = JSON.parse(context.values);

                for (const key in customer_deposit_obj) {

                    var fieldId = key;

                    var value = customer_deposit_obj[key];

                    if (fieldId === CUSTOMER_FIELD_ID) {

                        var customer_internal_id = getCustomerInternalId(value);

                        if (customer_internal_id === 0) {

                            log.debug('customer', `${value} : ${getCustomerInternalId(value)}`);

                        }

                        value = getCustomerInternalId(value);

                    } else if (fieldId === DATE_FIELD_ID) {

                        value = format.parse({
                            type: format.Type.DATE,
                            value: value,
                        });

                    }

                    customer_deposit_rec.setValue(fieldId, value);

                }

                customer_deposit_rec.save({
                    ignoreMandatoryFields: true,
                });

            } catch (error) {

                log.debug('error', error);

            }
        }

        function buildCustomerDepositJson(file_obj) {

            var contents = file_obj.getContents();

            var lines = contents.split('\n');

            var headers = lines[0].split(',');

            var data = [];

            lines.forEach(function (line, index) {

                if (index > 0) {

                    var values = line.split(',');

                    var customer_deposit_obj = {};

                    headers.forEach((header, line) => {

                        try {

                            if (values[line]) {

                                customer_deposit_obj[header.replace(/\r/g, '')] = values[line].replace(/\r/g, '');

                            }

                        } catch (error) {

                        }

                    });

                    if (JSON.stringify(customer_deposit_obj) !== '{}') {

                        data.push(customer_deposit_obj);

                    }
                }

            });

            return data;

        }

        function getCustomerInternalId(customer_id) {

            var customer_internal_id = 0;

            var customer_search = search.create({
                type: "customer",
                filters:
                    [
                        ["entityid", "is", customer_id.trim()]
                    ],
                columns: []
            });

            customer_search.run().each(function (result) {
                customer_internal_id = result.id;
                return true;
            });

            return customer_internal_id;

        }

        return {
            getInputData: getInputData,
            reduce: reduce,
        };
    }
);