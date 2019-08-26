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
tns run ios --bundle --device <DEVICE_IDENTIFIER>

# Deploy the application to VCH Learning Tech iPad
tns deploy ios --bundle --device <DEVICE_IDENTIFIER> --clean --provision <PROVISION_ID>

# Lists all devices
tns device

# Lists all provision profiles installed in computer
tns prepare ios --provision

# VCH Learning Tech Team Info
Team ID: 5MYA8389GQ
Device Identifier: 93ff730c6579308b561791adafec2fc96d59eec4
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
1. Via Schedule :watch:
	- "gcThrottleTime": 500
2. Via Ratio :heavy_division_sign:
	- "memoryCheckInterval": 500,
	- "freeMemoryRatio": 0.20

## VueX Data Structure
### General Structure of All Data Storage
- **curr_user_id** :raised_hand:
	- [Type] string, null state is -1
	- [Description] - ID of the nurse currently logged in to the app
	- [Related Places] - it will be changed mostly in Login/ AddUser/ Options page
- **timer** :hourglass_flowing_sand:
	- [Type] Object, null state is undefined
	- [Description] - ID of the nurse currently logged in to the app
	- [Related Places] - it will be changed mostly in Login/ AddUser/ Options page
- **users** :two_men_holding_hands::two_women_holding_hands:
	- [Type] Array, null state is []
	- [Description] - list of users
	- [Related Places] - it will be changed mostly in SelectUser/ Login/ AddUser/ EditCallInfo pages
- **logs** :page_facing_up:
	- [Type] Array, null state is []
	- [Description] - list of users
	- [Related Places] - it will be changed mostly in SelectUser/ Login/ AddUser/ EditCallInfo pages
- **data_version** :bookmark:
	- [Type] Number, 0
	- [Description] - data version number
	- [Related Places] - it will be changed mostly in Dashboard pages; local data loading and online data loading methods change it.
- **tutorials** :books:
	- [Type] Array, null state is []
	- [Description] - content of tutorials, saved only locally in vue/state
	- [Related Places] - this is static content
- **intro** :orange_book:
	- [Type] Array, null state is []
	- [Description] - data for introduction section
	- [Related Places] - it will be loaded from local data json file or online data json
- **protocols** :notebook_with_decorative_cover:
	- [Type] Array, null state is []
	- [Description] - data for protocols section
	- [Related Places] - it will be loaded from local data json file or online data json
- **assessment_letters** :green_book:
	- [Type] Array, null state is []
	- [Description] - data for possible assessment letters used in protocols section
	- [Related Places] - it will be loaded from local data json file or online data json
- **plans** :blue_book:
	- [Type] Array, null state is []
	- [Description] - data for plans section
	- [Related Places] - it will be loaded from local data json file or online data json

### Detailed Structure of Users Array
- **id** :id:
	- [Type] String
	- [Description] - employee ID of nurse user
- **name** :black_nib:
	- [Type] String
	- [Description] - first name and initial of last name of nurse user
- **fullname** :name_badge:
	- [Type] String
	- [Description] - first and last name of nurse user
- **shift_start** :clock12:
	- [Type] String, in millitary time
	- [Description] - shift start time
- **shift_end** :clock830:
	- [Type] String, in millitary time
	- [Description] - shift end time, if the time is less than shift start time, auto increment date
- **color** :art:
	- [Type] String
	- [Description] - color code associated with this nurse user

### Detailed Structure of Logs Array
- **id** :id:
	- [Type] String, required field
	- [Description] - unique ID of client used by this app only, unique string based on creation time
- **phone** :phone:
	- [Type] String, in format of XXXXXXXXXX, null state is 8888888888
	- [Description] - call-back number of client
- **caller** :telephone_receiver:
	- [Type] String
	- [Description] - first and last name of caller
- **client** :bust_in_silhouette:
	- [Type] String
	- [Description] - first and last name of caller
	- [Related Places] - this info will be used in email subject line and pdf name
- **relation** :busts_in_silhouette:
	- [Type] String
	- [Description] - caller's relationship to client
- **info** :clipboard:
	- [Type] String
	- [Description] - general info of client
- **notes** :pencil: 
	- [Type] String
	- [Description] - notes related with client
- **nurseID** :id:
	- [Type] String, in format of XXXXXX
	- [Description] - intake nurse employee ID
- **nurseFullname** :name_badge:
	- [Type] String
	- [Description] - first and last name of caller
- **date** :date:
	- [Type] String, in format of DD MMM YYYY
	- [Description] - creation date
- **startTime** :clock12:
	- [Type] String, in millitary time
	- [Description] - call start time
- **endTime** :clock830:
	- [Type] String, in millitary time
	- [Description] - call end time
- **status** :triangular_flag_on_post:
	- [Type] Boolean
	- [Description] - whether the document has been compiled as PDF and sent via email
- **progress** :card_index: 
	- [Type] Array of Numbers, null state is [-1, -2, 0, 0, 0, 0], // intro[step id], proto[protocol id], items[Bool], others[Tri-state], plans[Bool], summary[Bool]
	- [Description] The 6 items individually represents :one:progress of the intro section, :two:the current protocol id, :three:whether items page of current protocol is reached, :four:whether others page of current protocol is reached, :five:whether plan page is reached, :six:whether summary page is reached.
	- [Related Places] - this info is set in every pages in the linear flow of documenting. this info will be used in Client History section on Dashboard.
		- @param{Number} intro progress - current step id of intro section
		- @param{Number} protocol id - current protocol id
		- @param{Boolean} items page - whether reached, if protocol id is set, this variable is usually set to true 
		- @param{Boolean} others page - whether reached
		- @param{Boolean} plans page - whether reached
		- @param{Boolean} summary page - whether reached
	- e.g.
		- [3, 3, 1, 1, 1, 1] - currently reached summary page
		- [3, 3, 1, 1, 1, 0] - currently reached plans page
		- [3, 3, 1, 0, 0, 0] - currently reached items page of protocol 3
		- [3, -1, 0, 1, 1, 1] - currently reached ChooseProtocol page
		- [3, -2, 0, 1, 1, 1] - currently reached step 3 page of intro section
- **editHistory** :newspaper:
	
- **intro_answers** :page_facing_up:
- **items_answers** :page_facing_up:
- **others_answers** :page_facing_up:
- **plans_answers** :page_facing_up:

### Example of editHistory Field with A Answer Entry of A Client in Logs 
```
editHistory: [{

}]
```

### Example of intro_answers Field with A Answer Entry of A Client in Logs 
```
intro_answers: [{
	q_id: 4,
	a: ["Cannot breathe"]
}]
```

### Example of item_answers Field of A Protocol with A Answer Entry of A Client in Logs 
```
items_answers: [{
	"id": 3,
	"a": [{
		"q_id": 10,
		"q_type": "single_select",
		"l_id": 1,
		"a": [
			"Yes – new symptom",
			"Happened 10 minutes ago"
		]
	}]
}]
```

### Example of others_answers Field of A Protocol with A Answer Entry of A Client in Logs 
```
others_answers: [{
	"id": 3,
	"a": [{
		"q_id": 3,
		"q_type": "free_form",
		"a": [
			"Caller"
		]
	}]
}]
```

### Example of plans_answers Field with A Answer Entry of A Client in Logs 
```
plans_answers: [
	"Reach out for medical support (e.g. MRP)",
	"Recommend going to UPCC (Urgent Primary Care Center)* if appropriate and unable to manage symptoms at home and if ambulatory and within client’s goals of care",
	""
]
```