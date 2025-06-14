import React from "react";
import EnhancedBlogForm from "src/components/Dashboard/Admin/Blogs/BlogsForm";

function BlogForm() {
    console.log("BlogForm component rendering...");
    
    try {
        return (
            <div>
                <h1>Debug: BlogForm Page Loaded</h1>
                <EnhancedBlogForm />
            </div>
        );
    } catch (error) {
        console.error("Error in BlogForm:", error);
        return (
            <div className="p-5">
                <h2>Error Loading Blog Form</h2>
                <pre>{error.toString()}</pre>
                <p>Please check the console for more details.</p>
            </div>
        );
    }
}

export default BlogForm;
