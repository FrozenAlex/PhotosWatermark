/****
 * Watermarking script to write exif data on the images
 *
 */
require("dotenv").config();

import * as fs from "fs-extra";
import { watermarkPicture } from "./watermark";

// Set output folder
const inputFolder = __dirname + "/../input/";
const outputFolder = __dirname + "/../output/";
const failedFolder = __dirname + "/../failed/";

// Make directories
fs.mkdirpSync(inputFolder);
fs.mkdirpSync(outputFolder);
fs.mkdirpSync(failedFolder);

/**
 * Converts all files in the input folder
 */
export async function convert() {
	// Get the file list
	let fileList = await fs.readdir(inputFolder);
	if (fileList.length === 0) {
		console.info("No files in the input folder");
		return;
	}

	// For logging
	let successes = [];
	let failures = [];

	for (const itemIndex in fileList) {
		let item = fileList[itemIndex];
		let filePath = inputFolder + item;

		let file = await fs.readFile(filePath);

		// Watermark the file
		try {
			let result = await watermarkPicture(file, item);

			if (result) {
				await fs.writeFile(outputFolder + item, result);
				successes.push(item);
			} else {
				await fs.writeFile(failedFolder + item, file);
			}
		} catch (err) {
			console.log("Something weird has happened to " + item + " failed");
			await fs.writeFile(failedFolder + item, file);
		}
	}
	console.info(
		"Conversion finished: \n" +
			`SourceImages: ${successes.length + failures.length} \n` +
			`Succeses: ${successes.length} \n` +
			`Failures: ${failures.length} \n` +
			`Names of failed pictures: \n` +
			failures.join("\n")
	);
}

// Conversion start
convert();
