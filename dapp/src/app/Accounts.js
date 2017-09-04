import React from 'react';
import { Card, CardBlock } from 'reactstrap';

import { FlexColumn, FlexRow, SectionHeader, Flex1 } from '../common/components/index';

export default function Accounts() {
  return (
    <FlexColumn style={{ padding: 20 }}>
      <Card className={Flex1}>
        <SectionHeader className="text-left">
          <FlexRow>
            <h5 className={`${Flex1} m-0`}>Accounts</h5>
          </FlexRow>
        </SectionHeader>
        <CardBlock className="d-flex flex-column align-items-center" />
      </Card>
    </FlexColumn>
  );
}
