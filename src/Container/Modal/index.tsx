import * as React from "react";
import {ReactNode} from "react";
import * as ReactDOM from "react-dom";
import ModalHeader from "./ModalHeader";
import ModalBody from "./ModalBody";
import ModalFooter from "./ModalFooter";
import './style.scss';

const CloseIcon = require('./window-close.svg').default;

type ChildType = React.ReactElement<ModalBody | ModalHeader | ModalFooter>;

interface Props {
    isVisible?: boolean;
    onCloseModal?: () => void;
    hasCloseButton?: boolean;
    size?: "large" | "medium" | "small"
    className?: string;
    style?: React.CSSProperties;
    children: ChildType | ChildType[];
    trigger?: ReactNode;
}

interface State {
    isVisible?: boolean;
}

export default class Modal extends React.Component<Props, State> {
    private _div?: HTMLDivElement | null;

    static defaultProps: Partial<Props> = {
        hasCloseButton: true
    };

    constructor(props: Props) {
        super(props);
        this.state = {isVisible: this.props.isVisible}
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.isVisible != undefined && nextProps.isVisible != this.state.isVisible)
            this.setState({isVisible: nextProps.isVisible});
    }

    componentDidMount() {
        this._focus();
    }

    componentDidUpdate() {
        this._focus();
    }

    private _focus() {
        setTimeout(() => {
            if (this._div)
                this._div.focus();
        }, 10)
    }

    open() {
        this.setState({isVisible: true});
        this._focus();
    }

    close() {
        this.setState({isVisible: false});

        if (this.props.onCloseModal)
            this.props.onCloseModal();
    }

    private _renderVisibleContent() {
        const size = this.props.size ? "modal-content-size-" + this.props.size : "";
        const className = `clean ${"modal-content " + (this.props.className || '')} ${size}`;
        return <div style={this.props.style} className={className}>
            <div style={{position: 'relative'}}>
                {this.props.hasCloseButton &&
                <CloseIcon onClick={() => this.close()} className='modal-close-icon text-light'/>}
                {this.props.children}
            </div>
        </div>
    }

    _renderModal() {
        if (!this.state.isVisible)
            return;

        return ReactDOM.createPortal(
            <div className="modal" ref={ref => this._div = ref} tabIndex={0}
                 onKeyDown={e => e.key == 'Escape' && this.close()}>
                {this._renderVisibleContent()}
            </div>
            , document.body)
    }

    _renderTrigger() {
        if (this.props.trigger)
            return <span onClick={() => this.open()}>{this.props.trigger}</span>
    }

    render() {
        return <React.Fragment>
            {this._renderTrigger()}
            {this._renderModal()}
        </React.Fragment>
    }


    static Header = ModalHeader;
    static Body = ModalBody;
    static Footer = ModalFooter;
}
