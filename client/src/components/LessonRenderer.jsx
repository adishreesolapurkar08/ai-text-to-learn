import HeadingBlock from './blocks/HeadingBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import CodeBlock from './blocks/CodeBlock';
import MCQBlock from './blocks/MCQBlock';

const blockComponents = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  code: CodeBlock,
  mcq: MCQBlock,
};

export default function LessonRenderer({ content = [] }) {
  if (!content.length) {
    return null;
  }

  return (
    <>
      {content.map((block, index) => {
        const Component = blockComponents[block.type];
        if (!Component) return null;
        return <Component key={index} {...block} />;
      })}
    </>
  );
}
