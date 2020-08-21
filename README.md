# Picture location watermark

This is a small project to watermark pictures with dates and places automagically.

It requires you to use geocoding api to get the street address

To get started using it create a .env file with your google geocoding credentials

[How to get google API key](https://developers.google.com/maps/documentation/geocoding/get-api-key)

Place your images in the input folder. If it does not exist, create it.

```sh
yarn install
yarn build
yarn start
```

*If your images do not contain exif data it will skip them and copy to the failed folder*