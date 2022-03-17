import React from 'react';
import Form from 'react-bootstrap/Form';
import { FormLabel, Col, Row, Button, Dropdown } from 'react-bootstrap';
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

export class Translate extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      checked: false,
      orgs: 'none',
      direction: 'Select',
      items: 'Select',
      sort_string: 'Sort By',
      show_config: 'none',
      // orbit data required
      orbit_query: 'organization',
      workplace_slug: 'camunda',
      orbit_token: 'obu_oMdW2GEjOJiTIVxx2AS38l9OM8ptwasx_ddqJ5yA',
      // AirTable data required
      base_id: 'appEwylHyYb8LQNaN',
      table_name: 'Organizations',
      airtable_token: 'keycNYs4vDaTYWIQQ',

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.render = this.render.bind(this);

  }



  handleChange(event) {
    console.log("handleChange", event.target.name, event.target.value);
    const { name, value } = event.target;
    console.log("Value: ", value);
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { direction, items, sort_string, workplace_slug, orbit_token, base_id, table_name, airtable_token, orbit_query } = this.state;
    const formData = {
      direction: direction,
      items: items,
      sort_string: sort_string,
      workplace_slug: workplace_slug,
      orbit_token: orbit_token,
      base_id: base_id,
      table_name: table_name,
      airtable_token: airtable_token,
      orbit_query: orbit_query,
    };
    this.submitForm(formData);
    //https://davidgs.com:8443/engine-rest/process-definition/key/Process_1i8evdw/submit-form
    console.log("handleSubmit", formData);
    const { onSubmit } = this.props;
    //onSubmit({ name, email, subject, comment });
  }

  camundify = (data) => {
    const { direction, items, sort_string, workplace_slug, orbit_token, base_id, table_name, airtable_token, orbit_query } = data;
    const formData = {
      variables: {
        direction: {
          value: direction,
          type: 'String',
        },
        items: {
          value: items,
          type: 'String',
        },
        sort_string: {
          value: sort_string,
          type: 'String',
        },
        workplace_slug: {
          value: workplace_slug,
          type: 'String',
        },
        orbit_token: {
          value: orbit_token,
          type: 'String',
        },
        base_id: {
          value: base_id,
          type: 'String',
        },
        table_name: {
          value: table_name,
          type: 'String',
        },
        airtable_token: {
          value: airtable_token,
          type: 'String',
        },
        orbit_query: {
          value: orbit_query,
          type: 'String',
        },
      }
    };
    return formData;
  }

  submitForm(data) {
    let url = "https://davidgs.com:4040/orgs";

    let auth = 'Basic ZGF2aWRnczpUb2J5NjYuTWltZSE=';
    var head = new Headers();
    // head.append('Authorization', auth);
    // head.append('Custom-Header', 'custom value');
    head.append('Content-Type', 'application/json');
    head['Authorization'] = auth;
    // head['Custom-Header'] = 'custom value';
    // head['Content-Type'] = 'application/form-www-encoded';
    head['Content-Type'] = 'application/json';
    head['Content-Length'] = JSON.stringify(data).length;
    var obj = {
      method: 'POST',
      // mode: 'no-cors',
      realm: 'default',
      authentication: 'basic',
      authorization: auth,
      headers: head,
      // {
      //   Authorization: auth,
      //   'Custom-Header': 'custom value',
      //   'Content-Type': 'application/json',
      //   Accept: 'application/json',
      // },
      // credentials: 'include',
      body: JSON.stringify(data),
    };
    // }) Headers({
    //   'Authorization': `Basic ${auth}`,
    //   'Content-Type': 'application/json',
    //   'Accept': 'application/json',
    //   // Content-Type: "application/json",
    //   'Content-Length': data.length,
    //   // Custom-Header: "Custom Value"
    // })
    // let newData = this.camundify(data);
    return fetch(url, obj)
      .then(response => {
      if (response.status >= 200 && response.status < 300) {

        console.log(response);
       window.location.reload();
        return response;
      } else {
        console.log('Something happened wrong');
      }
    }).catch(err => err);
    // const headers = {
    //   'Authorization': 'Basic ZGF2aWRnczpUb2J5NjYuTWltZSE=',
    //     'Content-Type': 'application/json',
    //   'User-Agent': 'Paw/ 3.2.2(Macintosh; OS X / 12.2.1) GCDHTTPRequest',
    //   'Accept': '*/*',
    //   'Accept-Language': 'en-us',
    //   'Accept-Encoding': 'gzip, deflate',
    //   'Content-Length': data.length,
    //   'Sec-Fetch-Mode': 'no-cors',
    // };
    // axios.post('https://sentiment.camunda.com:8443/engine-rest/process-definition/key/Airtable/start', data)
    // fetch("https://sentiment.camunda.com:8443/engine-rest/process-definition/key/Airtable/start", {
    //   "method": "POST",
    //   "headers": {
    //     "Authorization": "Basic ZGF2aWRnczpUb2J5NjYuTWltZSE=",
    //     "Content-Type": "application/json",
    //     'Sec-Fetch-Mode': 'no-cors',
    //     "User-Agent": "Paw/ 3.2.2(Macintosh; OS X / 12.2.1) GCDHTTPRequest"
    //   },
    //   "body": {
    //     "variables": {
    //       "orbit_query": {
    //         "value": "organization",
    //         "type": "String"
    //       },
    //       "orbit_token": {
    //         "value": "obu_oMdW2GEjOJiTIVxx2AS38l9OM8ptwasx_ddqJ5yA",
    //         "type": "String"
    //       },
    //       "base_id": {
    //         "value": "appEwylHyYb8LQNaN",
    //         "type": "String"
    //       },
    //       "workplace_slug": {
    //         "value": "camunda",
    //         "type": "String"
    //       },
    //       "table_name": {
    //         "value": "Organizations",
    //         "type": "String"
    //       },
    //       "direction": {
    //         "value": "DESC",
    //         "type": "String"
    //       },
    //       "sort_string": {
    //         "value": "members_count",
    //         "type": "String"
    //       },
    //       "airtable_token": {
    //         "value": "keycNYs4vDaTYWIQQ",
    //         "type": "String"
    //       },
    //       "items": {
    //         "value": "50",
    //         "type": "String"
    //       }
    //     }
    //   }
    // })
    //   .then((res) => res.text())
    //   .then(console.log.bind(console))
    //   .catch(console.error.bind(console));

  }

  render() {
    return (
      <div className='App d-flex flex-column align-items-center'>
        <h1>Data Fetch Details</h1>
        <Form name="translate" className="align-items-center" style={{ width: '90%' }} >
          <Form.Group>
            <Row className="mb-3">
              <Dropdown onSelect={eventKey => {
                var g = eventKey === 'orgs' ? 'block' : 'none';
                this.setState({
                  service: eventKey,
                  orgs: g,
                });
              }}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Select Service
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item key="orgs" eventKey="orgs">Organizations</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Row>
          </Form.Group>
        </Form>
        <div className="align-items-left" style={{ display: this.state.orgs, width: '90%' }}>
          <div><h3>Fetching data for: Organizations</h3></div>
          <Form name="fetch-orgs" className="aligb-items-left" style={{ width: '90%' }} >
              <Form.Group as={Row} className="mb-3" controlId="formGridDirection">
              <FormLabel column sm={4}>Direction</FormLabel>
              <Col sm={2}>
                <Dropdown id="direction" name="direction"
                  onSelect={eventKey => {
                    this.setState({
                      direction: eventKey,
                    });
                  }}
                >
                  <Dropdown.Toggle variant="primary" id="dropdown-flags" className="text-left" >
                    {this.state.direction}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item key="DESC" eventKey="DESC">DESC</Dropdown.Item>
                    <Dropdown.Item key="ASC" eventKey="ASC">ASC</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col sm={6}>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formGridAmount">
              <FormLabel column sm={4}>Items</FormLabel>
              <Col sm={2}>
                <Dropdown id="items" name="items"
                  onSelect={eventKey => {
                    this.setState({
                      items: eventKey,
                    });
                  }}
                >
                  <Dropdown.Toggle variant="primary" id="dropdown-flags" className="text-left" >
                    {this.state.items}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item key="10" eventKey="10">10</Dropdown.Item>
                    <Dropdown.Item key="25" eventKey="25">25</Dropdown.Item>
                    <Dropdown.Item key="50" eventKey="50">50</Dropdown.Item>
                    <Dropdown.Item key="75" eventKey="75">75</Dropdown.Item>
                    <Dropdown.Item key="100" eventKey="100">100</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col sm={6}>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formGridAmount">
              <FormLabel column sm={4}>Sort By</FormLabel>
              <Col sm={2}>
                <Dropdown id="sort" name="sort"
                  onSelect={eventKey => {
                    this.setState({
                      sort_string: eventKey,
                    });
                  }}
                >
                  <Dropdown.Toggle variant="primary" id="dropdown-flags" className="text-left" >
                    {this.state.sort_string}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item key="name" eventKey="name">Name</Dropdown.Item>
                    <Dropdown.Item key="website" eventKey="website">Website</Dropdown.Item>
                    <Dropdown.Item key="members_count" eventKey="members_count">Members Count</Dropdown.Item>
                    <Dropdown.Item key="employees_count" eventKey="employees_count">Employees Count</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col sm={6}>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formGridConfig">
              <FormLabel column sm={4}>Show Configuration</FormLabel>
              <Col sm={2}>
                <Form.Check
                  checked={this.state.checked}
                  as='input'
                  name='show_config'
                  type="switch"
                  key="show_config"
                  id="custom-switch"
                  aria-label="Show Configuration"
                  onChange={(checked) => {
                    var c = !this.state.checked;
                    console.log("Checked: ", c);
                    var s = c ? 'block' : 'none';
                    console.log("State: ", s)
                    this.setState({
                      checked: c,
                      show_config: s
                    })
                  }}

                            />
              </Col>
              <div className="align-items-left" style={{ display: this.state.show_config, width: '90%' }}>
                <h2 align-items="center">Orbit Configuration</h2>
                <Form.Group as={Row} className="mb-3" controlId="formGridSlug">
                  <FormLabel column sm={4}>Orbit Token</FormLabel>
                  <Col sm={8}>
                    <Form.Control name="orbit_token" type="text" value={this.state.orbit_token} onChange={this.handleChange} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formGridSlug">
                  <FormLabel column sm={4}>Workplace Slug</FormLabel>
                  <Col sm={8}>
                    <Form.Control name="workplace_slug" type="text" value={this.state.workplace_slug} onChange={this.handleChange} />
                  </Col>
                </Form.Group>
                <h3 align-items="center">Airtable Configuration</h3>
                <Form.Group as={Row} className="mb-3" controlId="formGridSlug">
                  <FormLabel column sm={4}>Airtable Token</FormLabel>
                  <Col sm={8}>
                    <Form.Control name="airtable_token" type="text" value={this.state.airtable_token} onChange={this.handleChange} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formGridSlug">
                  <FormLabel column sm={4}>Base ID</FormLabel>
                  <Col sm={8}>
                    <Form.Control name="base_id" type="text" value={this.state.base_id} onChange={this.handleChange} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formGridSlug">
                  <FormLabel column sm={4}>Table Name</FormLabel>
                  <Col sm={8}>
                    <Form.Control name="table_name" type="text" value={this.state.table_name} onChange={this.handleChange} />
                  </Col>
                </Form.Group>
              </div>
            </Form.Group>
            <Button type='submit' onClick={this.handleSubmit}>Submit</Button>
          </Form>
        </div>
      </div>
    )
  }
}
