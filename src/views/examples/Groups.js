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
import { timer, from } from "rxjs";
import { groupBy, map, mergeMap, reduce } from 'rxjs/operators';

const allgroups = [
  { id:1,	parentID:0,	name: "almaty",	title: "Алматы", view: 1,	date: "2020-08-19 05:12:30",	status: 1 },
  { id:2,	parentID:1,	name: "managers_one",	title: "Менеджеры 1",	view: 0,	date: "2020-08-19 05:12:30",	status: 1 },
  { id:3,	parentID:1,	name: "managers_two",	title: "Менеджеры 2",	view: 0,	date: "2020-08-19 05:12:30",	status: 1 },
  { id:5,	parentID:4,	name: "managers_tree",	title: "Менеджеры 3",	view: 0,	date: "2020-08-19 05:12:30",	status: 1 },
  { id:6,	parentID:4,	name: "managers_four",	title: "Менеджеры 4",	view: 0,	date: "2020-08-19 05:12:30",	status: 1 },
  { id:4,	parentID:0,	name: "kustanay",	title: "Кустанай", view: 1,	date: "2020-08-19 05:12:30",	status: 1 },
];
class Groups extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      done: true,
      groups: [],
    }
    this.getGroups = this.getGroups.bind(this);
  }
  componentWillMount() {
    timer(500).subscribe(this.getGroups)
  }
  getGroups() {
    const result = { first: [], last: [] };
    from(allgroups).pipe(
      map(group => ({...group, parent: []})),
      groupBy(group => group.parentID === 0),
      mergeMap(group$ =>
        group$.pipe(reduce((acc, cur) => [...acc, cur], [`${group$.key}`]))
      ),
    )
    .subscribe(
      arr => {
        if(arr[0] === "true") {
          result.first =  arr.slice(1);
        } else {
          result.last = arr.slice(1);
        }
      },
      error => console.log(error),
      () => {
        const groups = result.first.map(group => {
          result.last.forEach(last => {
            if(group.id === last.parentID){
              group.parent.push(last);
            }
          })
          return group;
        })
        this.setState({ groups, done: false })
      },
    )
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
                  { done ? <Loading /> : <DragTableGroup groups={groups} /> }
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
