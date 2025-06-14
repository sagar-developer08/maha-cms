import API from "./config";

// Blog data model:
// {
//   title: string,
//   body: object, // JSON object
//   date: string (ISO date),
//   written_by: string,
//   image: string (URL, optional)
// }

// Create a blog
export const createBlog = (formData) => {
  // formData should be an object matching the above model
  // body should be an object, not a string
  return API.post("/blog", formData);
};

// Get all blogs
export const getAllBlogs = () => {
  return API.get("/blog");
};

// Get a blog by ID
export const getBlogById = (id) => {
  return API.get(`/blog/${id}`);
};

// Update a blog by ID
export const updateBlog = (id, formData) => {
  // formData should match the model above
  return API.put(`/blog/${id}`, formData);
};

// Delete a blog by ID
export const deleteBlog = (id) => {
  return API.delete(`/blog/${id}`);
};
