import React from 'react';
import { Row, Col } from 'reactstrap';

import { CentralCard } from './index';

export default function ({ message }) {
  return (
    <CentralCard>
      <div className="d-flex flex-column justify-content-center">
        <Row
          className="justify-content-center"
        >
          <Col xs="10">
            <div className="text-center">
              {message}
            </div>
          </Col>
        </Row>
      </div>
    </CentralCard>
  );
}
