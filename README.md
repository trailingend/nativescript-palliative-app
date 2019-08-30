# ☎️ PAT 🏥

The Palliative Assessment Tool (PAT) is an iOS application that provides on call palliative nurses with a structured documentation system as they process with a call.  Once the call is finished, a pdf is generated that is sent via email and uploaded to PARIS.

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
"Team ID": 5MYA8389GQ
"Device Identifier for VCH Learning Tech iPad": 93ff730c6579308b561791adafec2fc96d59eec4
``` 

## Libraries and Plugins
> This app is developed with Nativescript, optimized for iPad 9.7 inches

### Nativescript Dependency Versions
This project has very specific dependency requirements in order to compile.  Further work would be needed to update from these speciifc package versions.
``` json
# nativescript and tns-core-modules version
"version": "5.4.3"

# nativescript tns-ios version
"version": "5.4.0"

# nativescript vue version
"version": "2.2.2"

# nativescript-dev-webpack version
"version": "0.25.0-next-2019-06-03-171607-01"
```

### Dependencies
- [jsPDF](https://github.com/MrRio/jsPDF) and [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)
``` bash
npm install jspdf --save
npm install @types/jspdf --save
npm install base-64 --save
npm install utf8 --save
npm install jspdf-autotable
```

- [Masked Text Field](https://www.npmjs.com/package/nativescript-masked-text-field)
`npm install nativescript-masked-text-field`

- [IQ Keyboard Manager](https://www.npmjs.com/package/nativescript-iqkeyboardmanager)
`npm install nativescript-iqkeyboardmanager`

- [NativeScript Videoplayer](https://github.com/nstudio/nativescript-videoplayer)
`npm install nativescript-videoplayer`

- [RadListView](https://docs.nativescript.org/ui/professional-ui-components/ListView/overview)
`tns plugin add nativescript-ui-listview`

- [NativeScript Email](https://www.npmjs.com/package/nativescript-email)
`tns plugin add nativescript-email`

- [NativeScript LocalStorage](https://github.com/NathanaelA/nativescript-localstorage)
`tns plugin add nativescript-localstorage`

## Memory Management
> With the current version of NativeScript we are using, we run into a memory leak issue, a.k.a. the app crashes and auto-exits after being used for a period of time, especially when lots of between-page navigation is happening. To fix this issue, we manually clear app memory every half second using nativescript's memory settings. There are two options to setup scheduled manually memory cleaning.[nativescript's documentation](https://docs.nativescript.org/core-concepts/android-runtime/advanced-topics/memory-management). This app is currently using the first option.
1. Via Schedule :watch:
	- "gcThrottleTime": 500
2. Via Ratio :heavy_division_sign:
	- "memoryCheckInterval": 500,
	- "freeMemoryRatio": 0.20

## Project File Structure
- **assets**:open_file_folder: - folder for static assets
	- **data**:open_file_folder: - folder for local data json file
	- **images**:open_file_folder: - folder for images
	- **videos**:open_file_folder: - folder for tutorial videos
- **components**:open_file_folder: - folder for vue page and component files
- **fonts**:open_file_folder: - folder for font files
- **scripts**:open_file_folder: - folder for global js files
- **styles**:open_file_folder: - folder for scss files
- **vuex**:open_file_folder: - folder for data storage
- **app.scss**:page_with_curl: - entry for all style files
- **main.ts**:page_with_curl: - entry for all vue and js files

## VueX Data Structure
### General Structure of All Data Storage
- **curr_user_id** :id:
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

### Detailed Structure of Logs Object Array
- **id** :id:
	- [Type] String, required field
	- [Description] - unique ID of client used by this app only, unique string based on creation time
- **phone** :phone:
	- [Type] String, in format of XXXXXXXXXX, null state is 0000000000
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
	- [Type] Array of Numbers, null state is [-1, -2, 0, 0, 0, 0, 0]
	- [Description] The 6 items individually represents :one:progress of the Introduction section, :two:the selected protocol id, :three:whether AssessItems page of current protocol is reached, :four:whether AssessOthers page of current protocol is reached, :five:whether Plans page is reached, :six:whether Recommendations page is reached,:seven:whether Summary page is reached.
		- @param {Number} intro progress - current step id of intro section
		- @param {Number} protocol id - current protocol id
		- @param {Number} protocol assess items page - whether reached, if protocol id is set, this variable is usually set to true 
		- @param {Number} protocol assess others page - whether reached
		- @param {Number} recommendations page - whether reached
		- @param {Number} plans page - whether reached
		- @param {Number} summary page - whether reached
	- [Related Places] - this info is set in every pages in the linear flow of documenting. this info will be used in Client History section on Dashboard.
	- e.g.
		- [3, 3, 1, 1, 1, 1, 1] - currently reached Summary page
		- [3, 3, 1, 1, 1, 1, 0] - currently reached Plans page
		- [3, 3, 1, 1, 1, 0, 0] - currently reached Recommendations page of protocol 3
		- [3, 3, 1, 1, 0, 0, 0] - currently reached Assess Others page of protocol 3
		- [3, 3, 1, 0, 0, 0, 0] - currently reached Assess Items page of protocol 3
		- [3, -1, 0, 0, 0, 0, 0] - currently reached ChooseProtocol page
		- [3, -2, 0, 0, 0, 0, 0] - currently reached step 3 page of Introduction section
- **editHistory** :newspaper:
	- [Type] Array, null state is []
	- [Description] each item in the array represents a change history. note that the initial submission is not in this history.
		- @param {String} nurse - take the id of the nurse currently logged in
		- @param {String} recordTime - document change time, in millitary time
		- @param {String} reason - reason and places for changes
	- e.g. see below
- **intro_answers** :page_facing_up:
	- [Type] Array, null state is []
	- [Description] each item in the array represents a responded question in intro section.
		- @param {Number} q_id - question id
		- @param {Array} a - array of strings, each is an answer entry
	- e.g. see below
- **items_answers** :page_facing_up:
	- [Type] Array, null state is []
	- [Description] each item in the array represents a responded protocol.
		- @param {Number} q_id - question id
		- @param {Array} a - array of objects, each is an answer entry of a items-assessment question in current protocol
			- @param {Number} q_id - question id
			- @param {String} q_type - question type
			- @param {Number} l_id - letter id
			- @param {Array} a - array of strings, each is an answer entry
	- e.g. see below
- **others_answers** :page_facing_up:
	- [Type] Array, null state is []
	- [Description] each item in the array represents a responded protocol.
		- @param {Number} q_id - question id
		- @param {Array} a - array of objects, each is an answer entry of a additional question in current protocol
			- @param {Number} q_id - question id
			- @param {String} q_type - question type
			- @param {Array} a - array of strings, each is an answer entry
	- e.g. see below
- **plans_answers** :page_facing_up:
	- [Type] Array, null state is []
	- [Description] each item in the array represents a plan entry.
	- e.g. see below
- **Recommendations** :pencil: 
	- [Type] String
	- [Description] - recommendations given to client

### Example of editHistory Field with A Answer Entry of A Client in Logs 
``` json
editHistory: [{
	"nurse": "777777",
	"recordTime": "20 Aug 2019 | 12:00",
	"reason": "Edited question 2 in intro section because of a spelling error"
}]
```

### Example of intro_answers Field with A Answer Entry of A Client in Logs 
``` json
intro_answers: [{
	"q_id": 4,
	"a": ["Cannot breathe"]
}]
```

### Example of item_answers Field of A Protocol with A Answer Entry of A Client in Logs 
``` json
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
``` json
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
``` json
plans_answers: [
	"Reach out for medical support (e.g. MRP)",
	"Recommend going to UPCC (Urgent Primary Care Center)* if appropriate and unable to manage symptoms at home and if ambulatory and within client’s goals of care",
	""
]
```

## Vue Pages / Components Structure
### answers:open_file_folder:
- [Description] - folder for components of different types of answers
- [Members] - all answer typesare shared across sections
	- **BooleanSelect.vue**:page_with_curl: - component for boolean answers
	- **FreeText.vue**:page_with_curl: - component for free text answers
	- **MultiSelect.vue**:page_with_curl: - component for multiple choice answers
	- **ScaleSelect.vue**:page_with_curl: - component for scale selector answers
	- **SingleSelect.vue**:page_with_curl: - component for single choice answers
### general :open_file_folder:
- [Description] - folder for components and pages and components that is used across board
- [Members] - include pages and components
	- **parts**:open_file_folder: - folder for sub-components
		- **ClientBlock.vue**:page_with_curl: - component for the sticky yellow bar on top of any client page
		- **NavBar.vue**:page_with_curl: - component for the sticky navigation bar on top of any page
	- **Catalogue.vue**:page_with_curl: - pop-up frame/ page for choosing protocols, can be opened from ClientBlock
	- **EditClient.vue**:page_with_curl: - pop-up frame/ page for editing client info, can be opened from ClientBlock and Summary
	- **Notes.vue**:page_with_curl: - semi-page popup for additional nurse notes
### home :open_file_folder: - folder for global js files
- [Description] - folder for components and pages and components that is used in home/ dashboard screen
- [Members] - include pages and components
	- **parts**:open_file_folder: - folder for sub-components
		- **Logs.vue**:page_with_curl: - component for listview of client history, used in Dashboard
		- **UserBlock.vue**:page_with_curl: - component for the user info at the top right corner of the Dashboard
	- **AddUser.vue**:page_with_curl: - pop-up page for adding a new user, has to be opened from SelectUser frame
	- **Dashboard.vue**:page_with_curl: - page for home screen/ dashboard
	- **LoginUser.vue**:page_with_curl: - pop-up page for logging in an existing user, has to be opened from SelectUser frame
	- **Options.vue**:page_with_curl: - pop-up frame/ page for option/ setting pages, opened from Dashboard
	- **SelectUser.vue**:page_with_curl: - pop-up frame/ page for user management, can add, login, or delete a user here
### intro :open_file_folder: - folder for scss files
- [Description] - folder for components and pages and components that is used in introduction section
- [Members] - include pages and components
	- **parts**:open_file_folder: - folder for sub-components
		- **StepQuestion.vue**:page_with_curl: - component to determine which answer component to display for introduction questions
	- **Introduction.vue**:page_with_curl: - page to show introduction questions
	- **NewClient.vue**:page_with_curl: - page to add a new client
### protocols :open_file_folder: - folder for data storage
- **parts**:open_file_folder: - folder for sub-components
	- **AssessItem.vue**:page_with_curl: - component to determine which answer component to display for items-assessment questions
	- **OthersQuestion.vue**:page_with_curl: - component to determine which answer component to display for additional questions
	- **RecommendButton.vue**:page_with_curl: - component to open Recommend pop-up, used in all protocol related pages
- **AssessItems.vue**:page_with_curl: - page to show items-assessment questions related with a protocol
- **AssessOthers.vue**:page_with_curl: - page to show additional questions related with a protocol
- **ChooseProtocol.vue**:page_with_curl: - page to choose a protocol
- **Plans.vue**:page_with_curl: - page to show plans to a client
- **Recommend.vue**:page_with_curl: - pop-up frame/ page fto show related resources, protocols and recommendation of a protocol
- **Recommenddations.vue**:page_with_curl: - page to show recommendations to a client
### summary :open_file_folder: - folder for scss files
- **parts**:open_file_folder: - folder for sub-components
	- **CallSummary.vue**:page_with_curl: - component to show summary of the call information
	- **InfoSummary.vue**:page_with_curl: - component to show summary of client information
	- **IntroSummary.vue**:page_with_curl: - component to show summary of introduction section
	- **NoteSummary.vue**:page_with_curl: - component to show summary of global additional notes
	- **PlanSummary.vue**:page_with_curl: - component to show summary of plans
	- **ProtocolSummary.vue**:page_with_curl: - component to show summary of one protocol
	- **QuestionSummary.vue**:page_with_curl: - component to show summary of one question and its answers
	- **RecommendationsSummary.vue**:page_with_curl: - component to show summary of recommendations
	- **SubmitButton.vue**:page_with_curl: - component to generate PDF, and to send email
- **EditCallInfo.vue**:page_with_curl: - popup page/ frame to edit call information, opened from Summary
- **Reason.vue**:page_with_curl: - semi-page popup to record pdf modification history
- **Summary.vue**:page_with_curl: - page to show summary of a client
### tutorials :open_file_folder: - folder for data storage
- **FirstTime.vue**:page_with_curl: - pop-up page to show tutorial welcome screen
- **Journey.vue**:page_with_curl: - pop-up page to show tutorials
- **Tutorial.vue**:page_with_curl: - pop-up frame, to either pull from Journey or FirstTime