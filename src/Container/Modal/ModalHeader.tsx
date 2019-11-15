import * as React from "react";
import './ModalHeader.scss';

interface Props {
    theme?: 'balloon' | 'simple'

    className?: string;
    style?: React.CSSProperties;
}

export default class ModalHeader extends React.Component<Props> {
    static defaultProps = {
        theme: 'simple'
    };

    private _getClassByTheme() {
        let className = `modal-header modal-header-${this.props.theme} `;
        if (this.props.theme == 'balloon')
            className += (this.props.className || '');

        return className;
    }

    private _renderTriangle() {
        if (this.props.theme == 'balloon')
            return <div className={`modal-header-triangle ${this.props.className || ''}`}/>
    }

    render() {
        return <React.Fragment>
            <div className={this._getClassByTheme()}>
                {this.props.children}
            </div>
            {this._renderTriangle()}
        </React.Fragment>
    }
}
