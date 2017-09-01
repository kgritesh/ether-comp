import React from 'react';
import { Card, CardBlock } from 'reactstrap';
import glamorous from 'glamorous';

import { FlexColumn, FlexRow,
  Icon, SectionHeader, Flex1 } from '../common/components/index';

const Label = glamorous.div({
  textAlign: 'left',
  color: '#89949B',
  fontWeiht: 'bold',
  width: 150
});

const LabelValue = glamorous.div({
  textAlign: 'left',
  color: '#2EB398',
  flex: 1

});

export default function Home() {
  return (
    <FlexColumn style={{ padding: 20 }}>
      <Card className={Flex1}>
        <SectionHeader className="text-left">
          <FlexRow>
            <h5 className={`${Flex1} m-0`}>User Profile</h5>
            <Icon font="edit" size="lg" />
          </FlexRow>
        </SectionHeader>
        <CardBlock className="d-flex flex-column">
          <FlexColumn>
            <FlexRow style={{ margin: '10px 0' }}>
              <Label> First Name </Label>
              <LabelValue> Ritesh Kadmawala </LabelValue>
            </FlexRow>
            <FlexRow style={{ margin: '10px 0' }}>
              <Label> Last Name </Label>
              <LabelValue> Ritesh Kadmawala </LabelValue>
            </FlexRow>
            <FlexRow style={{ margin: '10px 0' }}>
              <Label> Primary Email </Label>
              <LabelValue> Ritesh Kadmawala </LabelValue>
            </FlexRow>
          </FlexColumn>
        </CardBlock>
      </Card>
    </FlexColumn>
  );
}
