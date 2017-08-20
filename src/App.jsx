import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import { Router, Route, Redirect, hashHistory, browserHistory } from 'react-router';

import MainMenu from './MainMenu.jsx';
import Settings from './Settings.jsx';
import EventAdd from './EventAdd.jsx';
import EventList from './EventList.jsx';
import EventEdit from './EventEdit.jsx';

const style = {
  paddingRight: 15, 
  paddingLeft: 15, 
  paddingTop: 15,
  marginRight: "auto", 
  marginLeft: "auto",
}

const NoMatch = () => <div>
  <h1>404</h1>
  <h3>Page not found</h3>
  <h5>Try another day. Or week. Or change the universe...</h5>
</div>;

ReactDOM.render(
  (
    <div style={style}>
      <Grid>
        <Row>
          <Col xs={12} sm={8} md={12}>
            <MainMenu />
            <Router history={hashHistory}>
              <Route path="/events" component={EventList} />
              <Route path="/events/add" component={EventAdd} />
              <Route path="/events/:id" component={EventEdit} />
              <Route path="/settings" component={Settings} />
              <Redirect from="/" to="/events" /> 
              <Route path="*" component={NoMatch} />
            </Router>
          </Col>
        </Row>
      </Grid>
    </div>
  ),
  document.getElementById('main')
);
