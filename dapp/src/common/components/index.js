import React from 'react';
import PropTypes from 'prop-types';
import * as glamor from 'glamor';
import glamorous from 'glamorous';
import { Row, Col, Card, CardBlock } from 'reactstrap';


export const Flex1 = glamor.css({ flex: 1 });

export const FlexDiv = glamorous.div({
  flex: 1
});

export const FlexRow = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
});

export const FlexColumn = glamorous.div({
  display: 'flex',
  flexDirection: 'column'
});

export const Divider = glamorous.hr({
  margin: '1rem auto',
  border: 0,
  borderTop: '1px solid rgba(0, 0, 0, 0.1)'
});


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

export const SectionHeader = glamorous.div({
  textAlign: 'center',
  background: '#4A90E2',
  color: 'white',
  borderTopLeftRadius: '0.25rem',
  borderTopRightRadius: '0.25rem',
  padding: 20
});

export const Logo = (props) => (
  <div {...props}>
    <h3 className="m-0">
      Ether Comp
    </h3>
  </div>
);
export const RegistrationHeader = (props) => (
  <SectionHeader {...props} >
    <Logo />
  </SectionHeader>
);

export const Icon = ({ font, size, className = '', ...props }) => {
  const classNames = className.split(' ');
  classNames.push('fa', `fa-${font}`);
  if (size) {
    classNames.push(`fa-${size}`);
  }
  return (
    <i className={`${classNames.join(' ')}`} {...props} />
  );
};

Icon.propTypes = {
  font: PropTypes.string.isRequired,
  size: PropTypes.string,
  className: PropTypes.string,
};

export const CentralCard = ({ children, sm = '10', lg = '4', xs = '12', ...props }) => (
  <CentralDiv {...props} >
    <Row className="justify-content-md-center w-100">
      <Col sm={sm} lg={lg} xs={xs}>
        <Card
          style={{
            minHeight: 300,
            display: 'flex',
            flex: 1
          }}
        >
          <RegistrationHeader />
          <CardBlock style={{ background: '#E5EFFB', padding: 10 }}>
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
