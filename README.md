__Bluetooth Challenge__  

Your challenge is to implement any bluetooth device that you have handy into an Ionic application for Android. This should be extremely basic visually since we are specifically interested in the bluetooth implementation.

If you do not have a bluetooth device available and would be unable to complete this task, please let us know.

__Requirements__  

Implement any BLE peripheral that you have into the sample Ionic app that has been provided to you, including the following bluetooth interactions:  
- Scanning for devices and showing a list that you can select to pair from
- Pairing the device
- Transmitting data and showing visually
- Disconnecting from the device
- Include some unit tests
  
The visuals are not important as long as there is something to show that these actions have been completed (ie. a list of scanned devices that you can choose to pair with, and some visual representation of the data). This is a starter app for Ionic, so you are welcome to use an appropriate plugin. This plugin has been added already but feel free to use something else - https://github.com/capacitor-community/bluetooth-le. If you find yourself going beyond the allotted hours, please note your path forward and what you intended to do to complete the app. 

__Submission__  
- Send us a link to your project on GitHub with any instructions as well as details about the bluetooth device(s) you used
- Include screenshots for the visuals of your project (as we won't have the device on hand)
- Include any commentary that you would like us to know

__Requirements for Running this Repo__  

Node >=16 & NPM  
- Recommend using nvm to install & manage node versions - https://github.com/nvm-sh/nvm
- `nvm install 16`  
- `nvm use 16`  
  
Ionic CLI 7.1.1  
- `npm i -g @ionic/cli@7.1.1`  

__Run project for development__  

Install dependencies  
- `npm install`

Run project in browser @ `http://localhost:4200/`   
- `npm run start`

Run On Android

__Add Android Platform__
- `npm install @capacitor/android`
- `npx cap add android`
- Ensure that you have a www/ assets folder in the root; please add one and drop in a copy of the index.html from the src/ folder

__Open Android Studio__
- Confirm you are using the embedded JDK of 11 or above
- Run the build and run directly on device

__Make Changes to the Src Files__
- `npm run build`
- `npx cap copy`
- Re-run on the device from Android Studio

Documentation for reference: https://capacitorjs.com/docs/android

If you are more comfortable completing the challenge in a native Android application, feel free to do so. 
# bluetooth-ionic-android
