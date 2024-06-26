"use client";
"use strict";

import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Divider, Skeleton } from "antd";
import Table from "./table";
import axios from "@/lib/axiosPrivate";

const App = () => {
	const [loading, setLoading] = useState(false);
	const [initialLoad, setInitialLoading] = useState(true);
	const [data, setData] = useState([]);
	const [startIndex, setStartIndex] = useState(0);
	const [totalDataCount, setTotalDataCount] = useState(1);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const [sorterField, setSorterField] = useState("");
	const [sorterOrder, setSorterOrder] = useState("");
	const [hasMoreData, setHasMoreData] = useState(true);
	const [addedDataLength, setAddedDataLength] = useState(0);

	const getTotalDataCount = async () => {
		axios
			.get("/api/staff/exams/count")
			.then((result) => {
				setTotalDataCount(result.data);
			})
			.catch((error) => {
				if (error.response && error.response.status !== 403) {
					message.error("Something went wrong!");
				}
				console.error("API call failed:", error);
			});
	};

	const loadMoreData = ({ search = false, reset = false }) => {
		if (loading) {
			return;
		}
		const resultsPerPage = 30;
		setLoading(true);
		axios
			.get(`/api/staff/exams/`, {
				params: {
					query: reset ? "" : searchText,
					column: reset ? "" : searchedColumn,
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
				if (error.response && error.response.status !== 403)
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
		if (initialLoad) loadMoreData({ search: true });
	}, [sorterOrder, sorterField]);

	useEffect(() => {
		if (addedDataLength < 30) {
			setHasMoreData(false);
		} else {
			setHasMoreData(data.length < totalDataCount);
		}
	}, [data, totalDataCount]);

	const handleReset = () => {
		setStartIndex(0);
		setSearchText("");
		setSorterField("");
		setSorterOrder("");
		setSearchedColumn("");
	};

	return (
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
			className="mt-3"
		>
			<Table
				dataSource={data}
				setData={setData}
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
	);
};
export default App;
