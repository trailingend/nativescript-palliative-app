# PAT

> A native application built with NativeScript-Vue for VCH Palliative

## Usage

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
npm install @types/jspdf --save
npm install base-64 --save
npm install utf8 --save
npm install nativescript-masked-text-field
npm install nativescript-iqkeyboardmanager

tns plugin add nativescript-ui-listview
tns plugin add nativescript-email
tns plugin add nativescript-localstorage
```