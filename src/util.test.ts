import { getDateFromString } from "./util";

test("Date recognition", async () => {
	expect(getDateFromString("IMG_20200728_093605.jpg")).toBe(
		"2020:07:28 09:36:05"
	);
	expect(getDateFromString("IMG_2020-07-28_09-36-05.jpg")).toBe(
		"2020:07:28 09:36:05"
	);

	expect("ass").toBe("ass");
});
