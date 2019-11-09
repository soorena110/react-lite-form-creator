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

interface State {
    dateValue?: string;
    timeValue?: string;
}

export default class BoxDateTime extends React.Component<BoxDateTimeProps, State> {

    constructor(props: BoxDateTimeProps) {
        super(props);

        let timeValue = undefined;
        let dateValue = undefined;
        if (props.value)
            [dateValue, timeValue] = props.value.split('T');

        this.state = {
            timeValue: timeValue,
            dateValue: dateValue
        }
    }

    //#region Events

    _handleChangeDate(newValue: string) {
        const dateTimeValue = `${newValue}T${this.state.timeValue}`;
        if (this.props.onChange) {
            const e = {
                newValue: dateTimeValue
            };
            this.props.onChange(e);
        }
    }

    _handleChangeTime(newValue: string) {
        this.setState({timeValue: newValue});

        const dateTimeValue = `${this.state.dateValue}T${newValue}`;
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
        return <React.Fragment>
            <BoxDate name="date" label="تاریخ"
                     value={this.state.dateValue}
                     className={`${this.props.className} box-input-date-time-date`}
                     style={this.props.style}
                     hasError={this.props.hasError}
                     isDisabled={this.props.isDisabled}
                     onChange={e => this._handleChangeDate(e.newValue)}
            />
            <BoxTime name="time" label="زمان"
                     value={this.state.timeValue}
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
