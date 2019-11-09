import * as React from 'react';
import './style.css';

const LoadingImageSrc = require('./Loading.png');

type Props = {
    onClick?: () => void;
    isWide?: boolean;
    isLoading?: boolean;
    isDisabled?: boolean;

    style?: React.CSSProperties;
    className?: string;
}

export default class Button extends React.Component<Props> {
    static defaultProps: Partial<Props> = {
        className: 'gray'
    };

    private _getClassName() {
        let colorClassName = 'form-btn ';

        if (this.props.isWide)
            colorClassName += ' form-btn-wide';
        if (this.props.className)
            colorClassName += ' ' + this.props.className;

        if (this.props.isDisabled)
            colorClassName += ' disabled';

        return colorClassName;
    }

    private _handleClick() {
        if (!this.props.onClick || this.props.isDisabled)
            return;
        this.props.onClick()
    }

    private _renderContent() {
        if (this.props.isLoading)
            return <img src={LoadingImageSrc} className='form-btn-loading-spinner' alt=""/>;
        return this.props.children;
    }

    render() {
        return <button className={this._getClassName()}
                       style={this.props.style}
                       onClick={() => this._handleClick()}>
            {this._renderContent()}
        </button>
    }
}