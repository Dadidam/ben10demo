import React from 'react';
import { 
    Panel, 
    Grid, 
    Row, 
    Col, 
    FormGroup, 
    ControlLabel, 
    FormControl, 
    Button, 
    ButtonToolbar 
} from 'react-bootstrap';

export default class EventFilter extends React.Component {
    static get propTypes() {
        return {
          initFilter: React.PropTypes.object.isRequired,
          submitHandler: React.PropTypes.func.isRequired,
        };
    }

    constructor(props) {
        super(props);
        this.state = {
          type: this.props.initFilter.type,
          company: this.props.initFilter.company,
        };
        this.reset = this.reset.bind(this);
        this.submit = this.submit.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeCompany = this.onChangeCompany.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.initFilter.type === this.state.type
            && newProps.initFilter.company === this.state.company) {
          return;
        }

        this.setState({ type: newProps.initFilter.type, company: newProps.initFilter.company });
    }

    onChangeType(e) {
        this.setState({ type: e.target.value });
    }

    onChangeCompany(e) {
        this.setState({ company: e.target.value });
    }

    submit(e) {
        e.preventDefault();
        const newFilter = {};
        if (this.state.type) newFilter.type = this.state.type;
        if (this.state.company) newFilter.company = this.state.company;
        this.props.submitHandler(newFilter);
    }

    reset(e) {
        e.preventDefault();
        
        const newFilter = {
            type: '',
            company: ''
        };

        this.setState(newFilter);
        this.props.submitHandler(newFilter);

        const form = document.forms.filter;

        form.type.value = '';
        form.company.value = '';
    }

    render() {
      return (
        <Panel collapsible defaultExpanded header="Event Filter">
          <Grid fluid>
            <Row>
              <form name="filter">
                <Col xs={12} sm={6} md={4}>
                  <FormGroup controlId="type">
                    <ControlLabel>Event Type</ControlLabel>
                    <FormControl
                      componentClass="select"
                      value={this.state.type}
                      onChange={this.onChangeType}
                    >
                      <option value="">(Any)</option>
                      {this.props.eventTypes.map((type, i) => {
                        return <option key={i} value={type._id}>{type.title}</option>;
                      })}
                    </FormControl>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <FormGroup controlId="company">
                    <ControlLabel>Company Name</ControlLabel>
                    <FormControl
                      componentClass="select"
                      value={this.state.company}
                      onChange={this.onChangeCompany}
                    >
                      <option value="">(Any)</option>
                      {this.props.companies.map((company, i) => {
                          return <option key={i} value={company._id}>{company.title}</option>;
                      })}
                    </FormControl>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <FormGroup>
                    <ControlLabel>&nbsp;</ControlLabel>
                    <ButtonToolbar>
                      <Button type="submit" bsStyle="primary" onClick={this.submit}>Apply</Button>
                      <Button type="submit" onClick={this.reset}>Reset</Button>
                    </ButtonToolbar>
                  </FormGroup>
                </Col>
              </form>
            </Row>
          </Grid>
        </Panel>
      );
    }
}
