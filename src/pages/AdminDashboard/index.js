import React from 'react'
import { Navbar } from 'react-bootstrap'
import { message} from "antd";

const DashboardAdmin = () => {
    const [messageApi, contextHolder] = message.useMessage();
  return (
    <>
      {contextHolder}
      <Navbar isLogin admin/>
    </>
  )
}

export default DashboardAdmin
