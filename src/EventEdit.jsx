import React from 'react';
import update from 'react-addons-update';
import { Link } from 'react-router';

import { 
  Panel, 
  FormGroup, 
  FormControl, 
  ControlLabel, 
  Button, 
  ButtonToolbar, 
  Alert 
} from 'react-bootstrap';

export default class EventEdit extends React.Component {

  constructor(props) {
    super(props);
    
    this.submit = this.submit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);

    this.state = { 
        successVisible: false, 
        event: {},
        eventTypes: [],
        companies: []
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id !== prevProps.params.id) {
      this.loadData();
    }
  }

  onChange(e) {
    const changes = {};
    changes[e.target.name] = { $set: e.target.value };
    const modifiedEvent = update(this.state.event, changes);
    
    this.setState({ event: modifiedEvent });
  }

  loadData() {
    fetch(`/api/events/${this.props.params.id}`).then(response => response.json()).then(event => {
      this.setState({ event });
    });

    fetch('/api/types/').then(response => response.json()).then(eventTypes => {
      this.setState({ eventTypes });
    });

    fetch('/api/companies/').then(response => response.json()).then(companies => {
      this.setState({ companies });
    });
  }

  submit(e) {
    e.preventDefault();

    fetch(`/api/events/${this.props.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state.event),

    }).then(response => response.json()).then(event => {
      this.setState({ event });
      this.setState({ successVisible: true });
      this.dismissTimer = setTimeout(this.dismissAlert, 3000);
    });
  }

  dismissAlert() {
    this.setState({ successVisible: false });
  }

  render() {
    const success = (
      <Alert bsStyle="success" onDismiss={this.dismissAlert} >
        Event saved to DB successfully.
      </Alert>
    );
    const event = this.state.event;
    return (
      <div style={{ maxWidth: 600 }}>
        <Panel header={`Edit event: ${this.props.params.id}`}>
          <form onSubmit={this.submit}>
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <FormControl type="text" name="title" value={event.title} onChange={this.onChange} />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Event Type</ControlLabel>
              <FormControl componentClass="select" name="eventType" value={event.eventType}
                onChange={this.onChange}>
                {this.state.eventTypes.map((type, i) => {
                  return <option key={i} value={type._id}>{type.title}</option>
                })}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Company</ControlLabel>
              <FormControl componentClass="select" name="company" value={event.company} onChange={this.onChange}>
                {this.state.companies.map((company, i) => {
                  return <option key={i} value={company._id}>{company.title}</option>
                })}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Start Time</ControlLabel>
              <FormControl type="text" name="startTime" value={event.startTime} onChange={this.onChange} />
            </FormGroup>
            <FormGroup>
              <ControlLabel>End Time</ControlLabel>
              <FormControl type="text" name="endTime" value={event.endTime} onChange={this.onChange} />
            </FormGroup>
            <ButtonToolbar>
              <Button type="submit" bsStyle="primary">Edit</Button>
              <Link className="btn btn-link" to="/events">Back</Link>
            </ButtonToolbar>
          </form>
        </Panel>
        {this.state.successVisible ? success : null}
      </div>
    );
  }
}

EventEdit.propTypes = {
  params: React.PropTypes.object.isRequired,
};
