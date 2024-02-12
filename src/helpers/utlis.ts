export function formatDateToMonthYear(inputDate: string): string {
	// Parse the date string to create a Date object
	var dateArray = inputDate.split("/").map((part) => parseInt(part));
	var date = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]); // Month is 0-based

	// Create an array of month names
	var monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	// Format the output as "Month Year"
	var formattedDate = monthNames[date.getMonth()] + " " + date.getFullYear();

	return formattedDate;
}
