/**
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/search', 'N/redirect', 'N/runtime', 'N/email'],

    function (record, search, redirect, runtime, email) {

        const SUBMIT_FOR_APPROVAL_ACTION_ID = 'submitforapproval';
        const APPROVE_ACTION_ID = 'approve';
        const REJECT_ACTION_ID = 'reject';
        const CANCEL_ACTION_ID = 'cancel';
        const FUND_REQUEST_RECORD_TYPE = 'customrecord_xrc_fund_request';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_fundreq_for_approval';
        const STATUS_FIELD_ID = 'custrecord_xrc_status';
        const PENDING_APPROVAL_STATUS = '1';
        const APPROVED_PENDING_ISSUANCE_STATUS = '2';
        const REJECTED_STATUS = '5';
        const CANCELLED_STATUS = '6';
        const APPROVAL_FOUR_FIELD_ID = 'custrecord_xrc_fundreq_approval4';
        const REJECT_FIELD_ID = 'custrecord_xrc_fundreq_rejected';
        const FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category';
        const REQUESTOR_FIELD_ID = 'custrecord_xrc_requestor';
        const REVOLVING_FUND_CATEGORY_ID = '2';
        const TRANID_NO_FIELD_ID = 'name';
        const SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary';
        const NOTIF_TYPE_REMINDER = 1;
        const NOTIF_TYPE_APPROVED = 2;
        const NOTIF_TYPE_REJECTED = 3;
        const PREPARED_BY_FIELD_ID = 'custrecord_xrc_prepared_by';
        const CASH_ADVANCE_CATEGORY_ID = '8';
        const FUND_TRANSFER_CATEGORY_ID = '10';


        function _get(context) {

            var action = context.action;

            var field = context.field;

            var role_to_email = context.role_to_email;

            try {
                var rec = record.load({
                    type: FUND_REQUEST_RECORD_TYPE,
                    id: context.id,
                    isDynamic: true,
                });

                var approval_status = rec.getValue(STATUS_FIELD_ID);

                var tran_id = rec.getValue(TRANID_NO_FIELD_ID);

                var subsidiary = rec.getValue(SUBSIDIARY_FIELD_ID);

                if (role_to_email) {

                    var employee_ids = getEmployeeIdsWithRole(role_to_email);

                }

                var prepared_by = rec.getValue(PREPARED_BY_FIELD_ID);

                if (action === SUBMIT_FOR_APPROVAL_ACTION_ID) {

                    rec.setValue(FOR_APPROVAL_FIELD_ID, true);

                    rec.setValue(REJECT_FIELD_ID, false);

                    if (approval_status === REJECTED_STATUS) {

                        rec.setValue(STATUS_FIELD_ID, PENDING_APPROVAL_STATUS);

                    }

                    sendEmail(context.id, tran_id, subsidiary, employee_ids);

                } else if (action === APPROVE_ACTION_ID) {

                    var fund_category = rec.getValue(FUND_CATEGORY_FIELD_ID);

                    if (fund_category === REVOLVING_FUND_CATEGORY_ID) {

                        var is_requestor_dept_head = isRequestorDepartmentHead(rec);

                        if (is_requestor_dept_head) fund_category += '-head';

                    }

                    rec.setValue(field, true);

                    rec.setValue(getApproverFieldId(field), runtime.getCurrentUser().id);

                    var final_approval_field = getFinalApprovalFieldByCategory(fund_category) || 'custrecord_xrc_fundreq_approval2';

                    if (field === final_approval_field) {

                        rec.setValue(STATUS_FIELD_ID, APPROVED_PENDING_ISSUANCE_STATUS);

                    }

                    sendEmail(context.id, tran_id, subsidiary, [prepared_by], NOTIF_TYPE_APPROVED);

                    if (employee_ids && field !== final_approval_field) {

                        sendEmail(context.id, tran_id, subsidiary, employee_ids);

                    }

                } else if (action === REJECT_ACTION_ID) {

                    rec.setValue(STATUS_FIELD_ID, REJECTED_STATUS);

                    rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                    rec.setValue(REJECT_FIELD_ID, true);

                    var fields = ['custrecord_xrc_fundreq_approval1', 'custrecord_xrc_fundreq_approval2', 'custrecord_xrc_fundreq_approval3', 'custrecord_xrc_fundreq_approval4'];

                    for (var i = 0; i < fields.length; i++) {

                        var isChecked = rec.getValue(fields[i]);

                        if (!isChecked) {

                            break;

                        }

                        rec.setValue(fields[i], false);

                    }

                    sendEmail(context.id, tran_id, subsidiary, [prepared_by], NOTIF_TYPE_REJECTED);

                } else if (action === CANCEL_ACTION_ID) {

                    rec.setValue(STATUS_FIELD_ID, CANCELLED_STATUS);

                    rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                    var fields = ['custrecord_xrc_fundreq_approval1', 'custrecord_xrc_fundreq_approval2', 'custrecord_xrc_fundreq_approval3', 'custrecord_xrc_fundreq_approval4'];

                    for (var i = 0; i < fields.length; i++) {

                        var isChecked = rec.getValue(fields[i]);

                        if (!isChecked) {

                            break;

                        }

                        rec.setValue(fields[i], false);

                    }
                }

                rec.save({
                    ignoreMandatoryFields: true,
                });

            } catch (error) {

                log.debug('error', error);

            }

            redirect.toRecord({
                type: FUND_REQUEST_RECORD_TYPE,
                id: context.id,
            });

        }

        function getApproverFieldId(field) {

            var approvers = {
                'custrecord_xrc_fundreq_approval1': 'custrecord_xrc_fundreq_approver1',
                'custrecord_xrc_fundreq_approval2': 'custrecord_xrc_fundreq_approver2',
                'custrecord_xrc_fundreq_approval3': 'custrecord_xrc_fundreq_approver3',
                'custrecord_xrc_fundreq_approval4': 'custrecord_xrc_fundreq_approver4',
            };

            return approvers[field];

        }

        function getFinalApprovalFieldByCategory(category) {

            var approval_field = {
                '8': 'custrecord_xrc_fundreq_approval4',
                '10': 'custrecord_xrc_fundreq_approval2',
                '11': 'custrecord_xrc_fundreq_approval2',
                '2-head': 'custrecord_xrc_fundreq_approval1',
                '2': 'custrecord_xrc_fundreq_approval2',
            };

            return approval_field[category];

        }

        function isRequestorDepartmentHead(newRecord) {

            var requestor = newRecord.getValue(REQUESTOR_FIELD_ID);

            var fieldLookUp = search.lookupFields({
                type: search.Type.EMPLOYEE,
                id: requestor,
                columns: ['custentity_xrc_dept_head']
            });

            return fieldLookUp.custentity_xrc_dept_head;

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

            var fromEmail = getEmailSender(subsidiary);

            var body = type === NOTIF_TYPE_REMINDER ?
                `Good day,<br /><br />
                The Fund Request is ready for your review and approval.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?id=${id}&rectype=1213&whence=><b>${tran_id}</b></a><br />
                Please review the details and approve at your earliest convenience. Let me know if you have any questions or require additional information.<br /><br />
                Best regards,`
                : type === NOTIF_TYPE_APPROVED ?
                    `Good day,<br /><br />
                The Fund Request has been approved.<br /><br />
                Details:<br /><br />    
                Reference Number: <a href=https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?id=${id}&rectype=1213&whence=><b>${tran_id}</b></a><br />
                If you have any questions, feel free to reach out.<br /><br />
                Best regards,`
                    :
                    `Good day,<br /><br />
                The Fund Request has been reviewed and rejected.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?id=${id}&rectype=1213&whence=><b>${tran_id}</b></a><br />
                If you have any questions or need further clarification, feel free to reach out.<br /><br />
                Best regards,`
                ;

            log.debug('params', [id, tran_id, subsidiary, recipients, type]);

            log.debug('body', body);

            // email.send({
            //     author: fromEmail,
            //     recipients: recipients,
            //     subject: type === NOTIF_TYPE_REMINDER ? 'Approval Needed: Fund Request' : type === NOTIF_TYPE_APPROVED ? 'Approval Notification: Fund Request' : 'Rejection Notification: Fund Request',
            //     body: body,
            // });

        }

        function getEmailSender(subsidiary) {

            var subsidiary_fieldLookUp = search.lookupFields({
                type: search.Type.SUBSIDIARY,
                id: subsidiary,
                columns: ['email']
            });

            return subsidiary_fieldLookUp.email;
        }

        return {
            get: _get,
        };

    }
);