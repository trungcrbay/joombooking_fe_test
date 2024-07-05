import useQueryConfig from "@/hooks/uesQueryConfig";
import {
  Button,
  Checkbox,
  Drawer,
  Flex,
  Form,
  Radio,
  RadioChangeEvent,
  Space,
} from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormProps } from "rc-field-form";
import React, { useState } from "react";
type Filter = {
  isOpenFilter: boolean;
  setIsOpenFilter: (value: boolean) => void;
};

type FieldType = {
  order_by?: string;
  sort_by?: string;
  filter_age?: string;
};

const DrawerFilter = ({ isOpenFilter, setIsOpenFilter }: Filter) => {
  const [order, setOrder] = useState("asc");
  const [sortField, setSortField] = useState("name");
  const [ageFilter, setAgeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const queryConfig = useQueryConfig();
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const newParams = new URLSearchParams(params.toString());
  const { sortBy, sortOrder, name, address, email, phone, status } =
    queryConfig;
  const [form] = Form.useForm();

  const onChangeSortOrder = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setOrder(e.target.value);
    form.setFieldValue("order_by", value);
  };

  const onChangeSortBy = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setSortField(e.target.value);
    form.setFieldValue("sort_by", value);
  };

  const onChangeFilterAge = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setAgeFilter(e.target.value);
    form.setFieldValue("filter_age", value);
  };

  const onChangeFilterStatus = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setStatusFilter(e.target.value);
    form.setFieldValue("filter_status", value);
  };
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const formValues = form.getFieldsValue();
    console.log("Success:", formValues);
    sortField && newParams.set("sortBy", sortField);
    order && newParams.set("sortOrder", order);
    if (ageFilter.includes(">")) {
      newParams.delete("lt");
      newParams.set("gt", ageFilter.slice(1, 4));
    }
    if (ageFilter.includes("<")) {
      newParams.delete("gt");
      newParams.set("lt", ageFilter.slice(1, 4));
    }

    statusFilter && newParams.set("status", statusFilter);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const resetValue = () => {
    setOrder("");
    setSortField("");
    setAgeFilter("");
    setStatusFilter("");
    router.replace(`${pathname}`);
  };

  return (
    <>
      <Drawer
        title="Filter, Sort"
        placement="left"
        closable={false}
        width={300}
        onClose={() => setIsOpenFilter(false)}
        open={isOpenFilter}
        key="left"
      >
        <Form
          name="basic"
          style={{ maxWidth: 600 }}
          form={form}
          initialValues={{
            order_by: order,
            sort_by: sortField,
            filter_age: ageFilter,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item name="order_by">
            <h1 className="font-bold text-[20px]">Order by</h1>
            <Radio.Group value={order} onChange={onChangeSortOrder}>
              <Space direction="vertical">
                <Radio value={"asc"}>Asc</Radio>
                <Radio value={"desc"}>Desc</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="sort_by">
            <h1 className="font-bold text-[20px]">Sort by</h1>
            <Radio.Group value={sortField} onChange={onChangeSortBy}>
              <Space direction="vertical">
                <Radio value={"name"}>Name</Radio>
                <Radio value={"address"}>Address</Radio>
                <Radio value={"email"}>Email</Radio>
                <Radio value={"age"}>Age</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="filter_age">
            <h1 className="font-bold text-[20px]">Filter</h1>
            <Radio.Group value={ageFilter} onChange={onChangeFilterAge}>
              <Space direction="vertical">
                <Radio value={">30"}>Age &gt; 30</Radio>
                <Radio value={"<50"}>Age &lt; 50</Radio>
                <Radio value={"<20"}>Age &lt; 20</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="filter_status">
            <Radio.Group value={statusFilter} onChange={onChangeFilterStatus}>
              <Space direction="vertical">
                <Radio value={"1"}>Active</Radio>
                <Radio value={"0"}>Inactive</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Flex gap={8}>
            <Button
              className="w-[100px]"
              htmlType="button"
              onClick={resetValue}
            >
              Reset
            </Button>
            <Button className="w-[100px]" htmlType="submit">
              Apply
            </Button>
          </Flex>
        </Form>
      </Drawer>
    </>
  );
};

export default DrawerFilter;
