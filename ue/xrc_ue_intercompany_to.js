/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Oct 1, 2024
 * 
 */
define(['N/record', 'N/runtime', 'N/search', 'N/email'],

    function (record, runtime, search, email) {

        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const REJECTED_STATUS_ID = '3';
        const PREPARED_BY_FIELD_ID = 'employee';
        const TRANID_NO_FIELD_ID = 'tranid';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const NOTIF_TYPE_REMINDER = 1;
        const NOTIF_TYPE_APPROVED = 2;


        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var form = context.form;

            var currentUser = runtime.getCurrentUser();

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            if (context.type === context.UserEventType.VIEW) {

                var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

                var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                if (!for_approval && parseInt(prepared_by) === currentUser.id) {

                    // Adding button Submit for Aprpoval
                    form.addButton({
                        id: 'custpage_submit_for_approval',
                        label: approval_status === REJECTED_STATUS_ID ? 'Resubmit for Approval' : 'Submit for Approval',
                        functionName: 'onSubmitForApprovalBtnClick("1420")',
                    });

                }

                if (for_approval === false || currentUser.role !== 1420) { // 1420 => XRC - Purchasing Head

                    form.removeButton({
                        id: 'approve'
                    });

                    form.removeButton({
                        id: 'reject'
                    });


                }

            }

            form.clientScriptModulePath = './xrc_cs_intercompany_to.js';

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.APPROVE) {

                // sendEmail(newRecord.id, newRecord.getValue(TRANID_NO_FIELD_ID), newRecord.getValue(SUBSIDIARY_FIELD_ID), [newRecord.getValue(PREPARED_BY_FIELD_ID)], NOTIF_TYPE_APPROVED);

            }

        }

        function sendEmail(id, tran_id, subsidiary, recipients, type = NOTIF_TYPE_REMINDER) {

            log.debug('params', [id, tran_id, subsidiary, recipients, type]);

            var fromEmail = getEmailSender(subsidiary);

            var url = record_type === "transferorder" ? `https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1228&id=${id}` : `https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1228&id=${id}&icto=T`;

            var body = type === NOTIF_TYPE_REMINDER ?
                `Good day,<br /><br />
                The Transfer Order is ready for your review and approval.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=${url}><b>${tran_id}</b></a><br />
                Please review the details and approve at your earliest convenience. Let me know if you have any questions or require additional information.<br /><br />
                Best regards,`
                : type === NOTIF_TYPE_APPROVED ?
                    `Good day,<br /><br />
                The Transfer Order has been approved.<br /><br />
                Details:<br /><br />    
                Reference Number: <a href=${url}><b>${tran_id}</b></a><br />
                If you have any questions, feel free to reach out.<br /><br />
                Best regards,`
                    :
                    `Good day,<br /><br />
                The Transfer Order has been reviewed and rejected.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=${url}><b>${tran_id}</b></a><br />
                If you have any questions or need further clarification, feel free to reach out.<br /><br />
                Best regards,`
                ;

            log.debug('body', body);

            // email.send({
            //     author: fromEmail,
            //     recipients: recipients,
            //     subject: type === NOTIF_TYPE_REMINDER ? 'Approval Needed: Transfer Order' : type === NOTIF_TYPE_APPROVED ? 'Approval Notification: Transfer Order' : 'Rejection Notification: Transfer Order',
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
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);