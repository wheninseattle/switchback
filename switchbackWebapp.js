function doPost(e) {
  //Configuration
  const gDriveFolderId = '1zTBBVks_lPAICY_dRX_rPAKi1qPeR0qE';
  const gSheetId = '1qmq1a1szl0kNyUW9WIin7v8GszbmB0kU2F85ERAbfGI';
  const recordSheet = SpreadsheetApp.openById(gSheetId).getSheetByName("Website Form Requests")
  const dashboardSheet = SpreadsheetApp.openById(gSheetId).getSheetByName("Email Away Message")
  const dataPrependRow = 2;
  const devEmail = 'weston.norwood@gmail.com';
  const switchbackEmail = 'switchbackrepair@gmail.com';

  try {
    console.log('Received form data...')
    const formData = JSON.parse(e.postData.contents);
    console.log('Successfully parsed form data...')
    const { name, email, description } = formData;
    console.log(name, email, description)

    // Append basic data to Google Sheets
    let date = new Date();
    recordSheet.insertRows(dataPrependRow);
    let basicInfoRange = recordSheet.getRange(dataPrependRow, 1, 1, 5);
    let replyDatePlaceholder = "";
    let basicInfoData = [date, replyDatePlaceholder, formData.name, formData.email, formData.description];
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
      let additionalInfoRange = recordSheet.getRange(dataPrependRow, 6, 1, fileUrls.length)
      console.log(fileUrls)
      console.log([...fileUrls])
      additionalInfoRange.setValues([fileUrls])

    }

    // Send email with submission details to switchback
    const emailDetails = { name, email, description, fileUrls };
    const newRequestEmailBodyHTML = getSwitchbackOrderEmailHTML(emailDetails)
    let logoBlob = DriveApp.getFileById('17Hg0vgaR_kh9UDjQ3eWF-K4G3zZtn5Rx').getBlob();
    const dashboardSheet = SpreadsheetApp.openById(gSheetId).getSheetByName("Email Away Message")
    let awayStatus = dashboardSheet.getRange(2, 1).getValue()
    let awayMessage = dashboardSheet.getRange(7, 1).getValue()
    let standardReply = "We have received your request and will reach out to you shortly to discuss the next steps for your repair!"
    const htmlBody =
      `<body style="font-family: sans-serif; color: #062732; text-align: center;">
  <!-- Container with Max Width -->
  <table width="100%" bgcolor="#062732" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <!-- Hero Image -->
        <a href="https://www.switchbackrepair.com" target="_blank" rel="noopener noreferrer">
          <img src="cid:switchbackLogo" alt="Switchback logo" style="width: auto; height: 150px; display: inline-block;">
        </a>
      </td>
    </tr>
    <tr>
      <td align="left" bgcolor="#f7f7f7" style="padding: 15px;">
        <!-- Body -->
        <p>Thank you for reaching out to Switchback Repair!<br><br>
          ${awayStatus == 'Yes' ? awayMessage : standardReply}<br><br>
          The details of your request are:
        </p><br>
        <p><strong>Name: </strong>${name}</p>
        <p><strong>Email Address: </strong>${email}</p>
        <p><strong>Project Details: </strong>${description}</p><br>
        <p><strong>Project Photos: </strong>${fileUrls.length >= 1 ? fileUrls.join(', ') : 'No photos were provided'}</p><br>
        <p>See you out there!</p>
        <p>Switchback Repair Team</p>
      </td>
    </tr>
    <tr>
      <td>
        <!-- Stripes -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td bgcolor="#439C8F" style="height: 4px;"></td></tr>
          <tr><td bgcolor="#8BA5C0" style="height: 4px;"></td></tr>
          <tr><td bgcolor="#D2BECB" style="height: 4px;"></td></tr>
          <tr><td bgcolor="#F48E33" style="height: 4px;"></td></tr>
          <tr><td bgcolor="#AB3323" style="height: 4px;"></td></tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 30px; color: #ffffff;">
        <!-- Footer -->
        <p style="font-style: italic;">"The environment is where we all meet; where we all have a mutual interest; it is the one thing all of us share." <br>- Lady Bird Johnson</p>
        <p>🌈 We are a proudly queer-owned business 🌈</p>
        <p>
          <a href="https://www.switchbackrepair.com/" style="color: #ffffff; text-decoration: none;">Switchbackrepair.com</a>
        </p>
        <p>Phone: <a href="tel:+12036063999" style="color: #ffffff; text-decoration: none;">203-606-3999</a></p>
      </td>
    </tr>
  </table>
</body>`

    MailApp.sendEmail({
      to: email,
      from: switchbackEmail,
      subject: "Your Switchback Repair Request",
      htmlBody: htmlBody,
      bcc: `${switchbackEmail},${devEmail}`,
      inlineImages: {
        switchbackLogo: logoBlob,
      }
    })

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
      from: devEmail
    });
    return ContentService.createTextOutput("Couldn't submit form");
  }
}