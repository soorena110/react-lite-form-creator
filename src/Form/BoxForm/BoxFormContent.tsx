import * as React from 'react';
import {BoxFormEventArgs} from "./eventsModels";

export interface BoxFormContentProps {
    type?: 'content';
    name: string;
    label?: string;

    onClick?: (e: BoxFormEventArgs) => void;
    render: (e: BoxFormEventArgs) => React.ReactNode;
}

interface Props extends BoxFormContentProps {
    style?: React.CSSProperties;
    styles?: { [key: string]: React.CSSProperties };
    isEditForm?: boolean;
    values?: { [fieldName: string]: any };
    extraData?: any;

    onChange: (e: { newValue: any }) => void;
}

export default class BoxFormContent extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
        this.state = {isFieldsVisible: false};
    }

    static defaultProps: Partial<Props> = {
        values: {},
        styles: {}
    };

    //#region Events

    private _callFieldOnClick() {
        const e = this._getAlgorithmEventArgs();
        if (this.props.onClick)
            this.props.onClick(e);
        this.props.onChange({newValue: e.values});
    }

    private _getAlgorithmEventArgs() {
        const values = this.props.values || {};
        return {
            changingFieldName: this.props.name,
            values,
            styles: this.props.styles || {},
            extraData: this.props.extraData
        };
    }

    //#endregion

    //#region Render

    render() {
        return <span onClick={() => this._callFieldOnClick()}
                     style={(this.props.styles || {})[this.props.name]}>
                    {this.props.render(this._getAlgorithmEventArgs())}
                </span>;
    }

    //#endregion
}
