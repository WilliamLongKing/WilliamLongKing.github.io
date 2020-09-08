//Setting up AWS S3 Configuration
var albumBucketName = "wlkimagerepo";
var bucketRegion = "ca-central-1";
var IdentityPoolId = "ca-central-1:8d775994-580d-4b11-a231-3f4855423f09";

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: albumBucketName }
});

viewAlbum('public');

//Modal Image expansion - based on what image you select (labelled by number), expand view of that image and filename 
function enlargen(count) {
  var modal = document.getElementById("myModal");
  var modalImg = document.getElementById("img01");
  var captionText = document.getElementById("caption");
  var targetImage = document.getElementById("img" + count)
  var targetCaption = document.getElementById("caption" + count)
  modal.style.display = "block";
  modalImg.src = targetImage.src;
  captionText.innerHTML = targetCaption.innerHTML;
}


//Get objects from the bucket associated with the gallery, and insert the corresponding HTML code to the page
function viewAlbum(albumName) {
  var albumPhotosKey = encodeURIComponent(albumName) + "/";
  s3.listObjects({ Prefix: albumPhotosKey }, function(err, data) {
    if (err) {
      return alert("There was an error viewing your album: " + err.message);
    }
    // 'this' references the AWS.Response instance that represents the response
    var href = this.request.httpRequest.endpoint.href;
    var bucketUrl = href + albumBucketName + "/";
    //Used to identify the image and caption for the modal
    var count = -1; 
    var photos = data.Contents.map(function(photo) {
      ++count;
      var photoKey = photo.Key;
      var photoUrl = bucketUrl + encodeURIComponent(photoKey);
      return getHtml([
        "<div class='display'>",
        '<img class="displayImage" id="img' +count + '"style="width:auto;height:256;" src="' + photoUrl + '" onclick="enlargen(' + count + ')">',
        "<div>",
        "<input type='checkbox' class='checkbox-" + albumName+ "'id='check" + count +"' name='" + photoKey + "' value='Bike'>",
        /*
          "<button onclick=\"deletePhoto('" +
            albumName +
            "','" +
            photoKey +
            "')\">",
          "Delete",
          "</button>",
        */
        "<p id='caption" + count + "'class='caption'>",
        photoKey.replace(albumPhotosKey, ""),
        "</p>",
        "</div>",
        "</div>"
      ]);
    });
    var message = photos.length
      ? "<p>Click on an image to enlargen view. Click 'Delete Selected Images' to delete all selected photos. Click 'Update Gallery' to refresh the gallery.</p>"
      : "<p>Your album is empty. Browse for images to upload in the 'Upload Images' section.</p>";
    var htmlTemplate = [
      getHtml(photos)
    ];
    document.getElementById("gallery").innerHTML = getHtml(htmlTemplate);
    document.getElementById("directions").innerHTML = message;
  });
}

//Add the selected photos from the upload section to AWS S3 Bucket
function addPhoto(albumName) {
  var files = document.getElementById("imageupload").files;
  if (!files.length) {
    return alert("Please choose a file to upload first.");
  }
  for (let i = 0; i < files.length; i++) {
    var file = files[i];
    var fileName = file.name;
    var albumPhotosKey = encodeURIComponent(albumName) + "/";

    var photoKey = albumPhotosKey + fileName;

    // Use S3 ManagedUpload class as it supports multipart uploads
    var upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: albumBucketName,
        Key: photoKey,
        Body: file,
        ACL: "public-read"
      }
    });
    console.log(upload);

    var promise = upload.promise();

    promise.then(
      function(data) {
        alert("Successfully uploaded photo.");
        viewAlbum(albumName);
      },
      function(err) {
        console.log("oh no");
        console.log(err);
        return alert("There was an error uploading your photo: ", err.message);
      }
    );
  }
  
}

//Delete selected photos from gallery checkboxes
function multiDelete(albumName) {
  var images = document.getElementsByClassName("checkbox-" + albumName);
  for (let i = 0; i < images.length; i++) {
    if(images[i].checked) {
      deletePhoto(albumName, images[i].name)  
    }
    
  }
}

//Delete selected photo from the AWS S3 Bucket
function deletePhoto(albumName, photoKey) {
  s3.deleteObject({ Key: photoKey }, function(err, data) {
    if (err) {
      return alert("There was an error deleting your photo: ", err.message);
    }
    alert("Successfully deleted photo.");
    viewAlbum(albumName);
  });
}