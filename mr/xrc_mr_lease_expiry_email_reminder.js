/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 08, 2024
 * 
 */
define(['N/record', 'N/search', 'N/email'],

    function (record, search, email) {

        function getInputData(context) {

            return createSalesOrderSearch();

        }

        function reduce(context) {

            try {

                var value = JSON.parse(context.values);

                var email_body = getEmailBody(value.legal_name, value.lease_expiry, value.space);

                email.send({
                    author: value.author,
                    recipients: value.recipient,
                    cc: [value.cc],
                    subject: `Lease Expiry Reminder : ${value.legal_name} (${value.document_number})`,
                    body: email_body,
                });

            } catch (error) {

                log.debug('error', error);

            }
        }

        function createSalesOrderSearch() {

            var transactions = [];

            var sales_order_search = search.create({
                type: "salesorder",
                filters:
                    [
                        ["type", "anyof", "SalesOrd"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["status", "anyof", "SalesOrd:G", "SalesOrd:D", "SalesOrd:F", "SalesOrd:E", "SalesOrd:B"],
                        "AND",
                        [
                            ["formulanumeric: ABS(TO_DATE({custbody_xrc_lease_expiry})-TO_DATE({today}))", "equalto", "30"],
                            "OR",
                            ["formulanumeric: ABS(TO_DATE({custbody_xrc_lease_expiry})-TO_DATE({today}))", "equalto", "60"],
                            "OR",
                            ["formulanumeric: ABS(TO_DATE({custbody_xrc_lease_expiry})-TO_DATE({today}))", "equalto", "90"],
                        ]
                    ],
                columns:
                    [
                        search.createColumn({ name: "tranid", label: "Document Number" }),
                        search.createColumn({ name: "trandate", label: "Date" }),
                        search.createColumn({
                            name: "formulanumeric",
                            formula: "ABS(TO_DATE({custbody_xrc_lease_expiry})-TO_DATE({today}))",
                            label: "Days Difference"
                        }),
                        search.createColumn({
                            name: "email",
                            join: "customer",
                            label: "Email"
                        }),
                        search.createColumn({
                            name: "email",
                            join: "CUSTBODY_PSG_SAL_PH_PREPARED_BY",
                            label: "Email"
                        }),
                        search.createColumn({
                            name: "custentity_xrc_legal_name",
                            join: "customer",
                            label: "Legal Name"
                        }),
                        search.createColumn({ name: "custbody_xrc_lease_expiry", label: "Lease Expiry" }),
                        search.createColumn({
                            name: "altname",
                            join: "CUSTBODY_XRC_SPACE_NUM",
                            label: "Name"
                        }),
                        search.createColumn({
                            name: "email",
                            join: "subsidiary",
                            label: "Email"
                        })
                    ]
            });

            sales_order_search.run().each(function (result) {

                transactions.push({
                    internal_id: result.id,
                    document_number: result.getValue(result.columns[0]),
                    date: result.getValue(result.columns[1]),
                    days_diff: result.getValue(result.columns[2]),
                    author: result.getValue(result.columns[8]),
                    recipient: result.getValue(result.columns[3]),
                    cc: result.getValue(result.columns[4]),
                    legal_name: result.getValue(result.columns[5]),
                    lease_expiry: result.getValue(result.columns[6]),
                    space: result.getValue(result.columns[7]),
                });

                return true;
            });

            return transactions;
        }

        function getEmailBody(legal_name, lease_expiry, space) {

            var body = `Dear ${legal_name},

            We would like to remind you that the lease for Space No.: ${space} is set to expire on ${lease_expiry}.
            We recommend reviewing your options soon to ensure a smooth transition, whether you plan to renew your lease, discuss any adjustments, or explore other possibilities. If you would like to discuss renewal terms or have any questions regarding the next steps, please don’t hesitate to reach out.
            Thank you for being a valued tenant with us. We look forward to assisting you with your lease renewal or any other needs you may have.
            
            Warm Regards,`;

            return body;

        }

        return {
            getInputData: getInputData,
            reduce: reduce,
        };
    }
);