import * as React from 'react';
import {useState} from 'react';
import {render} from "react-dom";
import {Decimal, DropDown, Input, Integer, Menu, MenuItemProps, Modal} from '..'
import './style.css';
import Button from "../Form/BoxButton";
import BoxDateTime from "../Form/BoxDateTime";
import BoxTime from "../Form/BoxTime";


function MainApplication() {
    const [dateTime, setDateTime] = useState();
    console.warn(dateTime);

    const items: MenuItemProps[] = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((i, ix) => ({
        title: 'سلام خوبی ؟ ' + i,
        content: <span>سلام <b>بچه های عزیز</b> شماره {ix}</span>,
        value: ix,
        data: 'abc'
    }));

    return <div style={{margin: 10}}>
            <span style={{width: 200, display: 'inline-block'}}>
            </span>
        <span style={{width: 200, display: 'inline-block'}}>
            </span>
        <span style={{width: 300, display: 'inline-block'}}>
                <Input name="boxInput" label="نام و نام خانوادگی" value="محمدرضا آزرنگ"/>
                <Input name="boxInput2" label="نام و نام خانوادگی" value="محمد اشرفیان" hasError/>
                <Input name="boxInput3" label="نام و نام خانوادگی" placeholder="علی رهبری"/>
                <Integer name="boxInput4" label="پول" value="153" valueClassName="text-buy"/>
                <Decimal name="boxInput5" label="درصد" value="35.265" valueClassName="text-buy" hasError/>
                <DropDown name="boxDropdown" label="دراپ داون" items={items} searchable value={4}
                          onChange={e => console.log(e)}
                          addNewItemProps={{placeHolder: 'hello :)))', onSubmit: (e) => console.log(e)}}/>
                <Menu name="boxMenu" label="منو" items={items} searchable value={5} onChange={e => console.log(e)}/>
                <BoxDateTime name="datetime" label="درصد" value={dateTime} onChange={e => setDateTime(e.newValue)}
                             hasError/>
                 <BoxTime name="Time" label="زمان"/>
            <Modal trigger={<Button className="buy" isWide>button</Button>}>
                <Modal.Header>
                    هدر مودال
                </Modal.Header>
                <Modal.Body>
                    بادی
                </Modal.Body>
                <Modal.Footer>
                    فوتر مودال
                </Modal.Footer>
            </Modal>
        </span>
    </div>
}

render(
    <MainApplication/>,
    document.getElementById("root")
);

declare const module: any;
if (module && module.hot)
    module.hot.accept('./index.tsx');