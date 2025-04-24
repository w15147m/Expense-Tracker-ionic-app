<template>
    <form @submit.prevent="submitForm" class="needs-validation" novalidate>
      <div class="mb-3">
        <label for="name" class="form-label">Name:</label>
        <input
          v-model="form.name"
          id="name"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.name }"
          @input="validateField('name')"
        />
        <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
      </div>
  
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input
          v-model="form.email"
          id="email"
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errors.email }"
          @input="validateField('email')"
        />
        <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
      </div>
  
      <div class="mb-3">
        <label for="phone" class="form-label">Phone:</label>
        <input
          v-model="form.phone"
          id="phone"
          type="tel"
          class="form-control"
          :class="{ 'is-invalid': errors.phone }"
          @input="validateField('phone')"
        />
        <div class="invalid-feedback" v-if="errors.phone">{{ errors.phone }}</div>
      </div>
  
      <div class="mb-3">
        <label for="age" class="form-label">Age:</label>
        <input
          v-model="form.age"
          id="age"
          type="number"
          class="form-control"
          :class="{ 'is-invalid': errors.age }"
          @input="validateField('age')"
        />
        <div class="invalid-feedback" v-if="errors.age">{{ errors.age }}</div>
      </div>
  
      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input
          v-model="form.password"
          id="password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.password }"
          @input="validateField('password')"
          />
        <div class="invalid-feedback" v-if="errors.password">{{ errors.password }}</div>
      </div>
  
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirm Password:</label>
        <input
          v-model="form.confirmPassword"
          id="confirmPassword"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.confirmPassword }"
          @input="validateField('confirmPassword')"
          />
        <div class="invalid-feedback" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</div>
      </div>
  
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </template>
  
  <script>
  import { Form } from "vform";
  import * as yup from "yup";
  
  // Define the schema outside the submitForm method
  const formSchema = yup.object().shape({
    name: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .matches(/^[A-Za-z\s]+$/, "Name must only contain letters and spaces"),
  
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required")
      .min(5, "Email must be at least 5 characters"),
  
    phone: yup
      .string()
      .required("Phone number is required"),
  
    age: yup
      .number()
      .required("Age is required")
      .positive("Age must be a positive number")
      .integer("Age must be an integer")
      .min(18, "You must be at least 18 years old")
      .max(100, "Age cannot exceed 100 years"),
  
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-zA-Z]/, "Password must contain at least one letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(/[@$!%*?&]/, "Password must contain at least one special character"),
  
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });
  
  export default {
    data() {
      return {
        form: new Form({
          name: "",
          email: "",
          phone: "",
          age: "",
          password: "",
          confirmPassword: "",
        }),
        errors: {}, // For Yup validation errors
      };
    },
    methods: {
      async submitForm() {
        try {
          // Reset errors before validation
          this.errors = {}; // Clear errors
          // Validate using the schema defined outside the method
          await formSchema.validate(this.form, { abortEarly: false });
  
          // Server-side validation with VForm
          await this.form.post("/api/submit");
          alert("Form submitted successfully!");
          this.form.reset();
        } catch (err) {
          if (err.name === "ValidationError") {
            // Handle Yup validation errors
            err.inner.forEach((error) => {
              this.errors[error.path] = error.message; // Direct assignment in Vue 3
            });
          } else {
            console.error("Submission failed:", err);
          }
        }
      },
  
      // Validate individual field
      async validateField(field) {
        this.errors = {}; // Clear all errors
        try {
          await formSchema.validateAt(field, this.form); // Validate just the field being edited
        } catch (err) {
          if (err.name === "ValidationError") {
            this.errors[err.path] = err.message; // Update errors for that field only
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Optional custom styles for form validation */
  </style>
  