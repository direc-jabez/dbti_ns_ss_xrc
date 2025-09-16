/**
 * Copyright © 2017, 2021 Oracle and/or its affiliates.
 *
 * @NScriptType suitelet
 * @NAPIVersion 2.1
 */
define([
    '../adapter/fam_adapter_format',
    '../adapter/fam_adapter_https',
    '../adapter/fam_adapter_record',
    '../adapter/fam_adapter_runtime',
    '../adapter/fam_adapter_search',
    '../util/fam_util_compound',
    '../util/fam_util_form',
    '../util/fam_util_process',
    '../util/fam_util_redirect',
    '../util/fam_util_search',
    '../util/fam_util_translator'
], function (format, https, record, runtime, search,
    utilCompound, utilForm, utilProcess, utilRedirect, utilSearch, utilTranslator) {

    const ARR_PARAMS = ['name',
        'altname',
        'custrecord_assettype',
        'custrecord_assetdepartment',
        'custrecord_assetclass',
        'custrecord_assetlocation',
        'custrecord_assetsubsidiary',
        'custrecord_assetvals.custrecord_slavelastdeprdate',
        'custrecord_assetdeprstartdate',
        'custrecord_is_compound'];
    var envCfg = {};

    var module = {
        screenName: 'pagestring',
        formDefinition: {},
        compoundDescendants: {}
    };

    module.init = function () {
        envCfg.isClassEnabled = runtime.isFeatureInEffect({ feature: 'CLASSES' });
        envCfg.isDeptEnabled = runtime.isFeatureInEffect({ feature: 'DEPARTMENTS' });
        envCfg.isLocEnabled = runtime.isFeatureInEffect({ feature: 'LOCATIONS' });
        envCfg.isOneWorld = runtime.isFeatureInEffect({ feature: 'SUBSIDIARIES' });
        envCfg.isMultiCurrency = runtime.isFeatureInEffect({ feature: 'MULTICURRENCY' });

        var transferTab = 'custpage_assettransfertab';
        this.formDefinition = {
            form: { title: utilTranslator.getString('custrecord_assettransfer_title', module.screenName) },
            csPath: '../cs/fam_cs_assettransfer.js',
            buttons: {
                refresh: {
                    id: 'refresh',
                    label: utilTranslator.getString('custrecord_assettransfer_refreshbutton', module.screenName),
                    functionName: 'reloadPage'
                },
                importcsv: {
                    id: 'importcsv',
                    label: utilTranslator.getString('custrecord_assettransfer_importcsv', module.screenName),
                    functionName: 'redirectToBulk'
                }
            },
            submits: {
                transfer: {
                    label: utilTranslator.getString('custrecord_assettransfer_transferbutton', module.screenName)
                }
            },
            tabs: {
                transferTab: {
                    id: transferTab,
                    label: utilTranslator.getString('custrecord_assettransfer_title', module.screenName)
                }
            },
            fields: {
                assetId: {
                    options: {
                        id: 'custpage_assetid',
                        label: utilTranslator.getString('custpage_assetid', module.screenName),
                        type: 'select',
                        source: 'customrecord_ncfar_asset'
                    },
                    displayType: 'normal',
                    value: null,
                    mandatory: true,
                    help: utilTranslator.getString('assettransfer_custpage_assetid_help', module.screenName)
                },
                transferDate: {
                    options: {
                        id: 'custpage_transferdate',
                        label: utilTranslator.getString('custpage_transferdate', module.screenName),
                        type: 'date'
                    },
                    displayType: 'normal',
                    mandatory: true,
                    help: utilTranslator.getString('custpage_transferdate_help', module.screenName)
                },
                assetDescription: {
                    options: {
                        id: 'custpage_assetdescription',
                        label: utilTranslator.getString('custpage_assetdescription', module.screenName),
                        type: 'text'
                    },
                    displayType: 'inline',
                    help: utilTranslator.getString('custpage_assetdescription_help', module.screenName)
                },
                assetSerialNo: {
                    options: {
                        id: 'custpage_assetserialno',
                        label: utilTranslator.getString('custpage_assetserialno', module.screenName),
                        type: 'text'
                    },
                    displayType: 'inline',
                    help: utilTranslator.getString('custpage_assetserialno_help', module.screenName)
                },
                assetAltNo: {
                    options: {
                        id: 'custpage_assetalternateno',
                        label: utilTranslator.getString('custpage_assetalternateno', module.screenName),
                        type: 'text'
                    },
                    displayType: 'inline',
                    help: utilTranslator.getString('custpage_assetalternateno_help', module.screenName)
                },
                assetType: {
                    options: {
                        id: 'custpage_assettype',
                        label: utilTranslator.getString('custpage_assettype', module.screenName),
                        type: 'select',
                        source: 'customrecord_ncfar_assettype'
                    },
                    displayType: 'inline',
                    help: utilTranslator.getString('assettransfer_custpage_assettype_help', module.screenName)
                },
                assetOrigCost: {
                    options: {
                        id: 'custpage_assetorigcost',
                        label: utilTranslator.getString('custpage_assetorigcost', module.screenName),
                        type: 'float'
                    },
                    displayType: 'inline',
                    help: utilTranslator.getString('custpage_assetorigcost_help', module.screenName)
                },
                assetNbv: {
                    options: {
                        id: 'custpage_assetnbv',
                        label: utilTranslator.getString('custpage_assetnbv', module.screenName),
                        type: 'float'
                    },
                    displayType: 'inline',
                    help: utilTranslator.getString('custpage_assetnbv_help', module.screenName)
                },
                assetLifetime: {
                    options: {
                        id: 'custpage_assetlifetime',
                        label: utilTranslator.getString('custpage_assetlifetime', module.screenName),
                        type: 'integer'
                    },
                    displayType: 'inline',
                    help: utilTranslator.getString('custpage_assetlifetime_help', module.screenName)
                },
                assetLastDepr: {
                    options: {
                        id: 'custpage_assetlastdepr',
                        label: utilTranslator.getString('custpage_assetlastdepr', module.screenName),
                        type: 'date'
                    },
                    displayType: 'inline',
                    help: utilTranslator.getString('custpage_assetlastdepr_help', module.screenName)
                },
                assetStatus: {
                    options: {
                        id: 'custpage_assetstatus',
                        label: utilTranslator.getString('custpage_assetstatus', module.screenName),
                        type: 'select',
                        source: 'customlist_ncfar_assetstatus'
                    },
                    displayType: 'inline',
                    help: utilTranslator.getString('custpage_assetstatus_help', module.screenName)
                },
                compoundDesc: {
                    options: {
                        id: 'custpage_compounddesc',
                        label: 'a',
                        type: 'longtext'
                    },
                    displayType: 'hidden'
                },
                componentOf: {
                    options: {
                        id: 'custpage_componentof',
                        label: 'a',
                        type: 'integer'
                    },
                    displayType: 'hidden'
                },
                isCompound: {
                    options: {
                        id: 'custpage_iscompound',
                        label: 'a',
                        type: 'checkbox'
                    },
                    displayType: 'hidden'
                },
                memo: {
                    options: {
                        id: 'custpage_memo',
                        label: 'Memo',
                        type: 'text'
                    },
                    displayType: 'normal'
                }
            }
        };

        if (envCfg.isDeptEnabled) {
            this.formDefinition.fields['assetDepartment'] = {
                options: {
                    id: 'custpage_assetdepartment',
                    label: utilTranslator.getString('custpage_assetdepartment', module.screenName),
                    type: 'select',
                    source: 'department'
                },
                displayType: 'inline',
                help: utilTranslator.getString('custpage_assetdepartment_help', module.screenName)
            };
            this.formDefinition.fields['newDepartment'] = {
                options: {
                    id: 'custpage_newdepartment',
                    label: utilTranslator.getString('custpage_newdepartment', module.screenName),
                    type: 'select',
                    source: 'department',
                    container: transferTab
                },
                displayType: 'normal',
                help: utilTranslator.getString('custpage_newdepartment_help', module.screenName)
            };
        }

        if (envCfg.isClassEnabled) {
            this.formDefinition.fields['assetClass'] = {
                options: {
                    id: 'custpage_assetclass',
                    label: utilTranslator.getString('custpage_assetclass', module.screenName),
                    type: 'select',
                    source: 'classification'
                },
                displayType: 'inline',
                help: utilTranslator.getString('custpage_assetclass_help', module.screenName)
            };
            this.formDefinition.fields['newClass'] = {
                options: {
                    id: 'custpage_newclass',
                    label: utilTranslator.getString('custpage_newclass', module.screenName),
                    type: 'select',
                    source: 'classification',
                    container: transferTab
                },
                displayType: 'normal',
                help: utilTranslator.getString('custpage_newclass_help', module.screenName)
            };
        }

        if (envCfg.isLocEnabled) {
            this.formDefinition.fields['assetLocation'] = {
                options: {
                    id: 'custpage_assetlocation',
                    label: utilTranslator.getString('custpage_assetlocation', module.screenName),
                    type: 'select',
                    source: 'location'
                },
                displayType: 'inline',
                help: utilTranslator.getString('custpage_assetlocation_help', module.screenName)
            };
            this.formDefinition.fields['newLocation'] = {
                options: {
                    id: 'custpage_newlocation',
                    label: utilTranslator.getString('custpage_newlocation', module.screenName),
                    type: 'select',
                    source: 'location',
                    container: transferTab
                },
                displayType: 'normal',
                help: utilTranslator.getString('custpage_newlocation_help', module.screenName)
            };
        }

        if (envCfg.isOneWorld) {
            this.formDefinition.fields['assetSubsidiary'] = {
                options: {
                    id: 'custpage_assetsubsidiary',
                    label: utilTranslator.getString('custpage_assetsubsidiary', module.screenName),
                    type: 'select',
                    source: 'subsidiary'
                },
                displayType: 'inline',
                help: utilTranslator.getString('custpage_assetsubsidiary_help', module.screenName)
            };
            this.formDefinition.fields['newSubsidiary'] = {
                options: {
                    id: 'custpage_newsubsidiary',
                    label: utilTranslator.getString('custpage_newsubsidiary', module.screenName),
                    type: 'select',
                    source: 'subsidiary',
                    container: transferTab
                },
                displayType: 'normal',
                mandatory: true,
                help: utilTranslator.getString('custpage_newsubsidiary_help', module.screenName)
            };
        }

        if (envCfg.isMultiCurrency) {
            this.formDefinition.fields['assetCurrency'] = {
                options: {
                    id: 'custpage_assetcurrency',
                    label: utilTranslator.getString('custpage_assetcurrency', module.screenName),
                    type: 'select',
                    source: 'currency'
                },
                displayType: 'inline',
                help: utilTranslator.getString('custpage_assetcurrency_help', module.screenName)
            };
        }

        this.formDefinition.fields['newAssetType'] = {
            options: {
                id: 'custpage_newassettype',
                label: utilTranslator.getString('custpage_newassettype', module.screenName),
                type: 'select',
                source: 'customrecord_ncfar_assettype',
                container: transferTab
            },
            displayType: 'normal',
            mandatory: true,
            help: utilTranslator.getString('custpage_newassettype', module.screenName)
        }
    };

    module.onRequest = function (params) {
        this.init();
        var formJSON, formObj, procId,
            request = params.request,
            response = params.response;

        if (request.method === https.getMethod('POST')) {
            procId = this.transfer(request.parameters);
            log.debug('procId', procId);
            if (procId) {
                utilRedirect.redirectToProcessSu();
            }
            return;
        }

        var assetID = request.parameters['custpage_p_assetid'];
        if (assetID) {
            this.loadAssetValues(assetID);
        }
        formObj = utilForm.createForm(this.formDefinition);
        response.writePage(formObj);
    };

    module.loadAssetValues = function (assetID) {
        var assetRec = record.load({
            type: 'customrecord_ncfar_asset',
            id: assetID
        });

        var assetValRec = record.load({
            type: 'customrecord_fam_assetvalues',
            id: assetRec.getValue({ fieldId: 'custrecord_assetvals' })
        });

        this.formDefinition.fields.assetId.value = assetID;

        this.formDefinition.fields.assetNbv.value = assetValRec.getValue({ fieldId: 'custrecord_slavebookvalue' });
        this.formDefinition.fields.assetDescription.value = assetRec.getValue({ fieldId: 'custrecord_assetdescr' });
        this.formDefinition.fields.assetSerialNo.value = assetRec.getValue({ fieldId: 'custrecord_assetserialno' });
        this.formDefinition.fields.assetAltNo.value = assetRec.getValue({ fieldId: 'custrecord_assetalternateno' });
        this.formDefinition.fields.assetOrigCost.value = assetRec.getValue({ fieldId: 'custrecord_assetcost' });
        this.formDefinition.fields.assetLifetime.value = assetRec.getValue({ fieldId: 'custrecord_assetlifetime' });
        this.formDefinition.fields.assetStatus.value = assetRec.getValue({ fieldId: 'custrecord_assetstatus' });
        this.formDefinition.fields.componentOf.value = assetRec.getValue({ fieldId: 'custrecord_componentof' });
        this.formDefinition.fields.isCompound.value = assetRec.getValue({ fieldId: 'custrecord_is_compound' }) ? 'T' : 'F';
        this.formDefinition.fields.assetType.value = assetRec.getValue({ fieldId: 'custrecord_assettype' });
        this.formDefinition.fields.newAssetType.value = assetRec.getValue({ fieldId: 'custrecord_assettype' });

        if (envCfg.isOneWorld) {
            this.formDefinition.fields.assetSubsidiary.value = assetRec.getValue({ fieldId: 'custrecord_assetsubsidiary' });
            this.formDefinition.fields.newSubsidiary.value = assetRec.getValue({ fieldId: 'custrecord_assetsubsidiary' });
        }
        if (envCfg.isClassEnabled) {
            this.formDefinition.fields.assetClass.value = assetRec.getValue({ fieldId: 'custrecord_assetclass' });
            this.formDefinition.fields.newClass.value = assetRec.getValue({ fieldId: 'custrecord_assetclass' });
        }
        if (envCfg.isDeptEnabled) {
            this.formDefinition.fields.assetDepartment.value = assetRec.getValue({ fieldId: 'custrecord_assetdepartment' });
            this.formDefinition.fields.newDepartment.value = assetRec.getValue({ fieldId: 'custrecord_assetdepartment' });
        }
        if (envCfg.isLocEnabled) {
            this.formDefinition.fields.assetLocation.value = assetRec.getValue({ fieldId: 'custrecord_assetlocation' });
            this.formDefinition.fields.newLocation.value = assetRec.getValue({ fieldId: 'custrecord_assetlocation' });
        }
        if (envCfg.isMultiCurrency) {
            this.formDefinition.fields.assetCurrency.value = assetRec.getValue({ fieldId: 'custrecord_assetcurrency' });
        }

        this.compoundDescendants = utilCompound.getDescendants([assetID], ARR_PARAMS);
        this.formDefinition.fields.assetLastDepr.value = this.getLastDeprDate(assetRec, assetValRec);
    };

    module.getLastDeprDate = function (assetRec, assetValRec) {
        var assetIdList = [assetRec.id];
        var lastDeprDate = assetValRec.getValue({ fieldId: 'custrecord_slavelastdeprdate' });
        var deprStartDate = assetRec.getValue({ fieldId: 'custrecord_assetdeprstartdate' });
        var isCompound = assetRec.getValue({ fieldId: 'custrecord_is_compound' });

        lastDeprDate = lastDeprDate ? format.stringToDate(lastDeprDate) : 0;
        deprStartDate = deprStartDate ? format.stringToDate(deprStartDate) : 0;
        var assetLastDeprDate = lastDeprDate > deprStartDate ? lastDeprDate : deprStartDate;

        // Cycle through compound-components only, their last depr date should be max in the tree
        if (isCompound) {
            this.formDefinition.fields.compoundDesc.value = JSON.stringify(this.compoundDescendants);
            for (compKey in this.compoundDescendants) {
                var component = this.compoundDescendants[compKey];
                if (component['custrecord_is_compound'] === 'T') {
                    var compDeprStartDate = component['custrecord_assetdeprstartdate'];
                    var compLastDeprDate = component['custrecord_assetvals.custrecord_slavelastdeprdate'];

                    compLastDeprDate = compLastDeprDate ? format.stringToDate(compLastDeprDate) : 0;
                    compDeprStartDate = compDeprStartDate ? format.stringToDate(compDeprStartDate) : 0;
                    var componentLastDeprDate = compLastDeprDate > compDeprStartDate ? compLastDeprDate : compDeprStartDate;

                    // Override asset last depr date with component's if greater
                    if (componentLastDeprDate > assetLastDeprDate) {
                        assetLastDeprDate = componentLastDeprDate;
                    }
                }
                else { // Store all components only for tax methods search later
                    assetIdList.push(compKey);
                }
            }
        }

        // Get max last depr date from tax methods
        var filters = [
            search.createFilter({ name: 'isinactive', operator: search.getOperator('IS'), values: 'F' }),
            search.createFilter({ name: 'custrecord_altdeprasset', operator: search.getOperator('ANYOF'), values: assetIdList })];

        var formula = 'CASE ' +
            'WHEN {custrecord_altdeprstartdeprdate} IS NULL THEN {custrecord_altdepr_assetvals.custrecord_slavelastdeprdate}' +
            'WHEN {custrecord_altdepr_assetvals.custrecord_slavelastdeprdate} IS NULL THEN {custrecord_altdeprstartdeprdate}' +
            'WHEN {custrecord_altdepr_assetvals.custrecord_slavelastdeprdate} > {custrecord_altdeprstartdeprdate} THEN {custrecord_altdepr_assetvals.custrecord_slavelastdeprdate}' +
            'ELSE {custrecord_altdeprstartdeprdate}' +
            'END';

        columns = [search.createColumn({
            name: 'formuladate',
            summary: search.getSummary('MAX'),
            formula: formula
        })];

        var searchRes = utilSearch.searchRecord('customrecord_ncfar_altdepreciation', null, filters, columns);
        var taxmLastDeprDate = searchRes[0].getValue({
            name: 'formuladate',
            summary: search.getSummary('MAX')
        });

        // Override asset last depr date with tax method's max's if greater
        taxmLastDeprDate = taxmLastDeprDate ? format.stringToDate(taxmLastDeprDate) : 0;
        if (taxmLastDeprDate > assetLastDeprDate) {
            assetLastDeprDate = taxmLastDeprDate;
        }

        return assetLastDeprDate ? format.dateToString(assetLastDeprDate) : '';
    };

    module.transfer = function (params) {
        for (f in this.formDefinition.fields) {
            var pageParamVal = params[this.formDefinition.fields[f].options.id];
            if (pageParamVal) this.formDefinition.fields[f].value = pageParamVal;
        }
        var userObj = runtime.getCurrentUser();
        var assetId = this.formDefinition.fields.assetId.value,
            transferDate = format.stringToDate(this.formDefinition.fields.transferDate.value).getTime(),
            lastDeprDate = this.formDefinition.fields.assetLastDepr.value,
            assets = [assetId],
            compoundComponents = [],
            recsToProcess = {};

        lastDeprDate = lastDeprDate ? format.stringToDate(lastDeprDate).getTime() : '';
        this.compoundDescendants = utilCompound.getDescendants([assetId], ARR_PARAMS);
        recsToProcess[assetId] = {};

        if (this.formDefinition.fields.newAssetType.value != this.formDefinition.fields.assetType.value) {
            recsToProcess[assetId].a = this.formDefinition.fields.newAssetType.value;
        }
        if (envCfg.isOneWorld && this.formDefinition.fields.newSubsidiary.value != this.formDefinition.fields.assetSubsidiary.value) {
            recsToProcess[assetId].s = this.formDefinition.fields.newSubsidiary.value;
        }
        if (envCfg.isClassEnabled && this.formDefinition.fields.newClass.value != this.formDefinition.fields.assetClass.value) {
            recsToProcess[assetId].c = this.formDefinition.fields.newClass.value || 'unset';
        }
        if (envCfg.isDeptEnabled && this.formDefinition.fields.newDepartment.value != this.formDefinition.fields.assetDepartment.value) {
            recsToProcess[assetId].d = this.formDefinition.fields.newDepartment.value || 'unset';
        }
        if (envCfg.isLocEnabled && this.formDefinition.fields.newLocation.value != this.formDefinition.fields.assetLocation.value) {
            recsToProcess[assetId].l = this.formDefinition.fields.newLocation.value || 'unset';
        }
        var retComponents = this.retrieveComponents();
        if (retComponents.componentsObj.length > 0) {
            assets = assets.concat(retComponents.componentsObj);
            compoundComponents = retComponents.compoundsObj;
        }
        recsToProcess[assetId].assets = assets;
        recsToProcess[assetId].ldd = lastDeprDate;
        if (compoundComponents.length > 0) {
            recsToProcess[assetId].cmpd = compoundComponents;
        }

        var processId = utilProcess.Record.create({
            procId: 'transfer',
            params: {
                jrnPermit: userObj.getPermission('TRAN_JOURNALAPPRV'),
                date: transferDate,
                recsToProcess: recsToProcess
            }
        });

        utilProcess.Control.invoke();

        return processId;
    };

    module.retrieveComponents = function () {
        var componentsObj = [];
        var compoundsObj = [];

        for (var i in this.compoundDescendants) {
            var comp = this.compoundDescendants[i];

            // Retrieve non-compound components only
            if (comp.custrecord_is_compound) {
                compoundsObj.push(+i);
            }
            else {
                componentsObj.push(+i);
            }
        }
        return {
            componentsObj: componentsObj,
            compoundsObj: compoundsObj
        };
    };

    return module;
});