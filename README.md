# PAT

> A native application built with NativeScript-Vue for VCH Palliative
> Credit to VCH Learning Technologies

## Usage

``` bash
# Install dependencies
npm install

# Build for production
tns build ios --bundle --device "iPad (5th generation)"

# Build, watch for changes and run the application on Simulator
tns run ios --bundle --device "iPad (5th generation)"

# Build, watch for changes and run the application on VCH Learning Tech iPad
tns run ios --bundle --device 93ff730c6579308b561791adafec2fc96d59eec4

# Deploy the application to VCH Learning Tech iPad
tns deploy ios --bundle --device 93ff730c6579308b561791adafec2fc96d59eec4 --clean --provision 4da594d9-3e86-42f0-9386-d3153111e030

# VCH Learning Tech Team ID
Team ID: 5MYA8389GQ
``` 

## Libraries and Plugins

``` bash
# nativescript and tns-core-modules version
"version": "5.4.3"

# nativescript tns-ios version
"version": "5.4.0"

#"nativescript vue version
"version": "2.2.2"

# nativescript-dev-webpack version
"version": "0.25.0-next-2019-06-03-171607-01"
```

List of plugins used in this app: 
``` bash
npm install jspdf --save
npm install @types/jspdf --save
npm install base-64 --save
npm install utf8 --save
npm install nativescript-masked-text-field
npm install nativescript-iqkeyboardmanager
npm install nativescript-videoplayer

tns plugin add nativescript-ui-listview
tns plugin add nativescript-email
tns plugin add nativescript-localstorage
```

## Memory Management
> Currently there are two options to clear memories after page navigation according to [nativescript's documentation](https://docs.nativescript.org/core-concepts/android-runtime/advanced-topics/memory-management). This app is currently using the first option.
1. Via Schedule
	- "gcThrottleTime": 500
2. Via Ratio
	- "memoryCheckInterval": 500,
	- "freeMemoryRatio": 0.20

## VueX Data Structure
### General Structure of All Data Storage
- **curr_user_id**
	- [Type] string, null state is -1
	- [Description] - ID of the nurse currently logged in to the app
	- [Related Places] - it will be changed mostly in Login/ AddUser/ Options page
- **timer**
	- [Type] Object, null state is undefined
	- [Description] - ID of the nurse currently logged in to the app
	- [Related Places] - it will be changed mostly in Login/ AddUser/ Options page
- **users** :two_men_holding_hands::two_women_holding_hands:
	- [Type] Array, null state is []
	- [Description] - list of users
	- [Related Places] - it will be changed mostly in SelectUser/ Login/ AddUser/ EditCallInfo pages
- logs
- data_version
- data_version
- tutorials
- intro
- protocols
- assessment_letters
- plans

### Detailed Structure of Users Array
### Detailed Structure of Users Array