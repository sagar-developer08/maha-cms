import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

function Index(props) {
  const cloudinaryRaf = useRef();
  const { widgetRef, setUploadedUrls } = props;

  useEffect(() => {
    cloudinaryRaf.current = window.cloudinary;
    widgetRef.current = cloudinaryRaf.current.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_cloudinaryname,
        uploadPreset: import.meta.env.VITE_cloudinarypresents,
        apiKey: import.meta.env.VITE_cloudinaryAPIkey,
        sources: ["local"],
        resourceType: "image",
        clientAllowedFormats: "image",
        maxRawFileSize: 5000000,
        maxImageFileSize: 5000000,
        maxFileSize: 5000000,
        multiple: false,
        cropping: true,
      },
      async function (error, result) {
        if (error !== undefined) {
          widgetRef.current.close();
          toast.error(
            error?.statusText || "Something Wrong with File, please try again"
          );
          return;
        }
        if (result?.event == "success") {
          await setUploadedUrls(result?.info?.secure_url);
          toast.success("File Uploaded Successfully");
        }
      }
    );
  }, []);

  return <div id="UploadCloudinarkd93"></div>;
}

export default Index;
