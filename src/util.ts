/**
 * Parses the date from a string (filename)
 * @param text text, containing date and time
 */
export function getDateFromString(text: string): string | undefined {
	let photoDateRegexp = /(\d{4})[-_ ]?(\d{2})[-_ ]?(\d{2})[-_ ]?(\d{2})[-_]?(\d{2})[-_ ]?(\d{2})/;

	if (photoDateRegexp.test(text)) {
		let data = text.match(photoDateRegexp);

		let year = data[1];
		let month = data[2];
		let day = data[3];

		let hours = data[4];
		let minutes = data[5];
		let seconds = data[6];

		return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
	}
	return;
}

/**
 * Type of the exif data
 */
export interface ExifType {
	image: {
		GPSInfo: number;
		Model: string;
		YCbCrPositioning: number;
		ResolutionUnit: number;
		YResolution: number;
		ExifOffset: number;
		XResolution: number;
		Make: string;
	};
	thumbnail: object;
	exif: {
		ExifVersion: Buffer;
		Flash: number;
		ColorSpace: number;
		InteropOffset: number;
		CreateDate: string;
		FocalLength: number; // Float
		ApertureValue: number;
		ExifImageWidth: number;
		ShutterSpeedValue: number; // float
		ISO: number;
		DateTimeOriginal: string;
		FlashpixVersion: Buffer;
		ComponentsConfiguration: Buffer;
		ExifImageHeight: number;
		ExposureTime: number;
	};
	gps: {
		GPSDateStamp: string;
		GPSAltitudeRef: number;
		GPSLongitudeRef: string;
		GPSImgDirection: number;
		GPSLongitude: [number, number, number];
		GPSProcessingMethod: string;
		GPSLatitudeRef: string;
		GPSImgDirectionRef: string;
		GPSTimeStamp: [number, number, number];
		GPSAltitude: number;
		GPSLatitude: [number, number, number];
	};
	interoperability: { InteropIndex: "R98"; InteropVersion: Buffer };
	makernote: {};
}
