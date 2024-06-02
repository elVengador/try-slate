import { isValidElement, useCallback, useState } from "react";
// TypeScript users only add this code
import { BaseEditor, Editor, Transforms, createEditor } from "slate";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  Slate,
  withReact,
} from "slate-react";
import "./App.css";

type CustomElement = { type: "paragraph" | "code"; children: CustomText[] };
type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const CodeElement = (props: RenderElementProps) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const initialValue: CustomElement[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

function App() {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props: RenderElementProps) => {
    console.log("renderElement:", { type: props.element.type });
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  console.log({ editor });

  return (
    <main className="wrapper">
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          className="custom-editor"
          renderElement={renderElement}
          onKeyDown={(event) => {
            console.log("key-down");
            if (event.key === "`" && event.ctrlKey) {
              // Prevent the "`" from being inserted by default.
              event.preventDefault();
              // Otherwise, set the currently selected blocks type to "code".
              Transforms.setNodes(
                editor,
                { type: "code" },
                {
                  match: (n) => {
                    console.log("run", {
                      1: isValidElement(n),
                      2: Editor.isBlock(editor, n),
                    });
                    // return Editor.isBlock(editor, n as CustomElement);
                    return true;
                  },
                }
              );
            }
          }}
        />
      </Slate>
    </main>
  );
}

export default App;
