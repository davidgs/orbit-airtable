import React from 'react';
import Form from 'react-bootstrap/Form';
import { FloatingLabel, FormLabel, Col, Row, Button, Dropdown } from 'react-bootstrap';
import CountryDrop from './CountryDrop';
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import 'bootstrap/dist/css/bootstrap.css';


export class Translate extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      workplace_slug: 'camunda',
      direction: 'Select',
      items: 'Select',
      sort_string: 'name',
      base_id: 'appNaNFooooF',
      table_name: 'Table 1',
      orgs: 'none',
      deepl: 'none',
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
    const { projectID, projectEmail, privateKey, language } = this.state;
    const formData = {
      variables: {
        projectID: { value: projectID, type: 'string' },
        projectEmail: { value: projectEmail, type: 'string' },
        privateKey: { value: privateKey, type: 'string' },
        language: { value: language, type: 'string' },
        service: { value: 'google', type: 'string' },
      }
    };
    this.submitForm(formData);
    //https://davidgs.com:8443/engine-rest/process-definition/key/Process_1i8evdw/submit-form
    console.log("handleSubmit", formData);
    const { onSubmit } = this.props;
    //onSubmit({ name, email, subject, comment });
    console.log("Submit: ", projectID, projectEmail, privateKey, language);
  }


  submitForm(data) {
    // return fetch('https://davidgs.com:8443/engine-rest/process-definition/key/Process_1i8evdw/submit-form', {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }).then(response => {
    //   if (response.status >= 200 && response.status < 300) {

    //     console.log(response);
    //     // window.location.reload();
    //     return response;
    //   } else {
    //     console.log('Somthing happened wrong');
    //   }
    // }).catch(err => err);
    console.log("submitForm", data);
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
                var d = eventKey === 'deepl' ? 'block' : 'none';
                this.setState({
                  service: eventKey,
                  orgs: g,
                  deepl: d,
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
              <Form.Group as={Row} className="mb-3"  controlId="formGridSlug">
              <FormLabel column sm={4}>Workplace Slug</FormLabel>
              <Col sm={8}>
                <Form.Control name="workplace_slug" type="text" value={this.state.workplace_slug} onChange={this.handleChange} />
              </Col>
              </Form.Group>
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
                    <Dropdown.Item key="DSC" eventKey="DSC">DSC</Dropdown.Item>
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
            <Row className="mb-3" style={{ display: this.state.google }}>
              <Form.Group as={Col}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Google Project Email"
                  className="mb-3"
                >
                  <Form.Control name="projectEmail" type="email" value={this.state.projectEmail} onChange={this.handleChange}
                  />
                </FloatingLabel>
              </Form.Group>
            </Row>
            <p></p>
            <Row style={{ display: this.state.google }}>
              <Form.Group>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Private Key"
                  className="mb-3"
                >
                  <Form.Control name="privateKey" as='textarea' value={this.state.privateKey} rows="300"
                    onChange={this.handleChange}
                    style={{
                      height: '100px',
                      width: '100%',
                      border: '1px solid #ccc',
                    }}
                  />
                </FloatingLabel>
              </Form.Group>
            </Row>
            <Row>

              <Col lg={3}>
                <Form.Group>
                  <CountryDrop id="googleSourceLang" name="Source Language" service="google" />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group>
                  <CountryDrop id="googleTargetLang" name="Target Language" service="google" />
                </Form.Group>
              </Col>


            </Row>
            <Row>
              <p> </p>
            </Row>
            <Button type='submit' onClick={this.handleSubmit}>Submit</Button>
          </Form>
        </div>
        <div style={{ display: this.state.deepl, width: '70%' }}>
          <div><h3>Translation Provider: DeepL</h3></div>
          <Form name="translate-deepl" style={{ width: '70%' }} >
            <Form.Group>
              <Row className="mb-3" >
                <FloatingLabel controlId="floatingInputGrid" label="Deepl Authorization Key">
                  <Form.Control name="deepl_key" type="text" value={this.state.deepl_key} onChange={this.handleChange} />
                </FloatingLabel>
              </Row>
            </Form.Group>
            <p></p>
            <Row>
              <Col lg={3}>
                <Form.Group>
                  <CountryDrop id="deeplSourceLang" name="Source Language" service="deepl" />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group>
                  <CountryDrop id="deeplTargetLang" name="Target Language" service="deepl" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <p> </p>
            </Row>
            <Button type='submit' onClick={this.handleSubmit}>Submit</Button>
          </Form>
        </div>
      </div>
    )
  }
}
