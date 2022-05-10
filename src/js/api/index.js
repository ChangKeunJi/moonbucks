const baseURL = "http://localhost:3000";

const HTTP_METHOD = {
	POST(data) {
		return {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};
	},

	PUT(data) {
		return {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: data ? JSON.stringify(data) : null,
		};
	},

	DELETE(data) {
		return {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: data ? JSON.stringify(data) : null,
		};
	},
};

const request = async (url, option) => {
	const response = await fetch(url, option);
	if (!response.ok) alert("error!!");
	return response.json();
};

const requestWithoutJson = async (url, option) => {
	const response = await fetch(url, option);
	if (!response.ok) alert("error!!");
	return response;
};

const menuApi = {
	// 메뉴 리스트 불러오기
	async getAllMenuByCategory(category) {
		return request(`${baseURL}/api/category/${category}/menu`);
	},

	// 메뉴 추가 요청
	async addMenu(category, name) {
		return request(
			`${baseURL}/api/category/${category}/menu`,
			HTTP_METHOD.POST({ name })
		);
	},

	async updateMenu(category, id, name) {
		return request(
			`${baseURL}/api/category/${category}/menu/${id}`,
			HTTP_METHOD.PUT({ name })
		);
	},

	async toggleSoldout(category, id) {
		return request(
			`${baseURL}/api/category/${category}/menu/${id}/soldout`,
			HTTP_METHOD.PUT()
		);
	},

	async deleteMenu(category, id) {
		return requestWithoutJson(
			`${baseURL}/api/category/${category}/menu/${id}`,
			HTTP_METHOD.DELETE()
		);
	},
};

export default menuApi;
