import React from 'react';

// reactstrap components
import { Card, Container, Row, CardHeader } from "reactstrap";
// core components
import Header from "components/Headers/Header.js";

class Managers extends React.Component {
  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Менеджеры</h3>
                </CardHeader>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    )
  }
}

export default Managers;