import * as React from 'react';
import BoxInput from "./BoxInput";
import {DatePicker} from "react-persian-simple-calendar";
import * as ReactDOM from 'react-dom';
import './BoxDate.css';
import {BoxInputBaseProps} from "./BoxInput/_base";
import Persian from "persian-info";

export interface BoxDateProps extends BoxInputBaseProps {
    type?: 'date';
}

interface State {
    isInputFocused: boolean;
}

export default class BoxDate extends React.Component<BoxDateProps, State> {
    private _picker?: HTMLDivElement | null;
    private _inputBox: any;

    constructor(props: BoxDateProps) {
        super(props);

        this.state = {
            isInputFocused: false,
        };
    }

    componentDidMount() {
        this._setDatePickerPosition();
    }

    componentDidUpdate() {
        this._setDatePickerPosition();
    }

    //#region Helpers

    private _getJalaliValue() {
        if (!this.props.value)
            return '';
        const jalaliDate = Persian.date.convertDateTimeToJalali(this.props.value);
        return `${jalaliDate.year}/${jalaliDate.month}/${jalaliDate.day}`;
    }

    //#endregion

    //#region Events

    private _setDatePickerPosition() {
        if (!this._picker)
            return;

        const inputBoxDom = ReactDOM.findDOMNode(this._inputBox) as HTMLInputElement;
        const bound = inputBoxDom.getBoundingClientRect();

        this._picker.style.top = bound.top + 35 + 'px';
        this._picker.style.left = bound.left + 'px';
    }

    private _focusTimeout: any;

    private _handleFocus() {
        clearTimeout(this._focusTimeout);
        this.setState({isInputFocused: true});

        if (this.props.onFocus)
            this.props.onFocus({});
    }

    private _handleBlur() {
        this._focusTimeout = setTimeout(() => {
            this.setState({isInputFocused: false})
        }, 200);


        if (this.props.onBlur)
            this.props.onBlur({});
    }

    private _handleChange(newValue: string) {
        newValue = Persian.number.convertPersianNumberToEnglish(newValue);

        if (this.props.onChange) {
            const dateParts = newValue.split('/').map(v => parseInt(v));
            const date = Persian.date.convertJalaliToGregorian({
                year: dateParts[0],
                month: dateParts[1],
                day: dateParts[2]
            });

            const outDate = date.getFullYear() +
                '-' + date.getMonth().toString().padStart(2, '0') +
                '-' + date.getDate().toString().padStart(2, '0');

            this.props.onChange({newValue: outDate})
        }
    }

    //#endregion

    //#region Render

    private _renderDatePicker() {

        return <div ref={ref => this._picker = ref} className="box-input-date-picker"
                    style={{
                        display: this.state.isInputFocused ? undefined : 'none',
                        position: 'absolute'
                    }}>
            <div className="box-input-date-picker-inside">
                <DatePicker selectedDay={this._getJalaliValue()}
                            onDaySelected={e => {
                                this._handleChange(e.selectedDay);
                            }}
                            onBlur={() => this._handleBlur()}
                            onFocus={() => this._handleFocus()}/>
            </div>
        </div>
    }

    render() {
        const {type, ...rest} = this.props;
        return <BoxInput {...rest}
                         value={this._getJalaliValue()}
                         onChange={undefined}
                         onBlur={() => this._handleBlur()}
                         onKeyPress={undefined}
                         onFocus={() => this._handleFocus()}
                         htmlInputStyle={Object.assign({
                             textAlign: 'left',
                             direction: 'ltr'
                         }, this.props.htmlInputStyle)}
                         ref={ref => this._inputBox = ref}>

            {ReactDOM.createPortal(this._renderDatePicker(), document.body)}
        </BoxInput>
    }

    //#endregion
}
