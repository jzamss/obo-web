import React, { useState } from "react";
import {
  Panel,
  Text,
  Button,
  ActionBar,
  Label,
  Spacer,
  Table,
  TableColumn,
  Title,
  Loading,
  Service,
  Error,
  currencyFormat

} from "rsi-react-web-components";

const TXNTYPE = "obo";
const ORIGIN = "filipizen";
const BARCODE = "51002";


const OnlineOboBilling = (props) => {
  const [mode, setMode] = useState('initial');
  const [error, setError] = useState(props.error);
  const [loading, setLoading] = useState(false);
  const [refno, setRefno] = useState();
  const [showPayOption, setShowPayOption] = useState(false);
  const [bill, setBill] = useState();
  const [payorderdetails, setPayorderdetails] = useState();
  const [barcode, setBarcode] = useState();

  const { partner, page, onCancel, onSubmit } = props


  const getBilling = async () => {
    const params = {txntype: TXNTYPE, refno, qtr, showdetails:true};
    const svc = await Service.lookupAsync(`${partner.id}:OnlineBusinessBillingService`);
    return await svc.getBilling(params)
  }

  const loadBill = () => {
    setLoading(true);
    setError(null);
    getBilling().then(o => {
      const bill = o.info;
      bill.amount = o.amount;
      setBill(bill);
      setBarcode(`${BARCODE}:${bill.billno}`);
      setPayorderdetails(o);
      setMode('viewbill');
      setLoading(false)
    }).catch(err => {
      console.log("ERR", err)
      setError(err.toString());
      setLoading(false)
    })
  }

  const confirmPayment = () => {
    onSubmit({
      refno,
      txntype: TXNTYPE,
      origin: ORIGIN,
      orgcode: partner.id,
      info: {},
      paidby: bill.paidby,
      paidbyaddress: bill.paidbyaddress,
      amount: bill.amount,
      paymentdetails: `Building Permit Payment`,
      particulars: `Building Permit Payment for Application No. ${bill.appno}`,
    })
  }


  return (
    <React.Fragment>
      <Title>{"Online Building Permit Billing"}</Title>
      <Panel visibleWhen={mode === 'initial'}>
        <Label labelStyle={styles.subtitle}>Initial Information</Label>
        <Spacer />
        <Error msg={error} />
        <Text name="appno" caption="Application No." value={refno} onChange={setRefno} autoFocus={true} />
        <ActionBar>
          <Button caption='Back' variant="text" action={onCancel} />
          <Button caption='Next' action={loadBill} loading={loading} disabled={loading} />
        </ActionBar>
      </Panel>

      <Panel visibleWhen={mode === 'viewbill'} >
        <Label labelStyle={styles.subtitle}>Billing Information</Label>
        <Spacer />
        <Error msg={error} />
        <Loading visibleWhen={loading} />
        <Panel type={{minWidth: 800}}>
          <Label context={bill} caption="Application No." expr="appno" />
          <Label context={bill} caption="Application Type" expr="apptype" />
          <Label context={bill} caption="Date Filed" expr="appdate" />
          <Label context={bill} caption="BIN" expr="bin" />
          <Label context={bill} caption="Trade Name" expr="tradename" />
          <Label context={bill} caption="Owner Name" expr="ownername" />
          <Label context={bill} caption="Business Address" expr="address" />
          <Spacer />
          <Button variant="outlined" caption='Pay Option' action={() => setShowPayOption(true)} />
          <Table items={bill ? bill.items : []} size="small" showPagination={false} >
            <TableColumn caption="Particulars" expr={item => (item.lobname ? item.lobname : "") +  ` -${item.account}`} />
            <TableColumn caption="Amount" expr="amount" align="right" format="currency" />
            <TableColumn caption="Surcharge" expr="surcharge" align="right" format="currency" />
            <TableColumn caption="Interest" expr="interest" align="right" format="currency" />
            <TableColumn caption="Total" expr="total" align="right" format="currency" />
          </Table>
          <Panel style={{display: "flex", flexDirection: "row", justifyContent: "flex-end", paddingRight: 15}}>
            <Label context={bill} caption="Bill Amount:" expr={item => currencyFormat(item.amount)} />
          </Panel>
        </Panel>
        <ActionBar disabled={loading}>
          <Button caption='Back' variant="text" action={() => setMode("initial")} />
          <Button caption='Confirm Payment' action={confirmPayment} />
        </ActionBar>
      </Panel>
    </React.Fragment>
  );
};

const styles = {
  subtitle: {
    fontSize: 16,
    fontWeight: 400,
    opacity: 0.8,
    color: 'green'
  }
}

export default OnlineOboBilling;
