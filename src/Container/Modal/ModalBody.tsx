import * as React from "react";
import ScrollbarContainer from "../ScrollbarContainer";

interface Props {
}

export default class ModalBody extends React.Component<Props> {
    render() {
        return <div style={{maxHeight: 400, padding: 32}}>
            <ScrollbarContainer>
                {this.props.children}
            </ScrollbarContainer>
        </div>
    }
}
