/**
 * 
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/redirect', 'N/runtime', 'N/search'],

    function (record, redirect, runtime, search) {

        const INITIAL_SOA_RECORD_TYPE_ID = 'customrecord_xrc_initial_soa';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_isoa_for_approval';
        const SUBMIT_FOR_APPROVAL_ACTION_ID = 'submitforapproval';
        const APPROVE_ACTION_ID = 'approve';
        const REJECT_ACTION_ID = 'reject';
        const STATUS_FIELD_ID = 'custrecord_xrc_approval_status4';
        const PENDING_APPROVAL_STATUS = '1';
        const APPROVED_STATUS = '2';
        const PAID_STATUS = '3';
        const REJECT_STATUS = '4';
        const APPROVAL_THREE_FIELD_ID = 'custrecord_xrc_isoa_approval3';
        const REJECT_FIELD_ID = 'custrecord_xrc_isoa_rejected';
        const ENTRY_NO_FIELD_ID = 'tranid';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const NOTIF_TYPE_REMINDER = 1;
        const NOTIF_TYPE_APPROVED = 2;
        const NOTIF_TYPE_REJECTED = 3;
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';
        const TOTAL_AMOUNT_DUE_FIELD_ID = 'custrecord_total_amount_due';


        function _get(context) {

            var action = context.action;

            var field = context.field;

            var role_to_email = context.role_to_email;

            try {

                // Loading Initial SOA record
                var rec = record.load({
                    type: INITIAL_SOA_RECORD_TYPE_ID,
                    id: context.id,
                    isDynamic: true,
                });

                var approval_status = rec.getValue(STATUS_FIELD_ID);

                var tran_id = rec.getValue(ENTRY_NO_FIELD_ID);

                var subsidiary = rec.getValue(SUBSIDIARY_FIELD_ID);

                if (role_to_email) {

                    var employee_ids = getEmployeeIdsWithRole(role_to_email);

                }

                var prepared_by = rec.getValue(PREPARED_BY_FIELD_ID);

                if (action === SUBMIT_FOR_APPROVAL_ACTION_ID) {

                    rec.setValue(FOR_APPROVAL_FIELD_ID, true);

                    if (approval_status === REJECT_STATUS) {

                        rec.setValue(STATUS_FIELD_ID, PENDING_APPROVAL_STATUS);

                        rec.setValue(REJECT_FIELD_ID, false);

                    }

                    sendEmail(context.id, tran_id, subsidiary, employee_ids);

                } else if (action === APPROVE_ACTION_ID) {

                    rec.setValue(field, true);

                    rec.setValue(getApproverFieldId(field), runtime.getCurrentUser().id);

                    if (field === APPROVAL_THREE_FIELD_ID) {

                        var total_amount_due = rec.getValue(TOTAL_AMOUNT_DUE_FIELD_ID);

                        if (!total_amount_due) {

                            rec.setValue(STATUS_FIELD_ID, PAID_STATUS);

                        } else {

                            rec.setValue(STATUS_FIELD_ID, APPROVED_STATUS);

                        }

                    }

                    sendEmail(context.id, tran_id, subsidiary, [prepared_by], NOTIF_TYPE_APPROVED);

                    if (employee_ids && field !== APPROVAL_THREE_FIELD_ID) {

                        sendEmail(context.id, tran_id, subsidiary, employee_ids);

                    }

                } else if (action === REJECT_ACTION_ID) {

                    rec.setValue(STATUS_FIELD_ID, REJECT_STATUS);

                    rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                    rec.setValue(REJECT_FIELD_ID, true);

                    var fields = ['custrecord_xrc_isoa_approval1', 'custrecord_xrc_isoa_approval2', 'custrecord_xrc_isoa_approval3'];

                    for (var i = 0; i < fields.length; i++) {

                        var isChecked = rec.getValue(fields[i]);

                        if (!isChecked) {

                            break;

                        }

                        rec.setValue(fields[i], false);

                    }

                    sendEmail(context.id, tran_id, subsidiary, [prepared_by], NOTIF_TYPE_REJECTED);

                }

                rec.save({
                    ignoreMandatoryFields: true,
                });

            } catch (error) {

                log.debug('error', error);

            }

            redirect.toRecord({
                type: INITIAL_SOA_RECORD_TYPE_ID,
                id: context.id,
            });

        }


        function getApproverFieldId(field) {

            var approvers = {
                'custrecord_xrc_isoa_approval1': 'custrecord_xrc_checked_by4',
                'custrecord_xrc_isoa_approval2': 'custrecord_xrc_noted_by4',
                'custrecord_xrc_isoa_approval3': 'custrecord_xrc_isoa_approvedby',
            };

            return approvers[field];

        }

        function getEmployeeIdsWithRole(role) {

            var employee_ids = [];

            var employee_search = search.create({
                type: "employee",
                filters:
                    [
                        ["role", "anyof", role],
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" })
                    ]
            });

            var search_result = employee_search.run();

            var results = search_result.getRange({
                start: 0,
                end: 8,
            });

            for (var i = 0; i < results.length; i++) {

                employee_ids.push(results[i].id);

            }

            return employee_ids;

        }

        function sendEmail(id, tran_id, subsidiary, recipients, type = NOTIF_TYPE_REMINDER) {

            var author = runtime.getCurrentUser().id;

            var body = type === NOTIF_TYPE_REMINDER ?
                `Good day,<br /><br />
                The Initial SOA is ready for your review and approval.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1222&id=${id}><b>${tran_id}</b></a><br />
                Please review the details and approve at your earliest convenience. Let me know if you have any questions or require additional information.<br /><br />
                Best regards,`
                : type === NOTIF_TYPE_APPROVED ?
                    `Good day,<br /><br />
                The Initial SOA has been approved.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1222&id=${id}><b>${tran_id}</b></a><br />
                If you have any questions, feel free to reach out.<br /><br />
                Best regards,`
                    :
                    `Good day,<br /><br />
                The Initial SOA has been reviewed and rejected.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1222&id=${id}><b>${tran_id}</b></a><br />
                If you have any questions or need further clarification, feel free to reach out.<br /><br />
                Best regards,`
                ;

            log.debug('body', body);
            // email.send({
            //     author: fromEmail,
            //     recipients: recipients,
            //     subject: type === NOTIF_TYPE_REMINDER ? 'Approval Needed: Initial SOA' : type === NOTIF_TYPE_APPROVED ? 'Approval Notification: Initial SOA' : 'Rejection Notification: Initial SOA',
            //     body: body,
            // });

        }

        return {
            get: _get,
        };
    }
);
