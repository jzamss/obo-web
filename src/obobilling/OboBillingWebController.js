import React from 'react'

import { EPayment } from 'rsi-react-filipizen-components'
import OnlineOboBilling from "./OnlineOboBilling";

const OboBillingWebController = (props) => {
  const module = {title: "Building Permit Online Billing", component: OnlineOboBilling };
  return <EPayment module={module} {...props} />
};

export default OboBillingWebController;
