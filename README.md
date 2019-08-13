# Quirkbot Factory Test

Builds platform specific binaries used to test the Quirkbots in production

# How to build

1. `npm install`
2. `node gulp.js build`

# How to upload the firmware

1. Place the folder containing the uuids
	1. On Windows, this is a folder called `uuids`, on the same level as
	QuirkbotFactoryTest.exe
	2. On Max, this is a folder called `uuids`, inside
	QuirkbotFactoryTest.app/Contents/Resources/app.nw
2. Open the QuirkbotFactoryTest
3. Connect a Quirkbot
4. Wait until the white screen says "Quirkbot * connected", and press
[Upload test program]
5. The screen will turn yellow during the upload
6. After the upload completes
	1. If you get the green screen, the upload was successful
	2. If you get the red screen
		1. If it says "No uuids left.", you need to request a new batch of UUIDs
		2. If it says "Upload failed", try again until success. If the problem
		persists for many tries, the board or the computer might be defective
