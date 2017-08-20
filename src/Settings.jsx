import React from 'react';
import { 
  Panel, 
  FormGroup, 
  ControlLabel, 
  FormControl, 
  Radio, 
  Button,
  Grid,
  Row,
  Col,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';
import update from 'react-addons-update';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      types: [],
      companies: []
    };
    this.options = {
      eventType: 0,
      company: 1
    };

    this.addCompany = this.addCompany.bind(this);
    this.addEventType = this.addEventType.bind(this);
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
    
    const form = document.forms.settings;
    const data = { 
      title: form.title.value
    };

    form.manageType.value == this.options.company ?
      this.addCompany(data) : this.addEventType(data);
    
    form.title.value = '';
    form.manageType.value = '';
  }

  addEventType(newEventType) {
    fetch('/api/types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEventType),

    }).then(res => res.json()).then(type => {
      const modifiedTypes = update(this.state.types, { $push: [type] });
      this.setState({ types: modifiedTypes });

    }).catch(err => {
      console.log('Error adding event type:', err);
    });
  }

  addCompany(newCompany) {
    fetch('/api/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCompany),

    }).then(res => res.json()).then(company => {
      const modifiedCompanies = update(this.state.companies, { $push: [company] });
      this.setState({ companies: modifiedCompanies });

    }).catch(err => {
      console.log('Error adding company:', err);
    });
  }

  render() {
    return (
      <Row className="show-grid">
        <Col xs={6} md={3}>
          <Panel 
            header={`Event Types List (${this.state.types.length})`} 
            bsStyle="warning" 
            collapsible 
            defaultExpanded
          >
            <ListGroup fill>
              {this.state.types.map((type, i) => {
                return <ListGroupItem key={i}>{type.title}</ListGroupItem>
              })}
            </ListGroup>
          </Panel>
        </Col>
        <Col xs={6} md={6}>
          <Panel header="Add new Event Type or Company">
            <form name="settings">
              <FormGroup>
                <ControlLabel>Title for Type/Company</ControlLabel>
                <FormControl type="text" name="title" />
              </FormGroup>
              <FormGroup>
                <Radio name="manageType" value="0" inline>
                  Event Type
                </Radio>
                {' '}
                <Radio name="manageType" value="1" inline>
                  Company
                </Radio>
              </FormGroup>
              <Button bsStyle="primary" onClick={this.handleSubmit}>Add</Button>
            </form>
          </Panel>
        </Col>
        <Col xs={6} md={3}>
          <Panel 
            header={`Companies List (${this.state.companies.length})`} 
            bsStyle="warning" 
            collapsible 
            defaultExpanded
          >
            <ListGroup fill>
              {this.state.companies.map((company, i) => {
                return <ListGroupItem key={i}>{company.title}</ListGroupItem>
              })}
            </ListGroup>
          </Panel>
        </Col>
      </Row>
    );
  }
}
