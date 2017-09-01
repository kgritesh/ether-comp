import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import { Row, Col, Card, CardBlock } from 'reactstrap';

export const Container = glamorous.div({
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
}, ({ theme }) => ({
  backgroundColor: theme.container.backgroundColor
}));

export const CentralDiv = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1
});

const LogoContainer = glamorous.div({
  textAlign: 'center',
  background: '#4A90E2',
  color: 'white',
  padding: 20
});

export const RegistrationHeader = () => (
  <LogoContainer>
    <h2 className="m-0">
      Ether Comp
    </h2>
  </LogoContainer>
);

export const CentralCard = ({ children }) => (
  <CentralDiv>
    <Row className="justify-content-md-center w-100">
      <Col sm="10" lg="4">
        <Card
          style={{
            minHeight: 300,
            display: 'flex',
            flex: 1
          }}
        >
          <RegistrationHeader />
          <CardBlock style={{ background: '#E5EFFB' }}>
            {children}
          </CardBlock>
        </Card>
      </Col>
    </Row>
  </CentralDiv>
);

CentralCard.PropTypes = {
  children: PropTypes.object.isRequired
};
