(function () {
  // Wrap all logic in polling function to make sure page loads first
  let pollingAttempts = 5;
  let pollingTimeout = 500;

  function placeCustomForm() {
    // Append custom styles to the head
    let customStyles = getCustomStyles();
    document.head.appendChild(customStyles);

    // Replace existing form
    let formContainer = document.querySelector(".form-block");
    if (formContainer) {
      formContainer.style.display = "flex";
      formContainer.style.flexDirection = "column";
      let inputClassList = ["form-field-text", "w-input"];
      var existingForm = (document.querySelector("form#email-form").innerText =
        "");
      const form = document.createElement("form");
      form.id = "switchbackForm";
      let photos = [];
      form.method = "POST";
      form.enctype = "multipart/form-data";

      // Name input
      const nameLabel = document.createElement("label");
      nameLabel.textContent = "Name";
      const nameInput = document.createElement("input");
      nameInput.classList.add(...inputClassList);
      nameInput.type = "text";
      nameInput.name = "name";
      nameInput.id = "nameInput";
      nameInput.required = true;
      const nameError = document.createElement("div");
      nameError.id = "nameError";
      nameError.classList.add("inputError");

      // Email input
      const emailLabel = document.createElement("label");
      emailLabel.textContent = "Email Address";
      const emailInput = document.createElement("input");
      emailInput.classList.add(...inputClassList);
      emailInput.id = "emailInput";
      emailInput.type = "email";
      emailInput.name = "email";
      emailInput.required = true;
      const emailError = document.createElement("div");
      emailError.id = "emailError";
      emailError.classList.add("inputError");

      // Description textarea
      const descriptionLabel = document.createElement("label");
      descriptionLabel.textContent = "Project Details";
      const descriptionInput = document.createElement("textarea");
      descriptionInput.classList.add(...inputClassList);
      descriptionInput.id = "descriptionInput";
      descriptionInput.name = "description";
      descriptionInput.placeholder = "Tell us about your project";

      // Photo upload (multiple files)
      const photoLabel = document.createElement("label");
      photoLabel.textContent = "Please include item photos to streamline estimation.";
      const photoInputWrapper = document.createElement("div");
      photoInputWrapper.classList.add("upload-btn-wrapper");
      const photoInputBtn = document.createElement("btn");
      photoInputBtn.classList.add("upload-btn");
      const photoInput = document.createElement("input");
      photoInput.type = "file";
      photoInput.name = "photos";
      photoInput.multiple = true;
      photoInput.accept = "image/*";
      photoInputWrapper.appendChild(photoInputBtn);
      photoInputWrapper.appendChild(photoInput);

      // Preview Section
      let imgPreviewContainer = document.createElement("div");
      imgPreviewContainer.id = "preview";
      imgPreviewContainer.classList.add("preview-img-container");

      // Submit button
      const submitButton = document.createElement("button");
      submitButton.classList.add("form-submit-button", "w-button");
      submitButton.style.display = "block";
      submitButton.style.width = "100px";

      submitButton.type = "submit";
      submitButton.textContent = "Submit";

      // Create Loader, submission success, and submission failure
      const statusContainer = document.createElement("div");
      statusContainer.classList.add("submission-status-container");
      const submissionSuccess = document.createElement("div");
      submissionSuccess.classList.add("submission-success");
      submissionSuccess.style.display = "none";
      submissionSuccess.innerText =
        "Thank you! Your submission has been received!";
      const submissionFailure = document.createElement("div");
      submissionFailure.classList.add("submission-failure");
      submissionFailure.style.display = "none";
      submissionFailure.innerText =
        "Thank you! Your submission has been received!";

      const loaderContainer = document.createElement("div");
      loaderContainer.classList.add("loaderContainer");

      //SVG Element
      const svgNamespace = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNamespace, "svg");
      svg.setAttribute("width", "300");
      svg.setAttribute("height", "300");
      svg.setAttribute("viewBox", "0 0 525 525");

      const needle = document.createElementNS(svgNamespace, "path");
      needle.setAttribute("id", "needle");
      needle.setAttribute(
        "d",
        "M504.469,128.555l-363.188,294.071c0,0 291.203,-256.406 350.604,-308.447c14.827,-12.989 28.904,0.503 12.584,14.376Zm-32.911,20.876c3.854,-3.163 24.949,-20.597 32.828,-27.506c5.357,-4.697 -1.569,-10.026 -6.401,-5.677c-1.957,1.763 -24.358,20.049 -31.282,25.762c-7.027,5.798 -0.729,12.002 4.855,7.421Z"
      );
      needle.setAttribute("fill", "white");
      needle.setAttribute("stroke", "none");
      svg.appendChild(needle);

      const thread = document.createElementNS(svgNamespace, "path");
      thread.setAttribute("id", "thread");
      thread.setAttribute(
        "d",
        "M447.731,458.734c0,0 91.643,-113.755 47.495,-131.22c-61.917,-24.493 -117.541,96.965 -223.908,141.702c-83.603,35.163 -276.841,27.59 -256.614,-96.811c21.452,-131.934 269.477,-145.122 311.822,-143.37c58.42,2.417 128.458,14.801 172.819,-23.29c25.036,-21.497 4.038,-63.27 -45.156,-84.683c-45.076,-19.621 -19.521,-72.894 7.772,-83.478"
      );
      thread.setAttribute("stroke", "white");
      thread.setAttribute("stroke-width", "1");
      thread.setAttribute("fill", "none");
      svg.appendChild(thread);

      let loaderText = document.createElement("p");
      loaderText.innerText = "Uploading...";
      loaderText.classList.add("paragraph", "testimonial");
      loaderContainer.appendChild(svg);
      loaderContainer.appendChild(loaderText);
      statusContainer.appendChild(loaderContainer);
      statusContainer.appendChild(submissionSuccess);
      statusContainer.appendChild(submissionFailure);

      let webAppEndPoint =
        "https://script.google.com/macros/s/AKfycbyKVNRr16kTNBqdQHd_yG2hmkbX9-1FOTU_qXWw65ZRGMeXkSV-7hsSPT_oegPyesrFNA/exec";

      // Append elements to the form
      form.appendChild(nameLabel);
      form.appendChild(nameInput);
      form.appendChild(nameError);
      form.appendChild(emailLabel);
      form.appendChild(emailInput);
      form.appendChild(emailError);
      form.appendChild(descriptionLabel);
      form.appendChild(descriptionInput);
      form.appendChild(photoLabel);
      form.appendChild(photoInputWrapper);
      form.appendChild(submitButton);
      form.appendChild(imgPreviewContainer);

      formContainer.appendChild(form);
      formContainer.appendChild(statusContainer);

      const updateStatus = (elementHide, elementShow, height) => {
        elementShow.style.height = height + "px";
        elementHide.style.display = "none";
        elementShow.style.display = "flex";
      };
      const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formHeight = formContainer.offsetHeight;
        let formData = {
          name: `${nameInput.value}`,
          email: `${emailInput.value}`,
          description: `${descriptionInput.value}`,
          photos: [],
        };

        let inputsValid = validateForm(nameInput.value, emailInput.value);
        if (inputsValid) {
          updateStatus(form, statusContainer, formHeight);
          for (let i = 0; i < photos.length; i++) {
            const photo = photos[i];
            const base64 = await toBase64(photo);
            formData.photos.push({
              name: photo.name,
              type: photo.type,
              data: base64,
            });
          }

          // Convert the object to JSON
          const jsonData = JSON.stringify(formData);

          let headers = {
            Accept: "application/json",
          };
          let options = {
            method: "POST",
            contentType: "application/json",
            headers: headers,
            body: jsonData,
            muteHttpExceptions: true,
          };

          fetch(webAppEndPoint, options)
            .then((response) => response.text())
            .then((data) => {
              loaderContainer.style.display = "none";
              submissionSuccess.style.display = "block";
              nameInput.value = "";
              emailInput.value = "";
              descriptionInput.value = "";
              photos = [];
              imgPreviewContainer.innerHTML = "";
              setTimeout(() => {
                submissionSuccess.style.display = "none";
                statusContainer.style.display = "none";
                form.style.display = "flex";
                form.style.flexDirection = "column";
              }, 3000);
            })
            .catch((error) => {
              console.error("Error:", error);
              loaderContainer.style.display = "none";
              submissionFailure.style.display = "block";

              setTimeout(() => {
                submissionFailure.style.display = "none";
                statusContainer.style.display = "none";
                form.style.display = "flex";
                form.style.flexDirection = "column";
              }, 3000);
            });
        }
      };

      const handleFileSelect = (event) => {
        const files = event.target.files;
        imgPreviewContainer.innerHTML = "";
        // Clear previous previews
        photos = [];

        Array.from(files).forEach((file) => {
          if (!file.type.startsWith("image/")) {
            alert("Only images are allowed");
            return;
          }
          photos.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.classList.add("preview-img");
            imgPreviewContainer.appendChild(img);
            const imgTile = document.createElement("div");
            imgTile.classList.add("preview-img-tile");
            imgTile.appendChild(img);
            imgPreviewContainer.appendChild(imgTile);
          };
          reader.readAsDataURL(file);
        });
      };

      submitButton.addEventListener("click", handleFormSubmit);
      photoInput.addEventListener("change", handleFileSelect);
    } else {
      if (pollingAttempts > 0) {
        setTimeout(placeCustomForm, pollingTimeout);
      } else {
        return;
      }
    }
  }
  placeCustomForm();

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  }
  function validateForm(name, email) {
    // Clear previous error messages
    clearValidationText();

    var valid = true;

    // Check if name is provided
    if (name.trim() === "") {
      document.getElementById("nameError").innerText = "Name is required.";
      valid = false;
    }

    // Check if email is provided and has a valid format
    if (email.trim() === "") {
      document.getElementById("emailError").innerText = "Email is required.";
      valid = false;
    } else if (!validateEmail(email)) {
      document.getElementById("emailError").innerText =
        "Please enter a valid email address.";
      valid = false;
    }

    if (!valid) {
      setTimeout(clearValidationText, 2500);
    }
    return valid;
  }

  function validateEmail(email) {
    // Simple email validation regex
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function clearValidationText() {
    document.getElementById("nameError").innerText = "";
    document.getElementById("emailError").innerText = "";
  }

  function getCustomStyles() {
    const style = document.createElement("style");
    style.id = "switchbackCustomStyles";
    style.textContent = `
    input, textarea {
      border: 1px solid #ccc;   
      padding: 15px;            
      border-radius: 4px;      
      font-size: 16px;          
      outline: none;            
      box-sizing: border-box;   
  }

  input:focus, textarea:focus {
      border-color: #66afe9;    /* Optional focus border color */
      box-shadow: 0 0 5px rgba(102, 175, 233, 0.6); /* Optional focus shadow */
  }

          /* Style the custom button */
  .upload-btn-wrapper {
      position: relative;
      overflow: hidden;
      display: inline-block;
      margin-top: 10px;
      display: inline-block;
      border: 1px solid #ccc;
      padding: 6px 0px;
      cursor: pointer;
      background-color: #FEFEF6;
      color: #062732;
      border-radius: 4px;
      width: 100px;
      height: 38px;
      text-align: center;
vertical-align:middle;
  }
  .upload-btn-wrapper input[type=file] {
font-size: 5px;
position: absolute;
left: 0;
top: 0;
opacity: 0;
}

  /* Style the label */
  .upload-btn-wrapper:hover {
      background-color: #e9e9e9;
  }

  /* Style the label */
  .upload-btn-wrapper::before {
      content: 'Select Photos';
  }

  .inputError {
  color: #f69828;
  }
  
  .preview-img-container{
display: grid;
gap: 10px;
padding-bottom: 10px;
grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  margin: 10px 0;
  }
  
  .preview-img-tile{
  width: 100px;
  height: 100px;
  border-radius: 4px;
  padding-bottom: 10px;
  display: inline-block;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2);
  }
  .preview-img{
  width: 100px;
  height: 100px;
  border-radius: 4px;
  }
  .submission-status-container{
   display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
  }
  submission-success {
  display:none;
  }
submission-failure {
           display: none;
  }
        .loaderContainer {
        display: flex;
      flex-direction: column;
      gap: 20px;
      justify-content: center;
      align-items: center;
  }
  
    @keyframes animateThread {
      from {
        stroke-dashoffset: 2000;
      }
      to {
        stroke-dashoffset: 0;
      }
    }
    #thread {
      stroke-dasharray: 2000;
      stroke-dashoffset: 2000;
      animation: animateThread 2s linear infinite;
    }
    `;
    return style;
  }
})();