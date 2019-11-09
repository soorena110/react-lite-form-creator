import * as React from "react";
import './BoxMenuAddNewItem.css';

export interface BoxMenuAddNewItemProps {
    placeHolder?: string;
    onSubmit: (event: { value: string }) => void;
}


interface State {
    isFocused: boolean;
    value: string;
}

export default class BoxMenuAddNewItem extends React.Component<BoxMenuAddNewItemProps, State> {
    constructor(props: BoxMenuAddNewItemProps) {
        super(props);
        this.state = {
            value: '',
            isFocused: false
        };
    }

    _submit() {
        this.setState({value: ''});
        this.props.onSubmit({value: this.state.value});
    }

    render() {
        return <span className="box-menu-add-form" onSubmit={() => this._submit()}>
            <input className="box-menu-add-form-input"
                   placeholder={this.props.placeHolder}
                   value={this.state.value}
                   onBlur={() => setTimeout(() => this.setState({isFocused: false}), 200)}
                   onFocus={() => this.setState({isFocused: true})}
                   onChange={e => this.setState({value: e.target.value})}
                   onKeyPress={e => e.key === 'Enter' ? this._submit() : undefined}/>
            <button onClick={() => this._submit()} className={`box-menu-add-form-button ${
                this.state.isFocused ? 'box-menu-add-form-button-visible' : 'box-menu-add-form-button-hidden'}`}>
            ذخیره
            </button>
        </span>
    }
}