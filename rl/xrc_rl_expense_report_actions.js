/**
*@NApiVersion 2.1
*@NScriptType Restlet
*
*To deploy
*/
define(['N/record', 'N/redirect', 'N/runtime', 'N/search'],

    function (record, redirect, runtime, search) {

        const SUBMIT_FOR_APPROVAL_ACTION_ID = 'submitforapproval';
        const APPROVE_ACTION_ID = 'approve';
        const REJECT_ACTION_ID = 'reject';
        const REQUESTOR_FIELD_ID = 'entity';
        const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const PENDING_APPROVAL_STATUS = '1';
        const APPROVED_STATUS = '2';
        const REJECTED_STATUS = '3';
        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const REJECT_FIELD_ID = 'custbody1';
        const EMP_TRAN_CATEGORY_FIELD_ID = 'custbody_xrc_emp_transact_category';
        const PCF_REPLEN_CATEGORY_ID = '1';
        const RF_REPLEN_CATEGORY_ID = '2';
        const CONSTRUCTION_FUND_CATEGORY_ID = '5';
        const TRANID_FIELD_ID = 'tranid';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const NOTIF_TYPE_REMINDER = 1;
        const NOTIF_TYPE_APPROVED = 2;
        const NOTIF_TYPE_REJECTED = 3;
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';


        function _get(context) {

            var action = context.action;

            var field = context.field;

            var rec = record.load({
                type: record.Type.EXPENSE_REPORT,
                id: context.id,
                isDynamic: true,
            });

            var approval_status = rec.getValue(APPROVAL_STATUS_FIELD_ID);

            var exp_category = rec.getValue(EMP_TRAN_CATEGORY_FIELD_ID);

            // var tran_id = rec.getValue(TRANID_FIELD_ID);

            // var subsidiary = rec.getValue(SUBSIDIARY_FIELD_ID);

            // if (role_to_email) {

            //     var employee_ids = getEmployeeIdsWithRole(role_to_email);

            // }

            // var prepared_by = rec.getValue(PREPARED_BY_FIELD_ID);

            if (exp_category === RF_REPLEN_CATEGORY_ID) {

                exp_category = 'others';

                var is_user_dept_head = isRequestorDepartmentHead(rec.getValue(REQUESTOR_FIELD_ID));

                if (is_user_dept_head) {

                    exp_category = '2-head';
                }

            } else if (exp_category !== PCF_REPLEN_CATEGORY_ID && exp_category !== CONSTRUCTION_FUND_CATEGORY_ID) {

                exp_category = 'others';

            }

            if (action === SUBMIT_FOR_APPROVAL_ACTION_ID) {

                rec.setValue(FOR_APPROVAL_FIELD_ID, true);

                rec.setValue(REJECT_FIELD_ID, false);

                if (approval_status === REJECTED_STATUS) {

                    rec.setValue(APPROVAL_STATUS_FIELD_ID, PENDING_APPROVAL_STATUS);

                }

                // sendEmail(context.id, tran_id, subsidiary, employee_ids);

            } else if (action === APPROVE_ACTION_ID) {

                rec.setValue(field, true);

                rec.setValue(getApproverFieldId(field, exp_category), runtime.getCurrentUser().id);

                var final_approval_field = getFinalApprovalFieldByCategory(exp_category);

                if (field === final_approval_field) {

                    rec.setValue(APPROVAL_STATUS_FIELD_ID, APPROVED_STATUS);

                }

                // sendEmail(context.id, tran_id, subsidiary, [prepared_by], NOTIF_TYPE_APPROVED);

                // if (employee_ids && field !== final_approval_field) {

                // sendEmail(context.id, tran_id, subsidiary, employee_ids);

                // }

            } else if (action === REJECT_ACTION_ID) {

                rec.setValue(APPROVAL_STATUS_FIELD_ID, REJECTED_STATUS);

                rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                rec.setValue(REJECT_FIELD_ID, true);

                var fields = ['custbody_xrc_approval1', 'custbody_xrc_approval2', 'custbody_xrc_approval3', 'custbody_xrc_approval4', 'custbody_xrc_approval5', 'custbody_xrc_approval6', 'custbody_xrc_approval7'];

                for (var i = 0; i < fields.length; i++) {

                    var approver_field = getApproverFieldId(fields[i], exp_category);

                    rec.setValue(approver_field, null);

                    rec.setValue(fields[i], false);

                }

                // sendEmail(context.id, tran_id, subsidiary, [prepared_by], NOTIF_TYPE_REJECTED);

            }

            rec.save({
                ignoreMandatoryFields: true,
            });

            redirect.toRecord({
                type: record.Type.EXPENSE_REPORT,
                id: context.id,
            });

        }

        function getApproverFieldId(field, category = null) {

            var approvers = {
                'custbody_xrc_approval1': 'custbody_xrc_approver1',
                'custbody_xrc_approval2': 'custbody_xrc_approver2',
                'custbody_xrc_approval3': category === 'others' ? 'custbody_xrc_checked_by' : 'custbody_xrc_approver3',
                'custbody_xrc_approval4': category === 'others' ? 'custbody_xrc_noted_by' : category === RF_REPLEN_CATEGORY_ID ? 'custbody_xrc_checked_by' : 'custbody_xrc_approver4',
                'custbody_xrc_approval5': category === PCF_REPLEN_CATEGORY_ID ? 'custbody_xrc_checked_by' : category === RF_REPLEN_CATEGORY_ID ? 'custbody_xrc_noted_by' : 'custbody_xrc_approver5',
                'custbody_xrc_approval6': category === PCF_REPLEN_CATEGORY_ID ? 'custbody_xrc_noted_by' : category === CONSTRUCTION_FUND_CATEGORY_ID ? 'custbody_xrc_checked_by' : 'custbody_xrc_approver6',
                'custbody_xrc_approval7': category === CONSTRUCTION_FUND_CATEGORY_ID ? 'custbody_xrc_noted_by' : 'custbody_xrc_approver7',
            };

            return approvers[field];

        }

        function getFinalApprovalFieldByCategory(category) {

            var approval_field = {
                '1': 'custbody_xrc_approval6',
                '2-head': 'custbody_xrc_approval5',
                '5': 'custbody_xrc_approval7',
                'others': 'custbody_xrc_approval4',
            };

            return approval_field[category];

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

            // var fromEmail = getEmailSender(subsidiary);

            var author = runtime.getCurrentUser().id;

            var body = type === NOTIF_TYPE_REMINDER ?
                `Good day,<br /><br />
                The Initial SOA Deposit is ready for your review and approval.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1228&id=${id}><b>${tran_id}</b></a><br />
                Please review the details and approve at your earliest convenience. Let me know if you have any questions or require additional information.<br /><br />
                Best regards,`
                : type === NOTIF_TYPE_APPROVED ?
                    `Good day,<br /><br />
                The Initial SOA Deposit has been approved.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1228&id=${id}><b>${tran_id}</b></a><br />
                If you have any questions, feel free to reach out.<br /><br />
                Best regards,`
                    :
                    `Good day,<br /><br />
                The Initial SOA Deposit has been reviewed and rejected.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1228&id=${id}><b>${tran_id}</b></a><br />
                If you have any questions or need further clarification, feel free to reach out.<br /><br />
                Best regards,`
                ;

            log.debug('body', body);

            // email.send({
            //     author: author,
            //     recipients: recipients,
            //     subject: type === NOTIF_TYPE_REMINDER ? 'Approval Needed: Initial SOA Deposit' : type === NOTIF_TYPE_APPROVED ? 'Approval Notification: Initial SOA Deposit' : 'Rejection Notification: Initial SOA Deposit',
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

        function isRequestorDepartmentHead(emp_id) {

            var fieldLookUp = search.lookupFields({
                type: search.Type.EMPLOYEE,
                id: emp_id,
                columns: ['custentity_xrc_dept_head']
            });

            return fieldLookUp.custentity_xrc_dept_head;

        }

        return {
            get: _get,
        };

    }
);