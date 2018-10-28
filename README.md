# Testing NFC P2P

## Prereq

* Install Android Studio
* SETX JAVA_HOME "C:\Program Files\Android\Android Studio\jre"
* Append to path: ;%JAVA_HOME%\bin

## Create

Insruction from [chariotsolutions/phonegap-nfc](https://github.com/chariotsolutions/phonegap-nfc/blob/master/doc/GettingStartedCLI.md)  

```bash
cordova create mhc18cordovalogin com.example.mhc18cordovalogin Login
cordova platform add android
cordova plugin add phonegap-nfc
cordova run
```

Then used code from [don/phonegap-p2p](https://github.com/don/phonegap-p2p)  

The End