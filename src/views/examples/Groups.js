/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import DragTableGroup from "components/DragGroups/DragTableGroup.js";
import Loading from "components/Loading.js";
import Controller from "components/DragGroups/Controller.js";

class Groups extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      done: true,
      groups: [],
    }
    this.controller = new Controller();
    this.getGroups = this.controller.fetchData.bind(this);
  }
  componentWillMount() {
    // Первичный запрос групп
    this.controller.fetchData();
    // Тригер получения результата
    this.controller.doneFetch = groups => {
      this.setState({ groups, done: false })
    }
  }

  render() {
    const { done, groups } = this.state;
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Группы</h3>
                </CardHeader>
                <CardBody>
                  { done ? <Loading /> : <DragTableGroup controller={this.controller} groups={groups} getGroups={this.getGroups} /> }
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Groups;
