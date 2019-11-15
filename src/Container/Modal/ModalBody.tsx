import * as React from "react";

interface Props {
}

export default class ModalBody extends React.Component<Props> {
    render() {
        return <div style={{maxHeight: '90%', padding: 32}}>
            {this.props.children}
        </div>
    }
}
