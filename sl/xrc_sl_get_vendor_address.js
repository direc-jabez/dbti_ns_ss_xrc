/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/format', 'N/record'],

    function (format, record) {

        const ADDRESS_SUBLIST_ID = 'addressbook';
        const DEFAULT_BILLING_SUBLIST_FIELD_ID = 'defaultbilling';
        const LABEL_SUBLIST_FIELD_ID = 'label';

        function onRequest(context) {

            try {
                var params = context.request.parameters;

                var vendor_id = params.vendor_id;

                var vendor_address = getVendorAddress(vendor_id);

                var response = '<#assign vendor_address="' + vendor_address + '"/>';

                context.response.writeLine(response);

            } catch (error) {

                log.debug('error', error);

            }

        }

        function getVendorAddress(vendor_id) {

            var vendor_record = record.load({
                type: record.Type.VENDOR,
                id: vendor_id
            });

            var address_lines = vendor_record.getLineCount({ sublistId: ADDRESS_SUBLIST_ID });

            for (var line = 0; line < address_lines; line++) {

                var default_billing = vendor_record.getSublistValue({
                    sublistId: ADDRESS_SUBLIST_ID,
                    fieldId: DEFAULT_BILLING_SUBLIST_FIELD_ID,
                    line: line,
                });

                if (default_billing) {

                    var label = vendor_record.getSublistValue({
                        sublistId: ADDRESS_SUBLIST_ID,
                        fieldId: LABEL_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    return label;

                }

            }

        }

        return {
            onRequest: onRequest
        }
    }
);