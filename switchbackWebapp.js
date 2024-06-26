function doPost(e) {
  //Configuration
  const gDriveFolderId = '1zTBBVks_lPAICY_dRX_rPAKi1qPeR0qE';
  const gSheetId = '1qmq1a1szl0kNyUW9WIin7v8GszbmB0kU2F85ERAbfGI';
  const sheet = SpreadsheetApp.openById(gSheetId).getActiveSheet();
  const dataPrependRow = 2;
  const devEmail = 'weston.norwood@gmail.com';
  const senderEmail = 'switchbackrepair@gmail.com';
  const formRecipientEmailList = 'weston.norwood@gmail.com';
  try {
    console.log('Received form data...')
    const formData = JSON.parse(e.postData.contents);
    console.log('Successfully parsed form data...')
    const { name, email, description } = formData;
    console.log(name, email, description)

    // Append basic data to Google Sheets
    let date = new Date();
    sheet.insertRows(dataPrependRow);
    let basicInfoRange = sheet.getRange(dataPrependRow, 1, 1, 4)
    let basicInfoData = [date, formData.name, formData.email, formData.description];
    console.log(basicInfoData)
    basicInfoRange.setValues([basicInfoData]);
    const { photos } = formData;
    const fileUrls = [];
    if (photos && photos.length >= 1) {
      const folder = DriveApp.getFolderById(gDriveFolderId);
      // // Process files and save to Google Drive
      for (const photo of photos) {
        console.log(`Processing photo: ${photo}`)
        const date = getFormattedDate();
        console.log(`Existing photo name: ${photo.name}`)
        let adjustedName = `${date}-${name}-${photo.name}`
        console.log(`Adjusted photo name: ${adjustedName}`)
        const decodedData = Utilities.base64Decode(photo.data);
        const blob = Utilities.newBlob(decodedData, photo.type, adjustedName);
        const savedFile = folder.createFile(blob);
        fileUrls.push(savedFile.getUrl());
      }

      // Append file data to Google Sheets
      let additionalInfoRange = sheet.getRange(dataPrependRow, 4, 1, fileUrls.length)
      console.log(fileUrls)
      console.log([...fileUrls])
      additionalInfoRange.setValues([fileUrls])

    }

    // Send email with submission details
    const newRequestEmailBody = `
    Excellent news; we have a new repair request!

    Here is the key info about the request:

    Date: ${getFormattedDate()}
    Name: ${name}
    Email: ${email}
    Description: ${description}
    Photo Links: ${fileUrls.length >= 1 ? fileUrls.join(', ') : 'No photos were provided'}

    Hopefully we can patch er up!

    With Love,
    Switchback
    `

    GmailApp.sendEmail(formRecipientEmailList, 'New Form Submission', newRequestEmailBody, {
      from: senderEmail
    });
    return ContentService.createTextOutput('Form submission received successfully.');

  } catch (error) {
    console.error(error);
    const errorEmailBody = `
    Oops, looks like a gear slip-up! Time to troubleshoot and get back on track.
    please check console for errors!
    Date of error: ${getFormattedDate()}
    Error: ${error}
    With Love,
    Switchback
    `
    GmailApp.sendEmail(devEmail, 'Error with form submission', errorEmailBody, {
      from: senderEmail
    });
    return ContentService.createTextOutput("Couldn't submit form");
  }
}