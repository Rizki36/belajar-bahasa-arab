import { useState } from "react";

const usePagination = () => {
	const [pagination, setPagination] = useState({
		pageSize: 20,
		pageIndex: 0,
	});
	const { pageSize, pageIndex } = pagination;

	return {
		limit: pageSize,
		onPaginationChange: setPagination,
		pagination,
		skip: pageSize * pageIndex,
	};
};

export default usePagination;
