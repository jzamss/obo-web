import React from 'react'
import {
  Panel,
  Spacer,
  Button,
  Content,
  Label,
  Title,
  Card,
  CardActions,
  Image
} from 'rsi-react-web-components'

import SuccessLogo from "../assets/success.png";

const Success = ({ onClose }) => {
  return (
    <Panel>
      <Card>
        <Content center>
          <Image src={SuccessLogo} width={120} alt='success' />
          <Spacer />
          <Title>Success!</Title>
          <Spacer />
          <Label style={{ ...styles.text, ...{ maxWidth: 300 } }}>
            You have successfully registered your professional information.
          </Label>
          <Label labelStyle={styles.text}>
            Thank you for using this service.
          </Label>
          <Spacer />
          <CardActions>
            <Button
              variant='text'
              caption='Return'
              onClick={onClose}
            />
          </CardActions>
        </Content>
      </Card>
    </Panel>
  )
}

const styles = {
  text: {
    display: "block",
    textAlign: "center"
  }
};

export default Success
