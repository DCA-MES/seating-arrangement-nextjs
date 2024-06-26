"use client";

import React, { useState, useEffect } from "react";
import {
	Input,
	Button,
	Row,
	Col,
	Form,
	Divider,
	Card,
	message,
	Alert,
	FloatButton,
} from "antd";
import { CloseOutlined, FileExcelOutlined } from "@ant-design/icons";
import axios from "@/lib/axiosPrivate";
import Link from "next/link";
import BlockTable from "./table";

const DynamicBlockForm = () => {
	const [form] = Form.useForm();
	const [error, setError] = useState(null); // State to store error messages
	const [data, setData] = useState([]);

	const handleSubmission = async (values) => {
		// console.log("Submitted values:", values);

		try {
			const result = await axios.post("/api/staff/block", {
				blocks: values.blocks,
			});
			if (result.status === 200) {
				message.success("Submitted successfully");
				setData([...values.blocks, ...data]);
				setError(null); // Clear any previous errors
			} else message.error("Submit failed");
		} catch (error) {
			// console.log(error);
			if (error.response.status === 400) {
				message.error(
					`Block with ID '${error.response.data.value}' already exists`,
				);
			} else {
				setError("Something went wrong. Please try again."); // Set the error message
			}
		}
	};

	const onFinishFailed = (errorInfo) => {
		message.warning("Block Name and ID are required");
	};

	const handleAlertClose = () => {
		setError(null); // Clear the error message
	};

	useEffect(() => {
		form.setFieldsValue({ blocks: [{}] });
	}, [form]);

	return (
		<div className="p-3">
			<Link href={"/staff/forms/block/import"}>
				<FloatButton
					tooltip={<div>Import</div>}
					icon={<FileExcelOutlined />}
					type="primary"
				/>
			</Link>
			{error && (
				<Alert
					message="Error"
					description={error}
					type="error"
					closable
					onClose={handleAlertClose}
					style={{ marginBottom: 16 }}
				/>
			)}
			<Form
				name="main"
				onFinish={handleSubmission}
				form={form}
				initialValues={{
					blocks: [{}],
				}}
				onFinishFailed={onFinishFailed}
			>
				<Form.List name="blocks">
					{(fields, { add, remove }) => (
						<div
							style={{
								display: "flex",
								rowGap: 16,
								flexDirection: "column",
							}}
						>
							{fields.map((field) => (
								<Card
									size="small"
									title={`Block ${field.name + 1}`}
									key={field.key}
									extra={
										<CloseOutlined
											onClick={() => {
												remove(field.name);
											}}
										/>
									}
								>
									{/* <Row gutter={16}> */}
									{/* <Col xs={24} md={24} lg={7} xxl={7}> */}
									<Form.Item
										name={[field.name, "id"]}
										label="Block ID"
										rules={[
											{
												required: true,
												message: "Please enter the Block ID",
											},
										]}
									>
										<Input />
									</Form.Item>
									{/* </Col> */}
								</Card>
							))}
							<Button type="primary" onClick={() => add()} block>
								+ Add Block
							</Button>
						</div>
					)}
				</Form.List>
				<Divider />
				<Row gutter={16}>
					<Col sm={24} md={5}>
						<Button ghost type="primary" htmlType="submit">
							Submit All
						</Button>
					</Col>
				</Row>
			</Form>

			{/* display */}
			<Card size="small" title={null} style={{ marginTop: 16 }}>
				<BlockTable data={data} setData={setData} />
			</Card>
		</div>
	);
};

export default DynamicBlockForm;
