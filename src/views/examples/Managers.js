import React from 'react';

// reactstrap components
import { Card, Container, Row, CardHeader, Table } from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import Manager from "components/ManagersPage/Manager.js"
const managers = [
  { name: 'm1_name', surname: 'm1_surname', username : 'manager_1', date: '26.08.20', status: 'status', groups : [true, false, false] },
  { name: 'm2_name', surname: 'm2_surname', username : 'manager_2', date: '26.08.20', status: 'status', groups : [false, true, false] },
  { name: 'm3_name', surname: 'm3_surname', username : 'manager_3', date: '26.08.20', status: 'status', groups : [false, false, true] },
  { name: 'm4_name', surname: 'm4_surname', username : 'manager_4', date: '26.08.20', status: 'status', groups : [true, true, false] },
  { name: 'm5_name', surname: 'm5_surname', username : 'manager_5', date: '26.08.20', status: 'status', groups : [true, false, true] },
  { name: 'm6_name', surname: 'm6_surname', username : 'manager_6', date: '26.08.20', status: 'status', groups : [false, true, true] },
  { name: 'm7_name', surname: 'm7_surname', username : 'manager_7', date: '26.08.20', status: 'status', groups : [true, true, true] },
  { name: 'm8_name', surname: 'm8_surname', username : 'manager_8', date: '26.08.20', status: 'status', groups : [false, false, false]},
]
class Managers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        managers : managers,
    }
    
    this.deleteManager = this.deleteManager.bind(this)
  }

  deleteManager(e) { 
      let managers = this.state.managers
      delete managers[parseInt(e.target.dataset.index, 10)]
      this.setState({
          managers : managers
      })
  }


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
                <h2>Менеджеры</h2>
                    <Table className="align-items-center table-flush" responsive>
                        <thead>
                            <tr className="mt-row">
                                <th><h5>Менеджер</h5></th>
                                <th>Имя</th>
                                <th>Фамилия</th>
                                <th>Дата</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.managers.map(
                                    (manager, index) => {
                                        return (<Manager username={ manager.username } name={ manager.name }
                                        surname={ manager.surname } date={ manager.date }
                                        deleteManager={ this.deleteManager } index={ index }
                                        status={ manager.status } key={ index }/>) 
                                    }
                                )
                                
                            }
                        </tbody>
                    </Table>
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