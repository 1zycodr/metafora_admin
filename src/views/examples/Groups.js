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
import { ajax } from 'rxjs/ajax';
import { groupBy, map, mergeMap, reduce, switchMap } from 'rxjs/operators';
import { request, getToken } from 'config';

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
    this.getGroups()
  }
  getGroups() {
    const result = { first: [], last: [] };
    ajax({
      url: request(`group`),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': getToken(),
      }
    }).pipe(
      switchMap(res => res.response.data),
      map(group => {
        return {...group, parent: []}
      }),
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
            result.last.forEach(lst => {
              if (last.id === lst.parentID && last.parent.length === 0) {
                last.parent.push(lst)
              }
            })
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
                  { done ? <Loading /> : <DragTableGroup groups={groups} getGroups={this.getGroups} /> }
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
