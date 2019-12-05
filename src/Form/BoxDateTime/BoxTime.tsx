import * as React from 'react';
import '../BoxInput/style.scss';
import {BoxInputBaseProps, KeyPressEvent} from "../BoxInput/_base";
import BoxInput from "../BoxInput";
import Persian from "persian-info";

export interface BoxTimeInputProps extends BoxInputBaseProps {
    type?: 'time';
}

export default class BoxTime extends React.Component<BoxTimeInputProps> {

    //#region Events

    _handleBlur() {
        const sp = this.props.value && this.props.value.split(':');
        const normalValue = sp && (sp[0].length == 2 ? sp[0] : '0' + sp[0]) + ':' + (sp[1].length == 2 ? sp[1] : '0' + sp[1]);
        this._handleChangeValue(normalValue || '');
        if (this.props.onBlur)
            this.props.onBlur({});
        this.setState({isFocused: false});

        if (this.props.onBlur)
            this.props.onBlur({});
    }

    _handleFocus() {
        this.setState({isFocused: true});

        if (this.props.onFocus)
            this.props.onFocus({});
    }

    private _handleChangeValue(newValue: string) {
        newValue = BoxTime._getRecorrectedNumberValue(newValue);
        const prevValue = BoxTime._getRecorrectedNumberValue(this.props.value || '');
        if (newValue == prevValue)
            return;

        if (this.props.onChange) {
            const e = {
                newValue: newValue
            };
            this.props.onChange(e);
        }
    }

    private static _isClockValue(value: string) {
        return /^([01۰۱]?[0-9۰-۹]?|[2۲]?[0-3۰-۳]?):?([0-5۰-۵]?[0-9۰-۹]?)$/.test(value);
    }

    private static _getRecorrectedNumberValue(newValue: string) {
        newValue = Persian.number.convertPersianNumberToEnglish(newValue);

        const colonIndex = parseInt(newValue[0]) < 2 ? 2 : newValue[1] && parseInt(newValue[1]) < 4 ? 2 : 1;
        if (newValue.length > colonIndex && newValue.indexOf(':') == -1) {
            newValue = newValue.substr(0, colonIndex) + ':' +
                newValue.substr(colonIndex, newValue.length - colonIndex);
        }

        return newValue;
    }

    private _handleKeyPress(e: KeyPressEvent) {
        if (!BoxTime._isClockValue(e.newValue)) {
            e.preventDefault();
            return;
        }

        if (this.props.onKeyPress)
            this.props.onKeyPress(e);
    }

    _getValue() {
        const valueParts = this.props.value && this.props.value.split(':');
        if (!valueParts || !valueParts.length)
            return '';
        if (valueParts.length >= 2)
            return valueParts[0] + ":" + valueParts[1];
        return this.props.value;
    }

    //#endregion

    //#region Render

    render() {
        const {type, ...restProps} = this.props;
        const value = this._getValue();

        return <BoxInput {...restProps}
                         value={value} maxLength={5}
                         onFocus={() => this._handleFocus()}
                         onKeyPress={e => this._handleKeyPress(e)}
                         onBlur={() => this._handleBlur()}
                         htmlInputStyle={Object.assign({
                             textAlign: 'left',
                             direction: 'ltr'
                         }, this.props.htmlInputStyle)}
                         onChange={e => this._handleChangeValue(e.newValue)}/>
    }

    //#endregion
}
