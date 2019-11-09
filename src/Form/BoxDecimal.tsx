import * as React from 'react';
import {BoxInputBaseProps, KeyPressEvent} from "./BoxInput/_base";
import Persian from "persian-info";
import BoxInput from "./BoxInput";


const decimalIndicators = "/.";


export interface BoxDecimalProps extends BoxInputBaseProps {
    type?: 'decimal';
    maxLength?: number;
    hasSeparator?: false;
    hasNegativeValue?: boolean;
}

export default class BoxDecimal extends React.Component<BoxDecimalProps> {
    private _isDecimalValue(value: string) {
        return new RegExp(`^-?[0-9۰-۹]*[${decimalIndicators}]?[0-9۰-۹]*$`).test(value);
    }

    private _displayValue(): string | undefined {
        const {value} = this.props;
        if (this.props.hasSeparator === false)
            return value;
        if (value == undefined || value == '')
            return '';
        if (this.props.hasNegativeValue && value == '-')
            return value;
        if (isNaN(Number(value)))
            return "0";

        if (value == undefined)
            return '';

        return Persian.number.formatPrice(value);
    }

    private _getRefinedValue(newValue: string) {
        newValue = newValue.replace(/,/g, '');
        newValue = newValue.replace(new RegExp(`[${decimalIndicators}]`), '.');
        newValue = Persian.number.convertPersianNumberToEnglish(newValue);

        if (newValue == '-')
            return newValue;

        if (newValue.length > 0 && newValue[0] == '.')
            newValue = '0' + newValue;

        return newValue;
    }

    private _handleKeyPress(e: KeyPressEvent) {
        e.newValue = e.newValue.replace(/,/g, '');
        if (this.props.hasNegativeValue == undefined && e.newValue.indexOf('-') != -1) {
            e.preventDefault();
            return
        }
        if (!this._isDecimalValue(e.newValue)) {
            e.preventDefault();
            return;
        }

        if (this.props.onKeyPress)
            this.props.onKeyPress(e);
    }

    private _handleChangeValue(newValue: string) {
        if (this.props.onChange) {
            newValue = this._getRefinedValue(newValue);
            this.props.onChange({newValue});
        }
    }


    render() {

        const {type, ...boxInputProps} = this.props;

        return <BoxInput {...boxInputProps}
                         value={this._displayValue()}
                         onKeyPress={e => this._handleKeyPress(e)}
                         onChange={e => this._handleChangeValue(e.newValue)}
                         htmlInputStyle={Object.assign(this.props.htmlInputStyle || {}, {
                             textAlign: 'left',
                             direction: 'ltr'
                         })}
                         maxLength={15}
        />
    }
}
