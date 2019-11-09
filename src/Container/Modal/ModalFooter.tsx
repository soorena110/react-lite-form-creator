import * as React from "react";
import ScrollbarContainer from "../ScrollbarContainer";

interface Props {
}

export default class ModalFooter extends React.Component<Props> {
    render() {
        return <div style={{padding: 16}}>
            <ScrollbarContainer>
                {this.props.children}
            </ScrollbarContainer>
        </div>
    }
}
