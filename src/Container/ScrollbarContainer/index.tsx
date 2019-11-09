import * as React from "react";
import * as ReactDOM from "react-dom";
import './style.css'

interface Props {
    onScroll?: (e: {
        sourceTargetClientHeight: number,
        remainingScrollHeight: number
    }) => void;
    className?: string;
    style?: React.CSSProperties;
}

interface State {
    isHovered: boolean;
}

export default class ScrollbarContainer extends React.Component<Props, State> {
    private _content: any;
    private _scroll: any;
    private _scrollBar: any;
    private _scrollBarMouseOffset?: { top: number };

    constructor(props: Props) {
        super(props);
        this.state = {
            isHovered: false
        };

        this._unsubscribeDocumentEvents = this._unsubscribeDocumentEvents.bind(this);
        this._changeScrollbar = this._changeScrollbar.bind(this);
    }

    componentDidMount() {
        this._changeScrollIndicatiorPosition(true);
    }

    componentDidUpdate() {
        this._changeScrollIndicatiorPosition(true);
    }

    componentWillUnmount() {
        this._unsubscribeDocumentEvents();
    }

    scrollYTo(top: number) {
        (ReactDOM.findDOMNode(this._content) as HTMLDivElement).scrollTop = top;
    }

    private _changeScrollIndicatiorPosition(isForInit?: boolean) {
        const contentDiv = ReactDOM.findDOMNode(this._content) as HTMLDivElement;
        const scrollDiv = ReactDOM.findDOMNode(this._scroll) as HTMLDivElement;
        const scrollBarDiv = ReactDOM.findDOMNode(this._scrollBar) as HTMLDivElement;

        const scrollHeightPercent = contentDiv.offsetHeight / contentDiv.scrollHeight * 100;
        const scrollTopPercent = contentDiv.scrollTop / contentDiv.scrollHeight * 100;
        if (scrollHeightPercent >= 100) {
            scrollDiv.style.display = 'none';
        } else {
            scrollDiv.style.display = null as any;
            scrollBarDiv.style.height = scrollHeightPercent.toFixed(1) + '%';
            scrollBarDiv.style.top = scrollTopPercent.toFixed(1) + '%';
        }

        if (!isForInit)
            this._showScrollBar();
    }


    private _showScrollBar() {
        const thisDiv = ReactDOM.findDOMNode(this) as HTMLDivElement;
        if (!thisDiv.classList.contains('scrollbar-container-mouse-move'))
            thisDiv.classList.add('scrollbar-container-mouse-move');

        clearTimeout((this as any)._ScrollShownTimeout);
        (this as any)._ScrollShownTimeout = setTimeout(() => this._hideScrollBar(), 500);
    }

    private _hideScrollBar() {
        const thisDiv = ReactDOM.findDOMNode(this) as HTMLDivElement;
        if (thisDiv.classList.contains('scrollbar-container-mouse-move'))
            thisDiv.classList.remove('scrollbar-container-mouse-move');
        clearTimeout((this as any)._ScrollShownTimeout);
    }

    private _changeScrollbar(e: any) {
        const contentDiv = ReactDOM.findDOMNode(this._content) as HTMLDivElement;
        const scrollDiv = ReactDOM.findDOMNode(this._scroll) as HTMLDivElement;
        const scrollBarDiv = ReactDOM.findDOMNode(this._scrollBar) as HTMLDivElement;

        const baseScrollDivOffset = scrollDiv.getBoundingClientRect();
        let mouseYPosition = e.clientY - baseScrollDivOffset.top;
        if (this._scrollBarMouseOffset)
            mouseYPosition -= this._scrollBarMouseOffset.top - scrollBarDiv.offsetHeight / 2;
        mouseYPosition /= scrollDiv.offsetHeight;

        contentDiv.scrollTop = Math.round(mouseYPosition * (contentDiv.scrollHeight) - contentDiv.clientHeight / 2);
    }

    private _unsubscribeDocumentEvents() {
        this._hideScrollBar();
        this._scrollBarMouseOffset = undefined;

        const thisDiv = ReactDOM.findDOMNode(this) as HTMLDivElement;
        thisDiv.classList.remove('scrollbar-container-clicked');

        document.body.removeEventListener('mousemove', this._changeScrollbar);
        document.body.removeEventListener('mouseup', this._unsubscribeDocumentEvents);
    }

    private _scrollBarMouseDown(e: any) {
        this._changeScrollbar(e);

        const thisDiv = ReactDOM.findDOMNode(this) as HTMLDivElement;
        thisDiv.classList.add('scrollbar-container-clicked');

        document.body.addEventListener('mousemove', this._changeScrollbar);
        document.body.addEventListener('mouseup', this._unsubscribeDocumentEvents);
    }

    private _handleScroll() {
        this._changeScrollIndicatiorPosition();
        if (this.props.onScroll) {
            const contentDiv = ReactDOM.findDOMNode(this._content) as HTMLDivElement;
            this.props.onScroll({
                sourceTargetClientHeight: contentDiv.clientHeight,
                remainingScrollHeight: contentDiv.scrollHeight - contentDiv.scrollTop - contentDiv.clientHeight
            });
        }
    }

    private _setScrollBarMouseOffset(e: React.MouseEvent) {
        const scrollBarDiv = ReactDOM.findDOMNode(this._scrollBar) as HTMLDivElement;
        this._scrollBarMouseOffset = {top: e.clientY - scrollBarDiv.getBoundingClientRect().top};
    }

    render() {
        return <div style={this.props.style}
                    className={'scrollbar-container ' + (this.props.className ? this.props.className : '')}
                    onScroll={() => this._handleScroll()}
                    onMouseMove={() => this._changeScrollIndicatiorPosition()}
                    onMouseEnter={() => this._changeScrollIndicatiorPosition()}>
            <div className="scrollbar-container-content" ref={ref => this._content = ref}>
                {this.props.children}
            </div>
            <div className="scrollbar-container-vertical-scroll"
                 ref={ref => this._scroll = ref}
                 onMouseDown={e => this._scrollBarMouseDown(e)}>
                <div className="scrollbar-container-vertical-scroll-bar"
                     ref={ref => this._scrollBar = ref} onMouseDown={e => this._setScrollBarMouseOffset(e)}/>
            </div>
        </div>
    }
}
