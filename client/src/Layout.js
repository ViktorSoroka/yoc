import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Container } from '@sencha/ext-modern';

import Home from './Home';

class Layout extends Component {
  render() {
    return (
      <Container fullscreen layout="fit">
        <Switch>
          <Route path="/" component={Home} exact />
        </Switch>
      </Container>
    );
  }
}

export default withRouter(Layout);
