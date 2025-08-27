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

            return createEscalationScheduleSearch();

        }

        function reduce(context) {

            try {

                var value = JSON.parse(context.values);

                var email_body = getEmailBody(value.legal_name);

                email.send({
                    author: value.author,
                    recipients: value.recipient,
                    subject: `Lease Escalation Reminder : ${value.legal_name}`,
                    body: email_body,
                });

            } catch (error) {

                log.debug('error', error);

            }
        }

        function createEscalationScheduleSearch() {

            var schedules = [];

            var escalation_schedule_search = search.create({
                type: "customrecord_xrc_escalation_schedule",
                filters:
                    [
                        ["custrecord_xrc_status7", "anyof", "2"],
                        "AND",
                        ["formulanumeric: ABS(TO_DATE(ADD_MONTHS({today}, 3))-TO_DATE({custrecord_xrc_esc_sched_billing_date}))", "equalto", "0"],
                        "AND",
                        ["custrecord_xrc_esc_sched_rental_esc", "greaterthan", "0"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "name", label: "ID" }),
                        search.createColumn({
                            name: "email",
                            join: "CUSTRECORD_XRC_TENANT7",
                            label: "Email"
                        }),
                        search.createColumn({
                            name: "custentity_xrc_legal_name",
                            join: "CUSTRECORD_XRC_TENANT7",
                            label: "Legal Name"
                        }),
                        search.createColumn({
                            name: "email",
                            join: "subsidiary",
                            label: "Email"
                        })
                    ]
            });

            escalation_schedule_search.run().each(function (result) {

                schedules.push({
                    internal_id: result.id,
                    author: result.getValue(result.columns[3]),
                    recipient: result.getValue(result.columns[1]),
                    legal_name: result.getValue(result.columns[2]),
                });

                return true;
            });

            return schedules;
        }

        function getEmailBody(legal_name) {

            var body = `Dear ${legal_name},

            Tes email body.
            
            Warm Regards,`;

            return body;

        }

        return {
            getInputData: getInputData,
            reduce: reduce,
        };
    }
);