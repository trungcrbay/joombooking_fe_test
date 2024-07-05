import { IUser } from "@/types/users.type";
import React, { Dispatch, SetStateAction } from "react";
import { Button, Col, Form, Input, Modal, Row, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/api/user.api";

type Props = {
  isModalAddUser: boolean;
  setIsModalAddUser: Dispatch<SetStateAction<boolean>>;
};

type IPostUser = Pick<
  IUser,
  "name" | "address" | "phone" | "email" | "status" | "age"
>;

const ModalAddUser = ({ isModalAddUser, setIsModalAddUser }: Props) => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  const handleCreateUserMutation = useMutation({
    mutationFn: (body: IPostUser) => {
      return userApi.createUser(body);
    },
    onSuccess: (data) => {
      message.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      form.resetFields();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const handleOk = () => {
    form
      .validateFields()
      .then((values: IPostUser) => {
        handleCreateUserMutation.mutate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <>
      <Modal
        title="Add New User"
        open={isModalAddUser}
        onCancel={() => setIsModalAddUser(false)}
        width={800}
        footer={[
          <Button
            htmlType="button"
            form="addUser"
            onClick={() => setIsModalAddUser(false)}
          >
            Cancel
          </Button>,
          <Button
            htmlType="submit"
            type="primary"
            form="addUser"
            onClick={handleOk}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          name="validateOnly"
          id="addUser"
          layout="vertical"
          autoComplete="off"
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xs={24} md={24}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={24}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    message: "The input is not valid Email!",
                    type: "email",
                  },
                  { required: true, message: "Email is required!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={24}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  {
                    message: "Phone must be number!",
                    pattern: new RegExp(/^[0-9]+$/),
                  },
                  { min: 10, message: "Phone must be minimum 10 numbers." },
                  { max: 20, message: "Phone must be maximum 20 numbers." },
                  { required: true, message: "Phone is required!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={24}>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "Address is required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={24}>
              <Form.Item
                name="age"
                label="Age"
                rules={[
                  {
                    message: "Age must be number!",
                    pattern: new RegExp(/^[0-9]+$/),
                  },
                  { min: 1, message: "Age must be minimum 1 number." },
                  { max: 3, message: "Age must be maximum 3 numbers." },
                  {
                    validator: (_, value) => {
                      if (value < 18) {
                        return Promise.reject(
                          new Error("Age must be minimum 18")
                        );
                      }
                      if (value > 70) {
                        return Promise.reject(
                          new Error("Age must be maximum 70")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                  { required: true, message: "Age is required!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddUser;
