# PAT

Palliative Assistant Tool (PAT) is a Universal iOS Application for iPhone and iPad.

## Technologies
- NativeScript
- Vue
- TypeScript


## Setup Dev Environment

``` bash
# Install dependencies
npm install

# Build for production
tns build ios --bundle --device "iPad (5th generation)"

# Build, watch for changes and debug the application
tns debug ios --bundle --device "iPad (5th generation)"

# Build, watch for changes and run the application
tns run ios --bundle --device "iPad (5th generation)"

# Deploy the application to our iPad
tns deploy ios --bundle --device 93ff730c6579308b561791adafec2fc96d59eec4 --clean
```

## Plugins
```
tns plugin add nativescript-email
npm install jspdf --save
npm install @types/jspdf --save
npm install base-64 --save
npm install utf8 --save
tns plugin add nativescript-clipboard
tns plugin add nativescript-localstorage
```