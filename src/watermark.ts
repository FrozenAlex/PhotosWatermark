// Consts overrides
let OVERRIDE_LOCATION; // = [40, 20.351588];
let OVERRIDE_TIME; //= [];
const BLACKLIST_NOGPS = true;
const fontSize = 32;

import * as exif from "exif-async";
import * as Jimp from "jimp";
import * as NodeGeocoder from "node-geocoder";
import { getDateFromString, ExifType } from "./util";

// TODO: Detect an appropriate font size from the size of the image
const fontSizes = {
	32: __dirname + "/../fonts/32_white/Roboto_32_White.fnt",
	64: __dirname + "/../fonts/64_white/Roboto_64_White.fnt",
	128: __dirname + "/../fonts/128_white/Roboto_White.fnt",
};

export interface WatermarkOptions {
	fontSize?: 32 | 64 | 128;
}

/**
 * Watermark function
 * @param file Original picture to use
 * @param fileName Original filename to get the date and time from
 */
export async function watermarkPicture(
	file: Buffer,
	fileName: string,
	options?: WatermarkOptions
): Promise<Buffer> {
	// Set up geocoder
	const geocoder = NodeGeocoder({
		provider: "google",
		apiKey: process.env.GOOGLE_API_KEY,
		language: process.env.GOOGLE_API_LANG || "en",
	});

	// Load the font
	const font = await Jimp.loadFont(fontSizes[fontSize]);

	// Get exif data from the buffer
	let exifData: ExifType;
	try {
		exifData = await exif(file);
	} catch (err) {}

	// Get exif location data if it exists
	let latitude, longitude;
	let latitudeDeg, longitudeDeg;

	if (exifData?.gps?.GPSLatitude) {
		// Get raw values
		latitude = exifData.gps.GPSLatitude;
		longitude = exifData.gps.GPSLongitude;

		latitudeDeg = latitude[0] + latitude[1] / 60 + latitude[2] / 3600;
		longitudeDeg = longitude[0] + longitude[1] / 60 + longitude[2] / 3600;
	} else if (OVERRIDE_LOCATION) {
		latitudeDeg = OVERRIDE_LOCATION[0];
		longitudeDeg = OVERRIDE_LOCATION[1];
	}

	// Form location
	let textLocation;
	let locationToWrite;
	// Convert both to a single degree if there is a location
	if (latitudeDeg) {
		// Get the street adress, country, etc...
		textLocation = await geocoder.reverse({
			lat: latitudeDeg,
			lon: longitudeDeg,
		});

		// Create a location string
		locationToWrite =
			(textLocation[0].streetName != "Unnamed Road"
				? `${textLocation[0].streetName}, `
				: ``) +
			(textLocation[0].city ? `${textLocation[0].city}, ` : ``) +
			textLocation[0].country +
			", " +
			textLocation[0].zipcode;
	}

	// Get the date of the photo
	let photoDate =
		exifData?.exif?.DateTimeOriginal || getDateFromString(fileName);

	let image = await Jimp.read(file);

	let width = image.getWidth();
	let height = image.getHeight();

	let padding = 0;

	if (photoDate) {
		image.print(
			font,
			0,
			padding,
			{
				text: photoDate,
				alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
				alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
			},
			width,
			height
		);
		padding -= fontSize;
	}

	if (latitudeDeg) {
		image.print(
			font,
			0,
			padding,
			{
				text: `${latitudeDeg.toFixed(7)} ${longitudeDeg.toFixed(7)}`,
				alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
				alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
			},
			width,
			height
		);
		padding -= fontSize;

		image.print(
			font,
			0,
			padding,
			{
				text: locationToWrite,
				alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
				alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
			},
			width,
			height
		);

		padding -= fontSize;
	}

	// Return buffer with async thing
	return image.getBufferAsync(image.getMIME());
}
