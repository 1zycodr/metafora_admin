import React from 'react'
import {
  Card,
  CardBody,
  Row,
  Col,
  Badge,
} from 'reactstrap';
import moment from 'moment';
import { ajax } from 'rxjs/ajax';
import { switchMap } from 'rxjs/operators';
import { request, getToken } from 'config';


const MapMessage = (props) => {
  const { msg, index } = props;
  console.log(msg, index)
  const params = { size: 9, offset: 3 };
  let author = "Клиент"
  if(msg.chatID){
    params.offset = 0;
    author = msg.chatID > 0 ? 'Менеджер' : 'Бот';
  }
  return(
    <Col sm={params} md={params}>
      <Card className="table">
        <Badge color="primary" className="text-left">{author} { moment(msg.datetime, 'YYYY-MM-DD hh:mm:ss').add(6, 'hours').format('DD.MM.YYYY HH:mm:ss')}</Badge>
        <CardBody>
          {msg.message}
        </CardBody>
      </Card>
    </Col>
  )
}

export default class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.props.room,
      messages: [],
    }
  }
  componentWillMount(){
    this.queryMessages()  
  }
  queryMessages() {
    const { messagesID } = this.state;
    ajax({
      url: request(`message`),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': getToken(),
      },
      body:{
        messagesID: messagesID.split(',').map(id => parseInt(id, 10)),
      }
    }).pipe(
      switchMap(res => res.response.data),
    ).subscribe(
      msg => {console.log([...this.state.messages, msg]);this.setState({ messages: [...this.state.messages, msg] })}, 
      err => {console.log(err); this.setState({ messages: [] })}
    )
  }
  render(){
    const { messages } = this.state;
    return (
      <Row className="limit">{ messages.map((m,i) => <MapMessage key={i} msg={m} index={i}/>)}</Row>
    )
  }
}