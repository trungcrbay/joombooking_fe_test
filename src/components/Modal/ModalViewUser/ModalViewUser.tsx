"use client";
import React, { Dispatch, SetStateAction } from "react";
import { Form, Input, Space, Modal, Col, Row } from "antd";
import { IUser } from "@/types/users.type";
type Props = {
  isViewUser: boolean;
  setIsViewUser: Dispatch<SetStateAction<boolean>>;
  dataView: IUser | null;
};

const ModalViewUser = ({ isViewUser, setIsViewUser, dataView }: Props) => {
  const handleOk = () => {
    setIsViewUser(false);
  };

  return (
    <>
      <Modal
        title="User Info"
        open={isViewUser}
        onOk={handleOk}
        width={800}
        onCancel={() => setIsViewUser(false)}
      >
        <Form name="validateOnly" layout="vertical" autoComplete="off">
          <Form.Item name="id" label="User Id">
            <Input defaultValue={dataView?._id} readOnly />
          </Form.Item>
          <Row gutter={[8, 8]}>
            <Col xs={24} md={12}>
              <Form.Item name="name" label="Name">
                <Input defaultValue={dataView?.name} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="email" label="Email">
                <Input defaultValue={dataView?.email} readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item name="phone" label="Phone">
                <Input defaultValue={dataView?.phone} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="address" label="Address">
                <Input defaultValue={dataView?.address} readOnly />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalViewUser;
