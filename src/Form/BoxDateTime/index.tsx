import * as React from 'react';
import BoxDate from "./BoxDate";
import BoxTime from "./BoxTime";
import './style.css';

export interface BoxDateTimeProps {
    type?: 'datetime';
    name: string;
    label?: string; // not used !
    value?: string;
    onChange?: (e: { newValue: string }) => void;

    isDisabled?: boolean;
    hasError?: boolean;
    className?: string;
    style?: React.CSSProperties;
}


export default class BoxDateTime extends React.Component<BoxDateTimeProps> {
    //#region Events

    _handleChangeDate(newValue: string) {
        const [dateValue, timeValue] = this.props.value ? this.props.value.split('T') : [];

        if (dateValue == newValue)
            return;

        this._handleChange(newValue, timeValue);
    }

    _handleChangeTime(newValue: string) {
        const [dateValue, timeValue] = this.props.value ? this.props.value.split('T') : [];

        if (timeValue == newValue)
            return;

        if (newValue.split(':').length >= 2)
            newValue = newValue + ':00';

        this._handleChange(dateValue, newValue)
    }

    private _handleChange(dateValue: string = '', timeValue: string = '') {
        let dateTimeValue = dateValue || timeValue;
        if (dateValue && timeValue)
            dateTimeValue = `${dateValue || ''}T${timeValue}`;

        if (this.props.onChange) {
            const e = {
                newValue: dateTimeValue
            };
            this.props.onChange(e);
        }
    }

    //#endregion

    //#region Render

    render() {
        const [dateValue, timeValue] = this.props.value ? this.props.value.split('T') : [];

        return <React.Fragment>
            <BoxDate name="date" label="تاریخ"
                     value={dateValue}
                     className={`${this.props.className} box-input-date-time-date`}
                     style={this.props.style}
                     hasError={this.props.hasError}
                     isDisabled={this.props.isDisabled}
                     onChange={e => this._handleChangeDate(e.newValue)}
            />
            <BoxTime name="time" label="زمان"
                     value={timeValue}
                     className={`${this.props.className} box-input-date-time-time`}
                     style={this.props.style}
                     hasError={this.props.hasError}
                     isDisabled={this.props.isDisabled}
                     onChange={e => this._handleChangeTime(e.newValue)}
            />
        </React.Fragment>
    }

    //#endregion
}
