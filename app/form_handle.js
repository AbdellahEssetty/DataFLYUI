// Generate JSON configuration file. 
// July 20th 2023.
// Done by ChatGPT with some minor modifications.


document.getElementById('config-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevents the default form submission behavior

    // Get the form data
    const formData = new FormData(this);
    const formDataObject = {};

    // Access form data using "id" attributes as keys
    formData.forEach((value, key) => {
      const idAttribute = document.querySelector(`[name="${key}"]`).id;
      // You can only send string literals as values and keys, we need to convert to int values (For now the only int values are CAN baudrates).
      formDataObject[idAttribute] = idAttribute.includes('CAN')? parseInt(value) : value;
    });

    // Log the form data to the console for debugging
    console.log(formDataObject);

    // Convert the form data to JSON
    const jsonData = JSON.stringify(formDataObject, null, 2);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Generate a unique file name
    const fileName = `form_data_${Date.now()}.json`;

    // Create a download link and trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    downloadLink.click();

    // Clean up the URL object
    URL.revokeObjectURL(downloadLink.href);
  });
