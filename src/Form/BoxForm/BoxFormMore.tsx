import * as React from 'react';
import BoxForm, {BoxFormOuterProps} from "./index";
import './BoxFormMore.css';


export interface BoxFormMoreProps<T = {}> extends BoxFormOuterProps<T> {
    type?: 'more';
    name: string;
    label: string;
}

interface Props extends BoxFormMoreProps {
    style?: React.CSSProperties;

    styles?: { [key: string]: React.CSSProperties };
    isEditForm?: boolean;
    onChange: (e: { newValue: any }) => void;
    values?: any;
    inputErrorsKeys?: string[];
    extraData?: any;
}

export default class BoxFormMore extends React.Component<Props> {

    static defaultProps: Partial<Props> = {
        values: {},
        styles: {}
    };

    _getFieldsVisibility() {
        return this.props.values['__' + this.props.name];
    }

    _setFieldsVisibility() {
        const areFieldsVisible = this._getFieldsVisibility();
        if (areFieldsVisible)
            return;

        this.props.values['__' + this.props.name] = true;
        this.props.onChange({newValue: this.props.values});
    }

    //#region Render

    render() {
        const areFieldsVisible = this._getFieldsVisibility();

        return <div style={this.props.style}>
            {areFieldsVisible ?
                <BoxForm {...this.props}/> :
                <span className="box-form-more" onClick={() => this._setFieldsVisibility()}>
                    {this.props.label}
                </span>
            }
        </div>
    }

    //#endregion
}
