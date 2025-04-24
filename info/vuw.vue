<template>
    <div class="container py-5">
      <h2 class="mb-4 text-center">Image Cropper with Upload and Download</h2>
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="border p-3">
            <h5 class="text-center">Upload Image</h5>
            <input type="file" class="form-control mb-3" @change="onFileChange" />
          </div>
        </div>
      </div>
      <div class="row justify-content-center mt-4">
        <div class="col-md-6">
          <div v-if="imageSrc" class="border p-3 text-center">
            <h5>Crop Image</h5>
            <cropper
              class="cropper"
              :src="imageSrc"
              :stencil-props="{ width: 400, height: 400 }"
              @change="onCropChange"
            ></cropper>
            <button class="btn btn-success mt-3" @click="uploadImage" :disabled="!croppedImage">
              Upload Image
            </button>
          </div>
        </div>
      </div>
      <div v-if="downloadUrl" class="text-center mt-4">
        <a class="btn btn-primary" :href="downloadUrl" download="cropped-image.png">
          Download Cropped Image
        </a>
      </div>
    </div>
  </template>
  
  <script>
  import { Cropper } from "vue-advanced-cropper";
  import "vue-advanced-cropper/dist/style.css";
  import { funcApi } from "@/tools/functionsApi";
  
  export default {
    components: {
      Cropper,
    },
    data() {
      return {
        imageSrc: null, // Original image source
        croppedImage: null, // Cropped Base64 image
        downloadUrl: null, // URL for the cropped image
      };
    },
    methods: {
      onFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imageSrc = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      onCropChange({ canvas }) {
        if (canvas) {
          this.croppedImage = canvas.toDataURL();
        }
      },
      async uploadImage() {
        if (!this.croppedImage) {
          alert("Please crop the image first!");
          return;
        }
        try {
          const response = await funcApi.post(`/api/upload/cropped/image`, {
            image: this.croppedImage,
          });
          this.downloadUrl = response.data.url; 
          if (response) {
            toast.fire({
              icon: "success",
              timer: 3000,
              title: "Image Uploaded Successfully",
            });
  
            // Reset the cropper
            this.imageSrc = null;
            this.croppedImage = null;
          }
        } catch (error) {
          console.error(error);
          alert("Failed to upload image.");
        }
      },
    },
  };
  </script>
  
  <style>
  .cropper {
    height: 400px;
    width: 400px;
    margin: 0 auto;
    background-color: #f8f9fa;
  }
  </style>
  