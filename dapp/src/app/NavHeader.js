import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import capitalize from 'lodash/capitalize';

import { FlexRow, Logo, Icon, Flex1 } from '../common/components/index';

const HeaderContainer = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  color: 'white',
  backgroundColor: '#273135',
  height: 75,
  border: 'none',
  transition: 'all 0.3s ease',
  position: 'fixed',
  top: 0,
  right: 0,
  left: 0,
  zIndex: 1030,
  padding: '10px 20px'
});


export default function NavHeader({ toggleSidebar, firstName, ...props}) {
  return (
    <HeaderContainer {...props}>
      <FlexRow className="h-100">
        <Icon
          font="bars"
          size="lg"
          style={{ margin: '0 20px' }}
          onClick={toggleSidebar}
        />
        <Logo style={{ margin: '0 20px' }} />
        <FlexRow className={`${Flex1} justify-content-end`} style={{ margin: '0 30px' }}>
          <Icon font="home" size="lg" style={{ margin: '0 20px' }} onClick={() => console.log('Home is Clicked')} />
            <div className="m-0" style={{ fontSize: '1.1rem' }}>{`Welcome ${capitalize(firstName)}`}</div>
        </FlexRow>

      </FlexRow>
    </HeaderContainer>
  );
}

NavHeader.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  firstName: PropTypes.string
};
