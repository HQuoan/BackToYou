const POST_LABEL_PRIORITY = import.meta.env.VITE_POST_LABEL_PRIORITY;

function PriorityLabel({postLabel}) {
  return (  postLabel === POST_LABEL_PRIORITY &&
      <span className="post-label-block">Tin ưu tiên</span>
  );
}

export default PriorityLabel;
