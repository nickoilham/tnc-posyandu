import Cookies from "js-cookie";

export const setCookie = (name: string, data: string) => {
	// Set cookie with a 7-day expiration (adjust as needed)
	Cookies.set(name, JSON.stringify(data), { expires: 7 });
};

export const removeCookie = (name: string) => {
	// Hapus cookie dengan nama yang sesuai
	Cookies.remove(name);
};

export const getCookie = (name: string) => {
	// Retrieve the cookie by name
	const cookieValue = Cookies.get(name);

	if (cookieValue) {
		// If the cookie exists, parse the JSON string (assuming the data is stored as JSON)
		try {
			return JSON.parse(cookieValue);
		} catch (error) {
			return null;
		}
	}

	return null; // Return null if the cookie doesn't exist
};
