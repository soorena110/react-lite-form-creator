import * as React from "react";
import './style.css';

export default class Empty extends React.Component {
    render() {
        return <div className="empty-div">
            <span className="empty-div-content">{this.props.children}</span>
        </div>
    }
}
