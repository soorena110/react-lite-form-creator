import * as React from 'react';
import './BoxInput/style.scss';
import {BoxInputBaseProps, KeyPressEvent} from "./BoxInput/_base";
import BoxInput from "./BoxInput";
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
        newValue = this._getRecorrectedNumberValue(newValue);

        if (this.props.onChange) {
            const sp = newValue.split(':');
            newValue = sp.length >= 3 ? newValue : newValue + ':00';

            const e = {
                newValue: newValue
            };
            this.props.onChange(e);
        }
    }

    private static _isClockValue(value: string) {
        return /^([01۰۱]?[0-9۰-۹]?|[2۲]?[0-3۰-۳]?):?([0-5۰-۵]?[0-9۰-۹]?)$/.test(value);

    }

    private _getRecorrectedNumberValue(newValue: string) {
        newValue = Persian.number.convertPersianNumberToEnglish(newValue);

        const colonIndex = parseInt(newValue[0]) < 2 ? 2 : 1;
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


    //#endregion

    //#region Render

    render() {
        const valueParts = this.props.value && this.props.value.split(':');
        const {type, ...restProps} = this.props;

        const value = !valueParts || !valueParts.length ? undefined :
            (valueParts.length >= 3 ? valueParts[0] + ":" + valueParts[1] : valueParts[0]);

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
