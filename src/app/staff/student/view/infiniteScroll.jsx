"use client";
"use strict";

import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Divider, Skeleton, Statistic, Card, Row, Col } from "antd";
import Table from "./table";
import axios from "@/lib/axiosPrivate";
import DepProSemCouSelect from "../../components/depProSemCouSelect";

const App = () => {
	const [loading, setLoading] = useState(false);
	const [initialLoad, setInitialLoading] = useState(true);
	const [data, setData] = useState([]);
	const [startIndex, setStartIndex] = useState(0);
	const [totalDataCount, setTotalDataCount] = useState(1);
	const [searchText, setSearchText] = useState([""]);
	const [searchedColumn, setSearchedColumn] = useState([""]);
	const [sorterField, setSorterField] = useState("");
	const [sorterOrder, setSorterOrder] = useState("");
	const [hasMoreData, setHasMoreData] = useState(true);
	const [addedDataLength, setAddedDataLength] = useState(0);
	const [program, setProgram] = useState(undefined);
	const [semester, setSemester] = useState(undefined);

	const getTotalDataCount = async () => {
		const result = await axios.get("/api/staff/student/count", {
			params: {
				programId: program,
				semester,
			},
		});
		setTotalDataCount(result.data);
	};

	const loadMoreData = ({ search = false, reset = false }) => {
		if (loading) {
			return;
		}
		const resultsPerPage = 50;

		setLoading(true);

		getTotalDataCount();

		axios
			.get(`/api/staff/student/list`, {
				params: {
					query: reset ? [""] : searchText,
					column: reset ? [""] : searchedColumn,
					sortField: reset ? "" : sorterField,
					sortOrder: reset ? "" : sorterOrder,
					limit: resultsPerPage,
					offset: search || reset ? 0 : startIndex,
				},
			})
			.then((response) => {
				const newData = response.data;
				setAddedDataLength(newData.length);
				if (search || reset) {
					setData(newData);
					setStartIndex(newData.length);
					setAddedDataLength(newData.length);
					setLoading(false);
				} else {
					setData([...data, ...newData]);
					setStartIndex(startIndex + newData.length);
				}
				setLoading(false);
				setInitialLoading(false);
				return true;
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
				setLoading(false);
				return false;
			});
	};

	useEffect(() => {
		getTotalDataCount();
		loadMoreData({});
	}, []);

	useEffect(() => {
		if (!initialLoad) loadMoreData({ search: true });
	}, [sorterOrder, searchText, searchedColumn, sorterField]);

	useEffect(() => {
		setStartIndex(0);
		if (!initialLoad) loadMoreData({ search: true });
	}, [sorterOrder, sorterField]);

	useEffect(() => {
		if (addedDataLength < 50) {
			setHasMoreData(false);
		} else {
			setHasMoreData(data.length < totalDataCount);
		}
	}, [data, totalDataCount]);

	const handleReset = () => {
		setStartIndex(0);
		setSearchText([""]);
		setSorterField("");
		setSorterOrder("");
		setSearchedColumn([""]);
	};

	useEffect(() => {
		if (program && (semester || semester === 0)) {
			setSearchedColumn(["programId", "semester"]);
			setSearchText([program, semester]);
		} else if (program) {
			setSearchedColumn(["programId"]);
			setSearchText([program]);
		} else if (semester) {
			setSearchedColumn(["semester"]);
			setSearchText([semester]);
		}
	}, [program, semester]);

	return (
		<div>
			<Row gutter={16}>
				<Col span={20}>
					<DepProSemCouSelect
						courseField={false}
						value={(value) => {
							if (value.program) {
								setProgram(value.program);
							}
							if (value.semester || value.semester === 0) {
								setSemester(value.semester);
							}
						}}
					/>
				</Col>
				<Col span={4}>
					<Card bordered={false}>
						<Statistic
							title="Total Students"
							value={totalDataCount}
							valueStyle={{ color: "green" }}
						/>
					</Card>
				</Col>
			</Row>
			<InfiniteScroll
				dataLength={data.length}
				next={() => loadMoreData({})}
				hasMore={hasMoreData}
				loader={
					<Skeleton
						avatar
						paragraph={{
							rows: 1,
						}}
						active
					/>
				}
				endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
				scrollableTarget="scrollableDiv"
			>
				<Table
					dataSource={data}
					setDataSource={setData}
					loading={loading}
					setSorterField={setSorterField}
					setSorterOrder={setSorterOrder}
					setSearchText={setSearchText}
					searchedColumn={searchedColumn}
					setSearchedColumn={setSearchedColumn}
					searchText={searchText}
					handleReset={handleReset}
				/>
			</InfiniteScroll>
		</div>
	);
};
export default App;
