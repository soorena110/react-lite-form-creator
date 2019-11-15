import {BoxFormEventArgs} from "./eventsModels";
import {BoxFormFieldProps} from "./propsModels";

export const standardizeValues = (fields: BoxFormFieldProps[], values: { [fieldName: string]: any }) => {
    const newValues = {} as { [key: string]: any };
    fields.forEach(f => {

        const value = values[f.name];

        switch (f.type) {
            case 'integer':
            case 'decimal':
                if (value != undefined)
                    newValues[f.name] = Number(value);
                break;

            case 'string':
            case 'password':
            case 'dropdown':
            case 'date':
            case 'time':
            case 'datetime':
            case 'searcher':
                if (value != undefined)
                    newValues[f.name] = value;
                break;

            case 'boolean':
                if (value != undefined)
                    newValues[f.name] = Boolean(value);
                break;

            case 'more':
                const moreVals = standardizeValues(f.fields, values);
                Object.keys(moreVals).forEach(k => newValues[k] = moreVals[k]);
                break;

            case "fieldlist":
                newValues[f.name] = value && value.map((row: any) => standardizeValues(f.fields, row));
                break;

            case 'content':
                break;
            default:
                throw `The type '${f.type}' is not supported.`;
        }
    });
    return newValues
};


export const validateValues = (fields: BoxFormFieldProps[], values: { [fieldName: string]: any },
                               eventArgsPartial: Partial<BoxFormEventArgs>, shouldStandardize = false) => {
    if (shouldStandardize)
        values = standardizeValues(fields, values);

    const ret_errors: { [fieldName: string]: string } = {};

    const eventArgs: BoxFormEventArgs = {
        values: eventArgsPartial.values || values,
        styles: eventArgsPartial.styles || {},
        extraData: eventArgsPartial.extraData || {}
    };
    fields.forEach(f => {
        if (f.onlyShowIf && !f.onlyShowIf(eventArgs))
            return;

        let value = values[f.name];
        const label = f.labelBuilder ? f.labelBuilder(eventArgs) : f.label;

        switch (f.type) {
            case 'integer':
            case 'decimal':
            case 'string':
            case 'password':
            case 'dropdown':
            case 'searcher':
            case 'date':
            case 'time':
            case 'datetime':
            case 'boolean':
                if (f.validation) {
                    if (f.validation.isRequired && value == undefined)
                        ret_errors[f.name] = `${label} پر نشده است.`;

                    if (f.validation.minValue != undefined && value < f.validation.minValue)
                        ret_errors[f.name] = `${label} باید بیشتر یا مساوی ${f.validation.minValue || 'صفر'} باشد.`;
                    if (f.validation.absoluteMinValue != undefined && value <= f.validation.absoluteMinValue)
                        ret_errors[f.name] = `${label} باید بیشتر از ${f.validation.absoluteMinValue || 'صفر'} باشد.`;

                    if (f.validation.maxValue != undefined && value < f.validation.maxValue)
                        ret_errors[f.name] = `${label} باید کمتر یا مساوی ${f.validation.maxValue || 'صفر'} باشد.`;
                    if (f.validation.absoluteMaxValue != undefined && value <= f.validation.absoluteMaxValue)
                        ret_errors[f.name] = `${label} باید کمتر از ${f.validation.absoluteMaxValue || 'صفر'} باشد.`;

                    if (f.validation.otherValidations)
                        f.validation.otherValidations.forEach(v => {
                            if (v.conditionChecker(eventArgs))
                                ret_errors[f.name] = 'messageBuilder' in v ? v.messageBuilder(eventArgs) : v.message;
                        });
                }
                break;

            case 'more':
                const errors = validateValues(f.fields, values, eventArgsPartial);
                Object.keys(errors).forEach(k => ret_errors[k] = errors[k]);
                break;

            case 'content':
            default:
                break;
        }
    });
    return ret_errors
};