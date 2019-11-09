import * as React from 'react';
import {BoxFormEventArgs} from "./eventsModels";
import './BoxFormFieldList.css';
import {BoxFormOuterProps, default as BoxForm} from "./";


export interface BoxFormFieldListProps<T = {}> extends BoxFormOuterProps<T> {
    type?: 'fieldlist';
    label: string;
    name: string;

    addButtonTitle?: string;
    checkCanAddRow?: (e: BoxFormEventArgs) => boolean;
}

interface Props extends BoxFormFieldListProps {
    value: any[];
    styles?: { [key: string]: React.CSSProperties };
    style?: React.CSSProperties;
    menuStyle?: React.CSSProperties;
    onChange: (e: { newValue: any }) => void;
    extraData?: any;
    inputErrorsKeys?: string[];
}

export default class BoxFormFieldList extends React.Component<Props> {

    constructor(props: Props) {
        super(props);

        this.state = {isFieldsVisible: false};
    }

    static defaultProps: Partial<Props> = {
        value: [],
        styles: {}
    };

    //#region Events

    private _removeSettingValue(valueIndex: number) {
        const value = this.props.value;
        value.splice(valueIndex, 1);

        this.props.onChange({newValue: value});
    }

    private _setSettingValue(valueIndex: number, newValues: object) {
        let value = this.props.value;

        if (!value) value = [];
        value[valueIndex] = newValues;

        this.props.onChange({newValue: value});
    }

    private _callFieldOnWillAddRow() {
        const e = this._getAlgorithmEventArgs('_content');
        if (this.props.checkCanAddRow)
            return this.props.checkCanAddRow(e);

        return true;
    }

    private _getAlgorithmEventArgs(changingFieldName?: string) {
        return {
            changingFieldName: changingFieldName,
            values: this.props.value || [],
            styles: this.props.styles || {},
            extraData: this.props.extraData
        };
    }

    //#endregion

    //#region Render

    private _renderAddRow() {
        return <div style={this.props.style} className={"box-form-field-list-row-add " +
        (this.props.checkCanAddRow && !this.props.checkCanAddRow(this._getAlgorithmEventArgs()) ? 'disabled' : '')}
                    onClick={() => {
                        if (this._callFieldOnWillAddRow())
                            this._setSettingValue(this.props.value.length || 0, {})
                    }}>
            {this.props.addButtonTitle || ('افزودن ' + this.props.label)}
        </div>
    }

    private _renderRows() {
        return this.props.value.map((listValue: any, ix: number) => (
            <div className="box-form-field-list-row" key={ix}
                 style={this.props.menuStyle}>
                <BoxForm {...this.props} values={listValue} onChange={e => this._setSettingValue(ix, e.newValue)}/>
                <span className="box-form-field-list-row-close"
                      onClick={() => this._removeSettingValue(ix)}>×</span>
            </div>
        ))
    }

    render() {
        return <React.Fragment>
            {this._renderAddRow()}
            {this._renderRows()}
        </React.Fragment>
    }

    //#endregion
}
