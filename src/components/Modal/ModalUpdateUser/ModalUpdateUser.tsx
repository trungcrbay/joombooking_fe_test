import { userApi } from "@/api/user.api";
import { IUser } from "@/types/users.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Modal, Col, Row, Button, message, Select } from "antd";
import React, { Dispatch, SetStateAction, useEffect } from "react";

type Props = {
  isUpdateUser: boolean;
  setIsUpdateUser: Dispatch<SetStateAction<boolean>>;
  dataView: IUser | null;
};

export type IUpdateUser = Pick<
  IUser,
  "name" | "address" | "phone" | "email" | "age" | "status"
>;

type UpdateUserParams = {
  id: string;
  body: IUpdateUser;
};

const ModalUpdateUser = ({
  isUpdateUser,
  setIsUpdateUser,
  dataView,
}: Props) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const handleUpdateUserMutation = useMutation({
    mutationFn: ({ id, body }: UpdateUserParams) => {
      return userApi.updateUser(id, body);
    },
    onSuccess: (data) => {
      message.success(data.data.message);
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsUpdateUser(false);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const handleOk = () => {
    form.submit();
  };

  console.log("dataview: ", dataView);
  const onFinish = (values: IUpdateUser) => {
    if (dataView?._id) {
      handleUpdateUserMutation.mutate({ id: dataView._id, body: values });
    } else {
      message.error("User ID is missing");
    }
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    if (dataView) {
      form.setFieldsValue(dataView);
    }
  }, [dataView]);

  return (
    <Modal
      title="Update User"
      open={isUpdateUser}
      onCancel={() => setIsUpdateUser(false)}
      width={800}
      onOk={handleOk}
      footer={[
        <Button
          key="cancel"
          htmlType="button"
          form="addUser"
          onClick={() => setIsUpdateUser(false)}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          htmlType="button"
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
        onFinish={onFinish}
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
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={24}>
            <Form.Item
              name="age"
              label="Age"
              rules={[
                {
                  message: "Age must be number!",
                  pattern: new RegExp(/^[0-9]+$/),
                },
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
          <Col xs={24} md={24}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Status is required" }]}
            >
              {/* <Input suffix={<ChevronDown />} name="status" /> */}
              <Select
                style={{ width: 120 }}
                onChange={handleChange}
                options={[
                  { value: true, label: "Active" },
                  { value: false, label: "Inactive" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalUpdateUser;

/*docs validator: https://stackoverflow.com/questions/72599933/how-to-validate-if-one-number-is-greater-than-other-inside-form-rule
https://ant.design/components/form#components-form-demo-register */
