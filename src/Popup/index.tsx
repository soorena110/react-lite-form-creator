import * as React from "react";
import './style.css';
import * as ReactDOM from "react-dom";
import {BoundPosition, getPortalAbsolutePosition} from "../common/boundPosition";

export interface PopupProps {
    isVisible?: boolean;
    onClose?: () => void;
    closeOnBlur?: boolean;
    trigger?: React.ReactNode;
    className?: string;
    position?: BoundPosition;
    offset?: number | { horizonal?: number, vertical?: number };
    hasArrow?: boolean;
    size?: 'small' | 'medium' | 'large'
}

interface State {
    isVisible: boolean;
}

export default class Popup extends React.Component<PopupProps, State> {
    private _popupContent: any;
    private _trigger: any;
    private _shouldPreventClose = false;
    private _popUpDiv: any;

    constructor(props: PopupProps) {
        super(props);
        this.state = {
            isVisible: !!props.isVisible
        };
    }


    static defaultProps: Partial<PopupProps> = {
        offset: 0,
        position: "bottom center"
    };

    componentWillUpdate(nextProps: PopupProps): void {
        if (nextProps.isVisible != undefined && this.state.isVisible != nextProps.isVisible)
            this.setState({isVisible: nextProps.isVisible});
    }

    componentDidUpdate(prevProps: PopupProps, prevState: State) {
        if (prevState.isVisible != this.state.isVisible && this.state.isVisible)
            setTimeout(() => this._popUpDiv && this._popUpDiv.focus(), 10);

        this._setPosition()
    }


    private open() {
        if (this.props.isVisible == undefined)
            this.setState({isVisible: true});
    }

    close() {
        if (this._shouldPreventClose) {
            this._shouldPreventClose = false;
            return;
        }

        if (this.props.isVisible == undefined)
            this.setState({isVisible: false});

        if (this.props.onClose)
            this.props.onClose();
    }

    private _getOffsets() {
        const offset = this.props.offset;

        if (typeof offset == 'number')
            return {horizonal: offset, vertical: offset};
        if (typeof offset == 'object')
            return {horizonal: offset.horizonal || 0, vertical: offset.vertical || 0};
        return {horizonal: 0, vertical: 0}
    }

    private _setPosition() {
        const offset = this._getOffsets();


        if (this._popupContent && this._trigger) {
            const popupContent = ReactDOM.findDOMNode(this._popupContent) as HTMLDivElement;

            const pos = getPortalAbsolutePosition(this._trigger, this._popupContent, this.props.position);

            if (pos.top) popupContent.style.top = pos.top + offset.vertical + 'px';
            if (pos.right) popupContent.style.right = pos.right + offset.horizonal + 'px';
            if (pos.left) popupContent.style.left = pos.left + offset.horizonal + 'px';
            if (pos.bottom) popupContent.style.bottom = pos.bottom + offset.vertical + 'px';
        }
    }

    private _preventClose() {
        this._shouldPreventClose = true;
    }

    private _renderVisibleContent() {
        return <div ref={ref => this._popupContent = ref}
                    className={`popup-content popup-content-${this.props.size} ${this.props.className}`}
                    onClick={() => this._preventClose()}>
            {this.props.children}
        </div>
    }

    private _renderContent() {
        if (!this.state.isVisible)
            return;

        return ReactDOM.createPortal(
            <div className={this.props.closeOnBlur ? '' : 'popup-trigger'} ref={ref => this._popUpDiv = ref}
                 tabIndex={0} onKeyDown={e => e.key == 'Escape' && this.close()}
                 onClick={() => this.close()}>
                {this._renderVisibleContent()}
            </div>
            , document.body)
    }


    render() {
        return <React.Fragment>
            {this.props.trigger && <span onClick={() => this.open()} ref={ref => this._trigger = ref}>
                {this.props.trigger}
            </span>}
            {this._renderContent()}
        </React.Fragment>;
    }
}