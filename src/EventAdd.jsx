import React from 'react';
import update from 'react-addons-update';
import { 
  Panel, 
  FormGroup, 
  ControlLabel, 
  FormControl, 
  Button, 
  Alert 
} from 'react-bootstrap';

export default class EventAdd extends React.Component {
  static get contextTypes() {
    return { router: React.PropTypes.object.isRequired };
  }

  constructor(props) {
    super(props);

    this.state = {
      types: [],
      companies: []
    };

    this.addEvent = this.addEvent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    fetch('/api/types/').then(response =>
      response.json()
    ).then(types => {
      this.setState({ types });
    }).catch(err => {
      console.log(err);
    });

    fetch('/api/companies/').then(response =>
      response.json()
    ).then(companies => {
      this.setState({ companies });
    }).catch(err => {
      console.log(err);
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const form = document.forms.eventAdd;
    this.addEvent({
        title: form.title.value,
        eventType: form.eventType.value,
        company: form.company.value,
        startTime: form.startTime.value,
        endTime: form.endTime.value,
    });
    
    form.title.value = '';
    form.startTime.value = '';
    form.endTime.value = '';
  }

  addEvent(newEvent) {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),

    }).then(res => res.json()).then(() => {
      this.context.router.push('/#/events')

    }).catch(err => {
      console.log('Error adding event:', err);
    });
  }

  render() {
    if (this.state.types.length === 0 || this.state.companies.length === 0) {
      return <Alert bsStyle="warning">
        <strong>So far you can not add events.</strong> Use <a href="/#/settings">settings</a> to add at least one type and one company.
      </Alert>
    }

    return (
      <Panel header="Add Event">
        <form name="eventAdd">
          <FormGroup>
            <ControlLabel>Event Title</ControlLabel>
            <FormControl type="text" name="title" />
          </FormGroup>
          <FormGroup controlId="eventType">
            <ControlLabel>Select Event Type</ControlLabel>
            <FormControl componentClass="select" placeholder="select">
              {this.state.types.map((type, i) => {
                return <option key={i} value={type._id}>{type.title}</option>
              })}
            </FormControl>
          </FormGroup>
          <FormGroup controlId="company">
            <ControlLabel>Select Company</ControlLabel>
            <FormControl componentClass="select" placeholder="select">
              {this.state.companies.map((company, i) => {
                return <option key={i} value={company._id}>{company.title}</option>
              })}
            </FormControl>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Start Time</ControlLabel>
            <FormControl type="text" name="startTime" />
          </FormGroup>
          <FormGroup>
            <ControlLabel>End Time</ControlLabel>
            <FormControl type="text" name="endTime" />
          </FormGroup>
          <Button bsStyle="primary" onClick={this.handleSubmit}>Add</Button>
        </form>
      </Panel>
    );
  }
}
