/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
"use strict";

var android = (cordova.platformId === 'android'),
    windowsphone = (cordova.platformId === 'windowsphone'),
    bb10 = (cordova.platformId === 'blackberry10'),
    sampleData;

var app = {
    // // Application Constructor
    // initialize: function() {
    //     document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    // },

    // // deviceready Event Handler
    // //
    // // Bind any cordova events here. Common events are:
    // // 'pause', 'resume', etc.
    // onDeviceReady: function() {
    //     this.receivedEvent('deviceready');

    //     // Read NDEF formatted NFC Tags
    //     nfc.addNdefListener (
    //         function (nfcEvent) {
    //             var tag = nfcEvent.tag,
    //                 ndefMessage = tag.ndefMessage;

    //             // dump the raw json of the message
    //             // note: real code will need to decode
    //             // the payload from each record
    //             alert(JSON.stringify(ndefMessage));

    //             // assuming the first record in the message has
    //             // a payload that can be converted to a string.
    //             alert(nfc.bytesToString(ndefMessage[0].payload).substring(3));
    //         },
    //         function () { // success callback
    //             alert("Waiting for NDEF tag");
    //         },
    //         function (error) { // error callback
    //             alert("Error adding NDEF listener " + JSON.stringify(error));
    //         }
    //     );        
    // },

    // // Update DOM on a Received Event
    // receivedEvent: function(id) {
    //     var parentElement = document.getElementById(id);
    //     var listeningElement = parentElement.querySelector('.listening');
    //     var receivedElement = parentElement.querySelector('.received');

    //     listeningElement.setAttribute('style', 'display:none;');
    //     receivedElement.setAttribute('style', 'display:block;');

    //     console.log('Received Event: ' + id);
    // }

    sampleDataIndex: 0,
    initialize: function () {
        this.bind();
    },
    bind: function () {
        document.addEventListener('deviceready', app.deviceready, false);
    },
    deviceready: function () {
        document.getElementById('checkbox').addEventListener('change', app.toggleCheckbox, false);
        sample.addEventListener('click', app.showSampleData, false);
    },
    disableUI: function () {
        document.forms[0].elements.mimeType.disabled = true;
        document.forms[0].elements.payload.disabled = true;
    },
    enableUI: function () {
        document.forms[0].elements.mimeType.disabled = false;
        document.forms[0].elements.payload.disabled = false;
    },
    shareMessage: function () {
        var mimeType = document.forms[0].elements.mimeType.value,
            payload = document.forms[0].elements.payload.value,
            record = ndef.mimeMediaRecord(mimeType, nfc.stringToBytes(payload));

        app.disableUI();

        nfc.share(
            [record],
            function () {
                if (bb10) {
                    // Blackberry calls success as soon as the Card appears
                    checkbox.checked = false;
                    app.enableUI();
                } else if (windowsphone) {
                    // Windows phone calls success immediately. Bug?
                    app.notifyUser("Sharing Message");
                } else {
                    // Android call the success callback when the message is sent to peer
                    navigator.notification.vibrate(100);
                    app.notifyUser("Sent Message to Peer");
                }
            }, function (reason) {
                alert("Failed to share tag " + reason);
                checkbox.checked = false;
                app.enableUI();
            }
        );
    },
    unshareMessage: function () {
        app.enableUI();

        nfc.unshare(
            function () {
                navigator.notification.vibrate(100);
                app.notifyUser("Message is no longer shared.");
            }, function (reason) {
                alert("Failed to unshare message " + reason);
            }
        );
    },
    notifyUser: function (message) {
        if (android) {
            toast.showShort(message);
        } else {
            statusDiv.innerHTML = message;
            setTimeout(function() {
                statusDiv.innerHTML = "";
            }, 3000);
        }
    },
    showSampleData: function() {
        var mimeTypeField = document.forms[0].elements.mimeType,
          payloadField = document.forms[0].elements.payload,
          record = sampleData[app.sampleDataIndex];

        if (mimeTypeField.disabled) {
            app.notifyUser("Unshare Message to edit data");
            return false;
        }

        app.sampleDataIndex++;
        if (app.sampleDataIndex >= sampleData.length) {
            app.sampleDataIndex = 0;
        }

        mimeTypeField.value = record.mimeType;
        payloadField.value = record.payload;
        return false;
    },
    toggleCheckbox: function (e) {
        if (e.target.checked) {
            app.shareMessage();
        } else {
            app.unshareMessage();
        }
    }
};

app.initialize();

sampleData = [
    {
        mimeType: 'text/pg',
        payload: 'MHC18'
    },
    {
        mimeType: 'game/rockpaperscissors',
        payload: 'Rock'
    },
    {
        mimeType: 'text/x-vCard',
        payload: 'BEGIN:VCARD\n' +
            'VERSION:2.1\n' +
            'N:Coleman;Don;;;\n' +
            'FN:Don Coleman\n' +
            'ORG:MHC Solutions;\n' +
            'URL:http://mhc18.com\n' +
            'TEL;WORK:123456789\n' +
            'EMAIL;WORK:xxx@mhc18.com\n' +
            'END:VCARD'
    },
    {
        mimeType: '',
        payload: ''
    }
];
