import { useState, useRef, useMemo } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import JoditEditor from "jodit-react";
import HtmlReactParser from "html-react-parser";
import { useTheme } from "../context/ThemeContext";
// import axios from "axios";
// import { useUserStore } from "../store/useStore";
// import axiosInstance from "../utils/axiosInstance";

export default function ProductsCategories(){

  // const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  // const [addName, setAddName] = useState<string>('');
  // const [addImage, setAddImage] = useState<File | null>(null);

  const editor = useRef(null);
  const [content, setContent] = useState<string>('');

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "أدخل اسم القسم",
      allowResizeX: false,
      allowResizeY: false,
      language: "ar",
      theme: useTheme().theme === "dark" ? "dark" : "default",
      buttons: ["bold", "italic", "underline", "ul", "ol", "outdent", "indent", "table", "hr", "eraser", "fullsize", "undo", "redo", "selectall", "cut", "copy", "paste", "font", "fontsize", "brush", "paragraph", "align", "left", "center", "right", "justify"],
    }),
    []
  );

  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="أقسام المنتجات" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <JoditEditor
            className="h-96"
            value={content}
            onBlur={newContent => setContent(newContent)}
            onChange={newContent => setContent(newContent)}
            tabIndex={1}
            ref={editor}
            config={config}
          />
          <div>
            <h2 className="text-2xl font-semibold mb-4">محتوى المحرر</h2>
            <div className="border p-4 rounded-lg bg-gray-50">
              {HtmlReactParser(content)}
            </div>
          </div>
        </div>
      </div>
  );
}
