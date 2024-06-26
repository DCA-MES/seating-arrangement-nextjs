import React from "react";
import { AuthProvider } from "@/context/auth";
import "./style.css";

const RootLayout = ({ children }) => {
	const authApi = "/api/invigilator";

	return <AuthProvider api={authApi}>{children}</AuthProvider>;
};

export default RootLayout;
