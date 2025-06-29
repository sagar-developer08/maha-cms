import API from "./config";

// Category data model:
// {
//   name: { en: string, ar: string },
//   slug: string,
//   description: { en: string, ar: string },
//   status: string (active/inactive)
// }

// Create a category
export const createCategory = (formData) => {
  return API.post("/category", formData);
};

// Get all categories
export const getAllCategories = () => {
  return API.get("/category");
};

// Search categories
export const searchCategories = (query) => {
  return API.get(`/category/search?q=${query}`);
};

// Get a category by ID
export const getCategoryById = (id) => {
  return API.get(`/category/${id}`);
};

// Get a category by slug
export const getCategoryBySlug = (slug) => {
  return API.get(`/category/slug/${slug}`);
};

// Update a category by ID
export const updateCategory = (id, formData) => {
  return API.put(`/category/${id}`, formData);
};

// Delete a category by ID
export const deleteCategory = (id) => {
  return API.delete(`/category/${id}`);
}; 