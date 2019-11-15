import * as React from 'react';
import {default as BoxFieldByType} from "../BoxFieldByType";
import BoxFormMore from "./BoxFormMore";
import BoxFormFieldList from "./BoxFormFieldList";
import {default as BoxFormContent} from "./BoxFormContent";
import {standardizeValues, validateValues} from "./_utils";
import {BoxFormFieldProps} from "./propsModels";
import './style.css';

export interface BoxFormOuterProps<T = {}> {
    fields: BoxFormFieldProps<T>[];
}

interface Props extends BoxFormOuterProps {
    isEditForm?: boolean;
    onChange: (e: { newValue: any }) => void;
    values?: { [key: string]: any };
    inputErrorsKeys?: string[];
    extraData?: any;
}

interface State {
    styles: any;
}

export default class BoxForm extends React.Component<Props, State> {
    static standardizeValues = standardizeValues;
    static validateValues = validateValues;

    static defaultProps: Partial<Props> = {values: {}};

    constructor(props: Props) {
        super(props);
        this.state = {styles: {}}
    }

    componentDidMount() {
        this._callAllFieldsInits(this.props.values);
    }

    //#region APIs

    validate() {
        return validateValues(this.props.fields, this.props.values || {}, this._getAlgorithmEventArgs(), true);
    }

    //#endregion

    //#region Helpers

    private _getAlgorithmEventArgs(changingFieldName?: string) {
        return {
            changingFieldName: changingFieldName,
            values: this.props.values || {},
            styles: this.state.styles || {},
            extraData: {...this.props.extraData, isEditForm: this.props.isEditForm}
        };
    }

    //#endregion

    //#region Events


    private _callAllFieldsInits(values: any) {
        let hasAnyFieldDefinedOnChangeMethod = false;

        const e = this._getAlgorithmEventArgs();
        this.props.fields.forEach(input => {
            if (input.onInit) {
                input.onInit(e);
                hasAnyFieldDefinedOnChangeMethod = true;
            }
        });

        if (hasAnyFieldDefinedOnChangeMethod) {
            this.setState({styles: this.state.styles});
            this.props.onChange({newValue: values});
        }
    }

    private _handleFieldChange(field: BoxFormFieldProps, value: any) {
        (this.props.values as any)[field.name] = value;
        if ('onFieldChange' in field && field.onFieldChange) {
            const e = this._getAlgorithmEventArgs(field.name);
            field.onFieldChange(e);
        }
        this.props.onChange({newValue: this.props.values});
    }

    private _handleFlatChange(value: any) {
        this.props.onChange({newValue: value});
    }

    //#endregion

    //#region Render

    private _renderLeftSide(fieldProps: BoxFormFieldProps) {
        if (!fieldProps.leftSide) return;
        if (!Array.isArray(fieldProps.leftSide))
            fieldProps.leftSide = [fieldProps.leftSide];


        return fieldProps.leftSide.map(f => {
            const e = this._getAlgorithmEventArgs();
            if (f.onlyShowIf && !f.onlyShowIf(e))
                return;
            return <td key={f.name} style={f.style}>{this._renderFields(f)}</td>
        });
    }

    private _renderFields(fieldProps: BoxFormFieldProps) {

        if (!(this.props.values as any)[fieldProps.name] && !this.props.isEditForm &&
            'defaultValue' in fieldProps && fieldProps.defaultValue != undefined)
            (this.props.values as any)[fieldProps.name] = fieldProps.defaultValue;

        const commonProps = {
            value: (this.props.values as any)[fieldProps.name],
            hasError: this.props.inputErrorsKeys && this.props.inputErrorsKeys.indexOf(fieldProps.name) != -1,
            style: this.state.styles[fieldProps.name],
            extraData: this.props.extraData,
            label: fieldProps.labelBuilder ? fieldProps.labelBuilder(this._getAlgorithmEventArgs()) : fieldProps.label as string
        };

        switch (fieldProps.type) {
            case undefined:
                return;

            case 'content':
                return <BoxFormContent {...this.props} {...fieldProps} {...commonProps}
                                       onChange={(e: any) => this._handleFlatChange(e.newValue)}/>;

            case 'fieldlist':
                return <BoxFormFieldList {...fieldProps} {...commonProps}
                                         inputErrorsKeys={this.props.inputErrorsKeys}
                                         styles={this.state.styles[fieldProps.name]}
                                         style={this.state.styles[fieldProps.name + '.self']}
                                         menuStyle={this.state.styles[fieldProps.name + '.menu']}
                                         onChange={(e: any) => this._handleFieldChange(fieldProps, e.newValue)}/>;

            case 'more':
                return <BoxFormMore {...this.props} {...fieldProps} {...commonProps}
                                    inputErrorsKeys={this.props.inputErrorsKeys}
                                    styles={this.state.styles}
                                    values={this.props.values}
                                    onChange={(e: any) => this._handleFlatChange(e.newValue)}/>;

            default:
                return <BoxFieldByType {...fieldProps} {...commonProps}
                                       onChange={(e: any) => this._handleFieldChange(fieldProps, e.newValue)}/>
        }
    }

    render() {
        const e = this._getAlgorithmEventArgs();

        return <div className="box-form">
            {this.props.fields.map(f => {
                if (f.onlyShowIf && !f.onlyShowIf(e))
                    return;
                return <table key={f.name} cellSpacing={0}>
                    <tbody>
                    <tr>
                        <td style={f.style}>{this._renderFields(f)}</td>
                        {this._renderLeftSide(f)}
                    </tr>
                    </tbody>
                </table>
            })}
        </div>
    }

    //#endregion
}
