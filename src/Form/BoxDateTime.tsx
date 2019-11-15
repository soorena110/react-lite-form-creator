import * as React from 'react';
import BoxDate from "./BoxDate";
import BoxTime from "./BoxTime";
import './BoxDateTime.css';

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
        const [, timeValue] = this.props.value ? this.props.value.split('T') : [];

        const dateTimeValue = `${newValue}T${timeValue || ''}`;
        if (this.props.onChange) {
            const e = {
                newValue: dateTimeValue
            };
            this.props.onChange(e);
        }
    }

    _handleChangeTime(newValue: string) {
        const [dateValue] = this.props.value ? this.props.value.split('T') : [];

        const dateTimeValue = `${dateValue || ''}T${newValue}`;
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
