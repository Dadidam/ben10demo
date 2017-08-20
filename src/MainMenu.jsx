import React from 'react';
import ReactDOM from 'react-dom';
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';

export default class MainMenu extends React.Component {
    render() {
        return (
            <Navbar fluid>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="/">Event List App</a>
                </Navbar.Brand>
              </Navbar.Header>
              <Nav>
                <NavItem eventKey={1} href="/#/events/add">
                  <Glyphicon glyph="plus" />{' '}Add Event
                </NavItem>
                <NavItem eventKey={2} href="/#/settings">
                  <Glyphicon glyph="wrench" />{' '}Settings
                </NavItem>
              </Nav>
            </Navbar>
        )
    }
}
