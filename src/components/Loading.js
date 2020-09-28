import React from "react";
import { Spinner } from "reactstrap";

class Loading extends React.Component {
  render() {
    return (
      <div className="loading">
        <Spinner type="grow" color="blue" />
        <div className="loading-title text-blue">Подождите ...</div>
      </div>
    )
  }
}

export default Loading;