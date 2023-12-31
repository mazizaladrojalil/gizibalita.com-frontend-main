import { Button, Result } from "antd";
import React from "react";

export default function NotFound() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary">
          <a href="/">Back Home</a>
        </Button>
      }
    />
  );
}
