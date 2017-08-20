import React from 'react';
import update from 'react-addons-update';
import { Link } from 'react-router';
import { Button, Glyphicon, Alert } from 'react-bootstrap';

import EventAdd from './EventAdd.jsx';
import EventFilter from './EventFilter.jsx';

const EventRow = (props) => (
  <tr>
    <td>
      <Link to={`/events/${props.event._id}`}>
        {props.event._id}
        <Button bsStyle="link" bsSize="small"><Glyphicon glyph="pencil" /></Button>
      </Link>
    </td>
    <td>{props.event.title}</td>
    <td>{props.event.typeTitle}</td>
    <td>{props.event.companyTitle}</td>
    <td>{props.event.startTime}</td>
    <td>{props.event.endTime}</td>
  </tr>
);

EventRow.propTypes = {
  event: React.PropTypes.object.isRequired,
};

function EventTable(props) {
  if (props.events.length === 0) {
    return <Alert bsStyle="warning">
      <strong>No events found.</strong> <a href="/#/events/add">Add new events</a> or change the search conditions.
    </Alert>
  }

  let eventRows = props.events.map((event, i) => {
    if (props.companies.length && props.eventTypes.length) {
      const eventCompany = props.companies.find((company) => {
        return company._id == event.company;
      });

      const eventType = props.eventTypes.find((type) => {
          return type._id == event.eventType;
      });

      event.companyTitle = eventCompany.title;
      event.typeTitle = eventType.title;
    }

    return <EventRow key={i} event={event} />
  });

  console.log(eventRows);

  return (
    <table className="table table-striped table-bordered table-condensed">
      <thead>
        <tr>
          <th>Id</th>
          <th>Event Title</th>
          <th>Event Type</th>
          <th>Company</th>
          <th>Start Time</th>
          <th>End Time</th>
        </tr>
      </thead>
      <tbody>{eventRows.reverse()}</tbody>
    </table>
  );
}

EventTable.propTypes = {
  events: React.PropTypes.array.isRequired,
};

export default class EventList extends React.Component {
  static get contextTypes() {
    return { router: React.PropTypes.object.isRequired };
  }

  static get propTypes() {
    return { location: React.PropTypes.object.isRequired };
  }

  constructor() {
    super();

    this.state = { 
        events: [],
        eventTypes: [],
        companies: []
    };

    this.changeFilter = this.changeFilter.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const oldQuery = prevProps.location.query;
    const newQuery = this.props.location.query;
    
    if (oldQuery.type === newQuery.type &&
        oldQuery.company === newQuery.company) {
      return;
    }
    
    this.loadData();
  }

  loadData() {
    fetch(`/api/events/${this.props.location.search}`).then(response =>
      response.json()
    ).then(events => {
      this.setState({ events });
    }).catch(err => {
      console.log(err);
    });

    fetch('/api/types/').then(response =>
      response.json()
    ).then(eventTypes => {
      this.setState({ eventTypes });
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

  changeFilter(newFilter) {
    const search = Object.keys(newFilter)
      .filter(k => newFilter[k] !== '')
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(newFilter[k])}`)
      .join('&');

    this.context.router.push({ search: `?${search}` });
  }

  render() {
    return (
      <div>
        <EventFilter 
          submitHandler={this.changeFilter} 
          initFilter={this.props.location.query} 
          eventTypes={this.state.eventTypes}
          companies={this.state.companies}
        />
        <EventTable 
          events={this.state.events}
          eventTypes={this.state.eventTypes}
          companies={this.state.companies}
        />
      </div>
    );
  }
}
